import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PharmacyPanelLayout from '../../components/pharmacy/PharmacyPanelLayout.jsx';
import PharmacyPrescribedPatientTable from '../../components/pharmacy/PharmacyPrescribedPatientTable.jsx';
import { getPrescribedPatients } from '../../services/pharmacyPatientService.js';

function normalizePatients(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function PharmacyDashboardPage() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName =
    location.state?.user?.name || storedUser?.name || 'Pharmacy User';
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPrescribedPatients() {
      setIsLoading(true);

      try {
        const response = await getPrescribedPatients();

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
            'Unable to load prescribed patients. Check backend API.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPrescribedPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <PharmacyPanelLayout heading="Pharmacy Dashboard" userName={userName}>
      {pageError ? <p className="form-error">{pageError}</p> : null}
      <PharmacyPrescribedPatientTable patients={patients} isLoading={isLoading} />
    </PharmacyPanelLayout>
  );
}

export default PharmacyDashboardPage;
