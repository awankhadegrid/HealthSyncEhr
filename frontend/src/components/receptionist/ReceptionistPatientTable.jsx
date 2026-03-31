function ReceptionistPatientTable({ patients, onMarkInCabin }) {
  return (
    <section className="panel-card panel-card--wide">
      <div className="panel-section__header">
        <h3>Patient queue</h3>
        <span>{patients.length} patients</span>
      </div>

      <div className="patient-table patient-table--queue">
        <div className="patient-table__head patient-table__head--queue">
          <span>Name</span>
          <span>DOB</span>
          <span>Gender</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {patients.map((patient) => (
          <div key={patient.patientId} className="patient-table__row patient-table__row--queue">
            <span>{patient.firstName} {patient.lastName}</span>
            <span>{patient.dateOfBirth || 'Not added'}</span>
            <span>{patient.gender || 'Not added'}</span>
            <span className="patient-status">{patient.status}</span>
            <button
              className="secondary-button"
              type="button"
              onClick={() => onMarkInCabin(patient.patientId)}
              disabled={patient.status === 'INCABIN'}
            >
              {patient.status === 'INCABIN' ? 'In Cabin' : 'Move to Cabin'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ReceptionistPatientTable;
