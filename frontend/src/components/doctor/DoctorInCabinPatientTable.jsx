function DoctorInCabinPatientTable({ patients, isLoading, onSelectPatient }) {
  return (
    <section className="panel-card panel-card--wide">
      <div className="panel-section__header">
        <h3>Patients In Cabin</h3>
        <span>{patients.length} patients</span>
      </div>

      <div className="patient-table patient-table--doctor">
        <div className="patient-table__head patient-table__head--doctor">
          <span>Patient ID</span>
          <span>Name</span>
          <span>Phone</span>
          <span>Gender</span>
          <span>DOB</span>
          <span>Summary</span>
        </div>

        {isLoading ? (
          <div className="patient-table__empty">Loading in-cabin patients...</div>
        ) : null}

        {!isLoading && patients.length === 0 ? (
          <div className="patient-table__empty">No in-cabin patients found.</div>
        ) : null}

        {!isLoading
          ? patients.map((patient) => (
              <div
                key={patient.patientId}
                className="patient-table__row patient-table__row--doctor"
                role="button"
                tabIndex={0}
                onClick={() => onSelectPatient(patient)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectPatient(patient);
                  }
                }}
              >
                <span>{patient.patientId}</span>
                <span>{patient.firstName} {patient.lastName}</span>
                <span>{patient.phone || 'Not added'}</span>
                <span>{patient.gender || 'Not added'}</span>
                <span>{patient.dateOfBirth || 'Not added'}</span>
                <span className="doctor-table__link">Open summary</span>
              </div>
            ))
          : null}
      </div>
    </section>
  );
}

export default DoctorInCabinPatientTable;
