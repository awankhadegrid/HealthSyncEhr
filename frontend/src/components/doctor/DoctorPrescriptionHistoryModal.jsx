function formatDate(value) {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeHistory(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function DoctorPrescriptionHistoryModal({
  isOpen,
  onClose,
  historyData,
  isLoading,
  loadError,
}) {
  if (!isOpen) {
    return null;
  }

  const historyRows = normalizeHistory(historyData);

  return (
    <div className="modal-overlay" role="presentation">
      <section
        className="patient-modal doctor-history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-history-title"
      >
        <div className="patient-modal__header">
          <div>
            <p className="patient-modal__eyebrow">Doctor Panel</p>
            <h3 id="doctor-history-title">Previous Prescriptions</h3>
          </div>
          <button className="patient-modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="patient-modal__body">
          {loadError ? <p className="form-error">{loadError}</p> : null}

          {isLoading ? (
            <div className="doctor-history-table__empty">
              Loading previous prescriptions...
            </div>
          ) : null}

          {!isLoading && historyRows.length === 0 ? (
            <div className="doctor-history-table__empty">
              No previous prescriptions found for this patient.
            </div>
          ) : null}

          {!isLoading ? (
            <div className="doctor-history-list">
              {historyRows.map((entry) => (
                <article
                  key={entry.prescriptionId}
                  className="doctor-history-card"
                >
                  <header className="doctor-history-card__header">
                    <div>
                      <p className="doctor-history-card__eyebrow">Prescription</p>
                      <h4>Prescription Id :{entry.prescriptionId}</h4>
                    </div>
                    <span className="doctor-history-card__date">
                      {formatDate(entry.createdAt)}
                    </span>
                  </header>

                    <div className="doctor-history-table">
                      <div className="doctor-history-table__head">
                        <span>Medicine</span>
                        <span>Type</span>
                        <span>Qty</span>
                        <span>Dosage</span>
                        <span>Frequency</span>
                        <span>Duration</span>
                      </div>

                    {Array.isArray(entry.items) && entry.items.length > 0 ? (
                      entry.items.map((item, index) => (
                        <div
                          key={`${entry.prescriptionId}-${index}`}
                          className="doctor-history-table__row"
                        >
                          <span>
                            {item.medicineName || item.medicine?.medicineName || 'Medicine'}
                          </span>
                          <span>
                            {item.medicineType || item.medicine_type || item.type || 'Not added'}
                          </span>
                          <span>
                            {item.quantity || item.Quantity || 'Not added'}
                          </span>
                          <span>
                            {item.dosageValue || item.dosage?.dosageValue || item.dosage || 'Not added'}
                          </span>
                          <span>
                            {item.frequencyValue || item.frequency?.frequency || item.frequency || 'Not added'}
                          </span>
                          <span>
                            {item.durationValue || item.duration?.duration || item.duration || 'Not added'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="doctor-history-table__empty">
                        No medicine details for this prescription.
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default DoctorPrescriptionHistoryModal;
