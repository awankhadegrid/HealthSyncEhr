import { useState, useEffect } from 'react';
import { getPendingLaboratoryOrders, markSampleAsCollected } from '../../services/laboratoryDashboardService.js';

function LaboratoryPendingOrdersTable({ onSelectOrder, onEnterResults }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterStatuses, setFilterStatuses] = useState(['PENDING', 'SAMPLE_COLLECTED']);
  const [actionLoading, setActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadPendingOrders();
  }, []);

  const loadPendingOrders = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getPendingLaboratoryOrders();
      // Normalize response (could be array or object with data property)
      const data = Array.isArray(response) ? response : response?.data || response?.orders || [];
      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load pending orders. Check backend API.'
      );
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter orders by status (show orders with any of the selected statuses)
  const filteredOrders = filterStatuses.length > 0
    ? orders.filter((order) => filterStatuses.includes(order.status))
    : orders;

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      PENDING: 'lab-status-badge--pending',
      ACCEPTED: 'lab-status-badge--accepted',
      SAMPLE_COLLECTED: 'lab-status-badge--sample',
      DONE: 'lab-status-badge--done',
      CANCELLED: 'lab-status-badge--cancelled',
    };
    return statusMap[status] || 'lab-status-badge--pending';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Pending',
      ACCEPTED: 'Accepted',
      SAMPLE_COLLECTED: 'Sample Collected',
      DONE: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return labels[status] || status;
  };

  const toggleStatusFilter = (status) => {
    setFilterStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleMarkSampleCollected = async (order) => {
    setActionLoading(order.labOrderTestId);
    setError('');
    setActionMessage('');

    try {
      const response = await markSampleAsCollected(order.labOrderTestId);

      if (response.success) {
        setActionMessage(response.message || 'Sample marked as collected successfully!');
        // Reload orders after successful update
        setTimeout(() => {
          loadPendingOrders();
          setActionMessage('');
        }, 1500);
      } else {
        setError(response.message || 'Failed to mark sample as collected');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to mark sample as collected. Check backend API.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="lab-pending-orders-container">
      <div className="lab-pending-orders-header">
        <div>
          <h3>Pending Lab Orders</h3>
          <p className="lab-orders-subtitle">
            {filteredOrders.length} order(s) showing
          </p>
        </div>
        <button
          className="secondary-button"
          onClick={loadPendingOrders}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="lab-status-filters">
        <button
          className={`status-filter-btn ${filterStatuses.includes('PENDING') ? 'active' : ''}`}
          onClick={() => toggleStatusFilter('PENDING')}
        >
          Pending
        </button>
        <button
          className={`status-filter-btn ${filterStatuses.includes('SAMPLE_COLLECTED') ? 'active' : ''}`}
          onClick={() => toggleStatusFilter('SAMPLE_COLLECTED')}
        >
          Sample Collected
        </button>
        <button
          className={`status-filter-btn ${filterStatuses.includes('DONE') ? 'active' : ''}`}
          onClick={() => toggleStatusFilter('DONE')}
        >
          Completed
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      {isLoading && <div className="alert alert-info">Loading pending orders...</div>}

      {!isLoading && filteredOrders.length === 0 && (
        <div className="empty-state">
          <p>No pending lab orders found.</p>
        </div>
      )}

      {!isLoading && filteredOrders.length > 0 && (
        <div className="lab-orders-wrapper">
          <div className="lab-orders-table-wrapper">
            <table className="lab-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Patient Name</th>
                  <th>Test Name</th>
                  <th>Sample Type</th>
                  <th>Ordered At</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.labOrderTestId || order.id}>
                    <td className="lab-order-id">#{order.labOrderTestId}</td>
                    <td className="lab-patient-name">
                      <button
                        className="patient-name-link"
                        onClick={() => onSelectOrder?.(order)}
                        title="Click to enter lab results"
                      >
                        {order.patientName || 'N/A'}
                      </button>
                    </td>
                    <td className="lab-test-name">{order.testName || 'N/A'}</td>
                    <td className="lab-sample-type">
                      <span className="sample-type-badge">{order.sampleType || 'N/A'}</span>
                    </td>
                    <td className="lab-ordered-at">
                      {order.orderedAt ? new Date(order.orderedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td className="lab-status">
                      <span className={`lab-status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="lab-action">
                      {order.status === 'PENDING' ? (
                        <button
                          className="panel-action-button lab-sample-collected-button"
                          onClick={() => handleMarkSampleCollected(order)}
                          disabled={actionLoading === order.labOrderTestId}
                          title="Mark sample as collected"
                        >
                          {actionLoading === order.labOrderTestId ? 'Updating...' : 'Sample Collected'}
                        </button>
                      ) : order.status === 'SAMPLE_COLLECTED' ? (
                        <button
                          className="panel-action-button lab-enter-results-button"
                          onClick={() => onSelectOrder?.(order)}
                          title="Enter test results"
                        >
                          Enter Results
                        </button>
                      ) : (
                        <span className="status-badge-completed">
                          {getStatusLabel(order.status)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaboratoryPendingOrdersTable;
