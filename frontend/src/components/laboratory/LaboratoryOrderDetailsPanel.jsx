import { useState, useEffect } from 'react';

function LaboratoryOrderDetailsPanel({ order, onClose, onResultsSubmit }) {
  const [results, setResults] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (order && order.parameters) {
      // Initialize results array with empty values for each parameter
      const initialResults = order.parameters.map((param) => ({
        parameterId: param.parameterId,
        parameterName: param.parameterName,
        resultValue: '',
        unit: param.unit || '',
        minValue: param.minValue,
        maxValue: param.maxValue,
        normalText: param.normalText || '',
      }));
      setResults(initialResults);
    }
  }, [order]);

  const handleResultChange = (index, value) => {
    const updatedResults = [...results];
    updatedResults[index].resultValue = value;
    setResults(updatedResults);
  };

  const handleSubmitResults = async () => {
    // Validate all fields are filled
    const allFilled = results.every((r) => r.resultValue.trim() !== '');
    if (!allFilled) {
      setSaveError('Please enter values for all parameters.');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');

    try {
      const payload = {
        labOrderTestId: order.labOrderTestId,
        patientId: order.patientId,
        testName: order.testName,
        results: results.map((r) => ({
          parameterId: r.parameterId,
          resultValue: r.resultValue,
          unitSnapshot: r.unit,
          minValueSnapshot: r.minValue,
          maxValueSnapshot: r.maxValue,
          normalTextSnapshot: r.normalText,
        })),
      };

      // Call the API endpoint
      if (onResultsSubmit) {
        await onResultsSubmit(payload);
        setSaveMessage('Results submitted successfully!');
        // Reset form after 2 seconds
        setTimeout(() => {
          onClose?.();
        }, 2000);
      }
    } catch (error) {
      setSaveError(
        error.response?.data?.message ||
        error.message ||
        'Failed to submit results'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!order) {
    return null;
  }

  return (
    <div className="lab-order-details-panel">
      <div className="lab-order-details-header">
        <h3>Lab Order Details</h3>
        <button
          className="secondary-button lab-close-button"
          onClick={onClose}
          title="Close details panel"
        >
          ✕
        </button>
      </div>

      <div className="lab-order-details-content">
        {/* Patient & Order Info */}
        <section className="lab-order-info-section">
          <h4 className="lab-section-title">Order Information</h4>
          <div className="lab-info-grid">
            <div className="lab-info-row">
              <label>Order ID:</label>
              <span className="lab-info-value">#{order.labOrderTestId}</span>
            </div>
            <div className="lab-info-row">
              <label>Patient Name:</label>
              <span className="lab-info-value">{order.patientName || 'N/A'}</span>
            </div>
            <div className="lab-info-row">
              <label>Patient ID:</label>
              <span className="lab-info-value">{order.patientId || 'N/A'}</span>
            </div>
            <div className="lab-info-row">
              <label>Test Name:</label>
              <span className="lab-info-value">{order.testName || 'N/A'}</span>
            </div>
            <div className="lab-info-row">
              <label>Sample Type:</label>
              <span className="lab-info-value">
                <span className="sample-type-badge">{order.sampleType || 'N/A'}</span>
              </span>
            </div>
            <div className="lab-info-row">
              <label>Ordered At:</label>
              <span className="lab-info-value">
                {order.orderedAt ? new Date(order.orderedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Alert Messages */}
        {saveError && <div className="alert alert-error">{saveError}</div>}
        {saveMessage && <div className="alert alert-success">{saveMessage}</div>}

        {/* Results Form */}
        <section className="lab-results-form-section">
          <h4 className="lab-section-title">Test Results</h4>
          <div className="lab-results-form">
            {results.length === 0 ? (
              <p className="lab-no-params">No parameters to enter.</p>
            ) : (
              results.map((param, index) => (
                <div key={param.parameterId} className="lab-result-field">
                  <label htmlFor={`param-${index}`} className="lab-param-label">
                    <span className="lab-param-name">{param.parameterName}</span>
                    <span className="lab-param-info">
                      Normal: {param.minValue} - {param.maxValue} {param.unit}
                    </span>
                  </label>
                  <div className="lab-param-input-group">
                    <input
                      id={`param-${index}`}
                      type="text"
                      className="lab-param-input"
                      placeholder={`Enter ${param.parameterName} value`}
                      value={param.resultValue}
                      onChange={(e) => handleResultChange(index, e.target.value)}
                      disabled={isSaving}
                    />
                    <span className="lab-param-unit">{param.unit || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="lab-order-actions">
          <button
            className="secondary-button"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="panel-action-button lab-submit-results-button"
            onClick={handleSubmitResults}
            disabled={isSaving || results.length === 0}
          >
            {isSaving ? 'Submitting...' : 'Submit Results'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LaboratoryOrderDetailsPanel;
