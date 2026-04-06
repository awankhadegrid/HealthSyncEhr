import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorInCabinPatientTable from '../../components/doctor/DoctorInCabinPatientTable.jsx';
import DoctorPanelLayout from '../../components/doctor/DoctorPanelLayout.jsx';
import { getInCabinPatients } from '../../services/doctorPatientService.js';

function normalizePatients(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function DoctorDashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = location.state?.user?.name || storedUser?.name || 'Doctor';
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadInCabinPatients(showLoader = false) {
      if (showLoader) {
        setIsLoading(true);
      }

      try {
        const response = await getInCabinPatients();

        if (!isMounted) {
          return;
        }

        setPatients(normalizePatients(response));
        setPageError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPatients([]);
        setPageError(
          error.response?.data?.message ||
            'Unable to load in-cabin patients. Check backend API.'
        );
      } finally {
        if (isMounted && showLoader) {
          setIsLoading(false);
        }
      }
    }

    loadInCabinPatients(true);

    const intervalId = window.setInterval(() => {
      loadInCabinPatients();
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <DoctorPanelLayout heading="Doctor Dashboard" userName={userName}>
      {pageError ? <p className="form-error">{pageError}</p> : null}
      <DoctorInCabinPatientTable
        patients={patients}
        isLoading={isLoading}
        onSelectPatient={(patient) =>
          navigate(`/doctor/patients/${patient.patientId}/summary`, {
            state: { patient, user: { name: userName } },
          })
        }
      />
    </DoctorPanelLayout>
  );
}

export default DoctorDashboardPage;
