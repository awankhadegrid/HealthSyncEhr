import { useState } from 'react';
import api from '../../services/api.js';

function DoctorLabTestPreview({ labTestItems, onRemoveTest, patientId, onSaveSuccess, onSaveError }) {
  const [isSaving, setIsSaving] = useState(false);

  const handlePrescribeLabTests = async () => {
    if (labTestItems.length === 0) {
      if (onSaveError) {
        onSaveError('Add at least one lab test before prescribing.');
      }
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        patientId: Number(patientId),
        createdAt: new Date().toISOString(),
        labTests: labTestItems.map((item) => ({
          labTestId: item.labTestId,
          testName: item.testName,
          testCode: item.testCode,
          sampleType: item.sampleType,
        })),
      };

      // Call API endpoint to save lab test prescriptions using axios
      const result = await api.post('/api/laboratory/prescribeLabTests', payload);

      if (onSaveSuccess) {
        onSaveSuccess(result?.data?.message || 'Lab tests prescribed successfully.');
      }
    } catch (error) {
      if (onSaveError) {
        onSaveError(
          error.response?.data?.message ||
            error.message ||
            'Unable to prescribe lab tests. Check backend API.'
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="doctor-lab-test-preview">
      <div className="doctor-lab-test-preview__header">
        <h4>Selected Tests</h4>
        <span className="doctor-lab-test-preview__count">{labTestItems.length}</span>
      </div>

      <div className="doctor-lab-test-list">
        {labTestItems.length === 0 ? (
          <p className="doctor-lab-test-list__empty">
            No lab tests added yet. Select a test above to add.
          </p>
        ) : null}

        {labTestItems.map((item) => (
          <div key={item.id} className="doctor-lab-test-item">
            <div className="doctor-lab-test-item__content">
              <div className="doctor-lab-test-item__header">
                <strong>{item.testName}</strong>
                <span className="doctor-lab-test-item__code">{item.testCode}</span>
              </div>
              <div className="doctor-lab-test-item__details">
                <span className="doctor-lab-test-item__sample">
                  <strong>Sample:</strong> {item.sampleType}
                </span>
                {item.parameters && item.parameters.length > 0 ? (
                  <span className="doctor-lab-test-item__params">
                    <strong>Parameters:</strong> {item.parameters.length}
                  </span>
                ) : null}
              </div>
            </div>

            <button
              className="secondary-button doctor-lab-test-item__remove"
              type="button"
              onClick={() => onRemoveTest(item.id)}
              title="Remove this lab test"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {labTestItems.length > 0 ? (
        <button
          className="panel-action-button doctor-prescribe-lab-test-button"
          type="button"
          onClick={handlePrescribeLabTests}
          disabled={isSaving}
        >
          {isSaving ? 'Prescribing...' : 'Prescribe Lab Tests'}
        </button>
      ) : null}
    </div>
  );
}

export default DoctorLabTestPreview;

