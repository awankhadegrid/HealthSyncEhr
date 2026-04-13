import { useState } from 'react';
import { submitLabTestResults } from '../../services/laboratoryDashboardService.js';
import '../../styles/lab-results-modal.css';

function LaboratoryResultsModal({ order, onClose, onSubmit }) {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize results object from parameters
  const parameters = order?.parameters || [];

  const handleParameterChange = (parameterId, value) => {
    setResults({
      ...results,
      [parameterId]: value,
    });
  };

  const handleRemarkChange = (e) => {
    setResults({
      ...results,
      remarks: e.target.value,
    });
  };

  const validateResults = () => {
    // Check if all required parameters have values
    for (const param of parameters) {
      if (!results[param.parameterId]) {
        setError(`Please enter value for ${param.parameterName}`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateResults()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        labOrderTestId: order.labOrderTestId,
        labOrderId: order.labOrderId,
        patientId: order.patientId,
        testId: order.testId,
        parameterResults: parameters.map((param) => ({
          parameterId: param.parameterId,
          parameterName: param.parameterName,
          value: results[param.parameterId],
          unit: param.unit,
        })),
        remarks: results.remarks || '',
        resultDate: new Date().toISOString(),
      };

      const response = await submitLabTestResults(payload);
      
      if (response.success || response.data) {
        setSuccessMessage(response.message || 'Results submitted successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.message || 'Failed to submit results');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to submit results. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lab-results-modal-overlay">
      <div className="lab-results-modal">
        {/* Modal Header */}
        <div className="lab-modal-header">
          <h2>Lab Test Results - {order?.testName || 'Test'}</h2>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Patient & Test Info */}
        <div className="lab-modal-info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient Name</span>
              <span className="info-value">{order?.patientName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Patient ID</span>
              <span className="info-value">#{order?.patientId || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Test Name</span>
              <span className="info-value">{order?.testName || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value">#{order?.labOrderTestId || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Sample Type</span>
              <span className="info-value">{order?.sampleType || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ordered Date</span>
              <span className="info-value">
                {order?.orderedAt ? new Date(order.orderedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Results Form */}
        <form onSubmit={handleSubmit} className="lab-results-form">
          {error && <div className="alert alert-error">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Parameters Section */}
          <div className="lab-parameters-section">
            <h3>Test Parameters</h3>
            <div className="parameters-table">
              <div className="parameters-header">
                <div className="param-col param-name">Parameter Name</div>
                <div className="param-col param-value">Result Value</div>
                <div className="param-col param-unit">Unit</div>
                <div className="param-col param-range">Normal Range</div>
              </div>

              <div className="parameters-body">
                {parameters.length > 0 ? (
                  parameters.map((param) => (
                    <div key={param.parameterId} className="parameter-row">
                      <div className="param-col param-name">{param.parameterName}</div>
                      <div className="param-col param-value">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Enter value"
                          value={results[param.parameterId] || ''}
                          onChange={(e) =>
                            handleParameterChange(param.parameterId, e.target.value)
                          }
                          className="param-input"
                          required
                        />
                      </div>
                      <div className="param-col param-unit">{param.unit || '-'}</div>
                      <div className="param-col param-range">
                        {param.minValue && param.maxValue
                          ? `${param.minValue} - ${param.maxValue}`
                          : param.normalText || '-'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-parameters">No parameters found for this test.</div>
                )}
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="lab-remarks-section">
            <label htmlFor="remarks" className="remarks-label">
              Clinical Remarks / Notes (Optional)
            </label>
            <textarea
              id="remarks"
              rows="4"
              placeholder="Add any clinical observations, notes, or interpretations..."
              value={results.remarks || ''}
              onChange={handleRemarkChange}
              className="remarks-textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="lab-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Results'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LaboratoryResultsModal;
