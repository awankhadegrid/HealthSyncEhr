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

function normalizeOrderTests(order) {
  if (Array.isArray(order?.tests)) {
    return order.tests;
  }

  if (Array.isArray(order?.labTests)) {
    return order.labTests;
  }

  if (Array.isArray(order?.items)) {
    return order.items;
  }

  return [];
}

function normalizeResults(test) {
  if (Array.isArray(test?.results)) {
    return test.results;
  }

  if (Array.isArray(test?.parameters)) {
    return test.parameters;
  }

  return [];
}

function DoctorLabTestHistoryModal({
  isOpen,
  onClose,
  historyData,
  isLoading,
  loadError,
}) {
  if (!isOpen) {
    return null;
  }

  const historyOrders = normalizeHistory(historyData);

  return (
    <div className="modal-overlay" role="presentation">
      <section
        className="patient-modal doctor-history-modal doctor-lab-history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-lab-history-title"
      >
        <div className="patient-modal__header">
          <div>
            <p className="patient-modal__eyebrow">Doctor Panel</p>
            <h3 id="doctor-lab-history-title">Previous Lab Tests</h3>
          </div>
          <button className="patient-modal__close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="patient-modal__body">
          {loadError ? <p className="form-error">{loadError}</p> : null}

          {isLoading ? (
            <div className="doctor-history-table__empty">
              Loading previous lab tests...
            </div>
          ) : null}

          {!isLoading && historyOrders.length === 0 ? (
            <div className="doctor-history-table__empty">
              No previous lab tests found for this patient.
            </div>
          ) : null}

          {!isLoading ? (
            <div className="doctor-history-list">
              {historyOrders.map((order, orderIndex) => {
                const orderTests = normalizeOrderTests(order);

                return (
                  <article
                    key={order.labOrderId || order.orderId || `order-${orderIndex}`}
                    className="doctor-history-card doctor-lab-history-card"
                  >
                    <header className="doctor-history-card__header">
                      <div>
                        <p className="doctor-history-card__eyebrow">Lab Order</p>
                        <h4>
                          Order ID: {order.labOrderId || order.orderId || 'Not available'}
                        </h4>
                      </div>
                      <span className="doctor-history-card__date">
                        {formatDate(order.createdAt || order.orderedAt)}
                      </span>
                    </header>

                    {orderTests.length === 0 ? (
                      <div className="doctor-history-table__empty">
                        No tests found for this order.
                      </div>
                    ) : (
                      <div className="doctor-lab-history-tests">
                        {orderTests.map((test, testIndex) => {
                          const resultRows = normalizeResults(test);

                          return (
                            <section
                              key={
                                test.labOrderTestId ||
                                test.testId ||
                                `${orderIndex}-test-${testIndex}`
                              }
                              className="doctor-lab-history-test-card"
                            >
                              <div className="doctor-lab-history-test-card__header">
                                <div>
                                  <strong>
                                    {test.testName || test.labTestName || 'Lab Test'}
                                  </strong>
                                  <p>
                                    {test.sampleType || 'Sample not added'} ·{' '}
                                    {test.status || order.status || 'PENDING'}
                                  </p>
                                </div>
                              </div>

                              <div className="doctor-lab-history-table">
                                <div className="doctor-lab-history-table__head">
                                  <span>Parameter</span>
                                  <span>Result</span>
                                  <span>Unit</span>
                                  <span>Range</span>
                                  <span>Flag</span>
                                </div>

                                {resultRows.length === 0 ? (
                                  <div className="doctor-history-table__empty">
                                    No result values added for this test.
                                  </div>
                                ) : (
                                  resultRows.map((row, rowIndex) => (
                                    <div
                                      key={
                                        row.labResultId ||
                                        row.parameterId ||
                                        `${testIndex}-row-${rowIndex}`
                                      }
                                      className="doctor-lab-history-table__row"
                                    >
                                      <span>
                                        {row.parameterName ||
                                          row.name ||
                                          'Parameter'}
                                      </span>
                                      <span>
                                        {row.resultValue ??
                                          row.value ??
                                          'Not available'}
                                      </span>
                                      <span>{row.unit || row.unitSnapshot || '-'}</span>
                                      <span>
                                        {row.minValue != null || row.maxValue != null
                                          ? `${row.minValue ?? '-'} - ${row.maxValue ?? '-'}`
                                          : row.normalText || row.normalTextSnapshot || '-'}
                                      </span>
                                      <span>{row.flag || 'NORMAL'}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </section>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default DoctorLabTestHistoryModal;
