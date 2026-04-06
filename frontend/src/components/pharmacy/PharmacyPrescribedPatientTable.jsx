function PharmacyPrescribedPatientTable({ patients, isLoading }) {
  return (
    <section className="panel-card panel-card--wide">
      <div className="panel-section__header">
        <h3>Prescribed Patients</h3>
        <span>{patients.length} patients</span>
      </div>

      <div className="patient-table patient-table--pharmacy">
        <div className="patient-table__head patient-table__head--pharmacy">
          <span>Patient ID</span>
          <span>Name</span>
          <span>Phone</span>
          <span>Gender</span>
          <span>Status</span>
        </div>

        {isLoading ? (
          <div className="patient-table__empty">Loading prescribed patients...</div>
        ) : null}

        {!isLoading && patients.length === 0 ? (
          <div className="patient-table__empty">
            No prescribed patients available.
          </div>
        ) : null}

        {!isLoading
          ? patients.map((patient) => (
              <div
                key={patient.patientId}
                className="patient-table__row patient-table__row--pharmacy"
              >
                <span>{patient.patientId}</span>
                <span>{patient.firstName} {patient.lastName}</span>
                <span>{patient.phone || 'Not added'}</span>
                <span>{patient.gender || 'Not added'}</span>
                <span className="patient-status patient-status--pharmacy">
                  {patient.status || 'PRESCRIBED'}
                </span>
              </div>
            ))
          : null}
      </div>
    </section>
  );
}

export default PharmacyPrescribedPatientTable;
