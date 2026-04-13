import { useState } from 'react';
import LaboratoryPanelLayout from '../../components/laboratory/LaboratoryPanelLayout.jsx';
import LaboratoryPendingOrdersTable from '../../components/laboratory/LaboratoryPendingOrdersTable.jsx';
import LaboratoryResultsModal from '../../components/laboratory/LaboratoryResultsModal.jsx';

function LaboratoryDashboardPage() {
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = storedUser?.name || 'Laboratory User';
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setShowResultsModal(true);
  };

  const handleCloseModal = () => {
    setShowResultsModal(false);
    setSelectedOrder(null);
  };

  const handleSubmitResults = async (payload) => {
    // Modal handles the API call via submitLabTestResults service
    console.log('Results submitted:', payload);
  };

  return (
    <LaboratoryPanelLayout heading="Laboratory Dashboard" userName={userName}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <LaboratoryPendingOrdersTable 
          onSelectOrder={handleSelectOrder}
        />
      </div>

      {showResultsModal && selectedOrder && (
        <LaboratoryResultsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onSubmit={handleSubmitResults}
        />
      )}
    </LaboratoryPanelLayout>
  );
}

export default LaboratoryDashboardPage;
