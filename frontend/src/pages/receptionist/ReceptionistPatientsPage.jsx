import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReceptionistPanelLayout from '../../components/receptionist/ReceptionistPanelLayout.jsx';
import { getPatientsByDate } from '../../services/receptionistPatientService.js';

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function normalizePatients(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function formatDate(date) {
  if (!date) {
    return 'Not added';
  }

  return date;
}

function ReceptionistPatientsPage() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName =
    location.state?.user?.name || storedUser?.name || 'Receptionist';
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    async function loadPatientsByDate() {
      setIsLoading(true);
      setPageError('');

      try {
        const response = await getPatientsByDate(selectedDate);
        setPatients(normalizePatients(response));
      } catch (error) {
        setPatients([]);
        setPageError(
          error.response?.data?.message ||
            'Unable to load patients for the selected date. Check backend API.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPatientsByDate();
  }, [selectedDate]);

  return (
    <ReceptionistPanelLayout heading="Patients" userName={userName}>
      <section className="panel-card panel-card--wide">
        <div className="patients-toolbar">
          <div>
            <div className="panel-section__header patients-toolbar__header">
              <h3>Patients by date</h3>
              <span>{patients.length} patients</span>
            </div>
            <p className="patients-toolbar__copy">
              Select a date to load the patient list returned from backend.
            </p>
          </div>

          <label className="input-group patients-toolbar__filter" htmlFor="patient-list-date">
            <span>Select date</span>
            <input
              id="patient-list-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>
        </div>

        {pageError ? <p className="form-error">{pageError}</p> : null}

        <div className="patient-table patient-table--date-list">
          <div className="patient-table__head patient-table__head--date-list">
            <span>Patient ID</span>
            <span>Name</span>
            <span>Phone</span>
            <span>Gender</span>
            <span>DOB</span>
          </div>

          {isLoading ? (
            <div className="patient-table__empty">Loading patients...</div>
          ) : null}

          {!isLoading && patients.length === 0 ? (
            <div className="patient-table__empty">
              No patients found for {selectedDate}.
            </div>
          ) : null}

          {!isLoading
            ? patients.map((patient) => (
                <div
                  key={patient.patientId}
                  className="patient-table__row patient-table__row--date-list"
                >
                  <span>{patient.patientId}</span>
                  <span>{patient.firstName} {patient.lastName}</span>
                  <span>{patient.phone || 'Not added'}</span>
                  <span>{patient.gender || 'Not added'}</span>
                  <span>{formatDate(patient.dateOfBirth)}</span>
                </div>
              ))
            : null}
        </div>
      </section>
    </ReceptionistPanelLayout>
  );
}

export default ReceptionistPatientsPage;
