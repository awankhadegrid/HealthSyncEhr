import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import PharmacyPanelLayout from '../../components/pharmacy/PharmacyPanelLayout.jsx';
import {
  getLatestPatientPrescription,
  updatePharmacyPatientStatus,
} from '../../services/pharmacyPatientService.js';

function normalizePrescription(payload) {
  if (payload?.data) {
    return payload.data;
  }

  return payload || null;
}

function formatDate(value) {
  if (!value) {
    return 'Not added';
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

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount) || amount <= 0) {
    return 'Pending';
  }

  return `Rs ${amount}`;
}

function PharmacyPatientPrescriptionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName =
    location.state?.user?.name || storedUser?.name || 'Pharmacy User';
  const patient = location.state?.patient || {
    patientId,
    firstName: 'Patient',
    lastName: '',
    phone: '',
    gender: '',
    status: 'PRESCRIBED',
  };

  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadLatestPrescription() {
      setIsLoading(true);

      try {
        const response = await getLatestPatientPrescription(patientId);

        if (!isMounted) {
          return;
        }

        setPrescription(normalizePrescription(response));
        setPageError('');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPrescription(null);
        setPageError(
          error.response?.data?.message ||
            'Unable to load the latest prescription. Check backend API.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLatestPrescription();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const prescriptionItems = Array.isArray(prescription?.items)
    ? prescription.items
    : [];
  const totalBill =
    Number(prescription?.totalBill) ||
    prescriptionItems.reduce(
      (total, item) =>
        total + Number(item.pricePerMedicine || item.price_per_medicine || 0),
      0
    );

  const handlePrintBill = () => {
    window.print();
  };

  const handleMarkDone = async () => {
    setIsCompleting(true);
    setPageError('');

    try {
      await updatePharmacyPatientStatus(patientId, 'DONE');
      navigate('/pharmacy/dashboard', {
        state: { user: { name: userName } },
      });
    } catch (error) {
      setPageError(
        error.response?.data?.message ||
          'Unable to complete this billing flow. Check backend API.'
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <PharmacyPanelLayout heading="Prescription Details" userName={userName}>
      <section className="panel-card panel-card--wide doctor-summary-card pharmacy-patient-card">
        <div className="doctor-summary__header">
          <div>
            <p className="doctor-summary__eyebrow">Pharmacy Desk</p>
            <h3>
              {patient.firstName} {patient.lastName}
            </h3>
          </div>

          <div className="doctor-summary__actions">
            <Link className="secondary-button doctor-summary__back" to="/pharmacy/dashboard">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="doctor-patient-overview pharmacy-patient-overview">
          <div className="doctor-patient-overview__item">
            <span>Patient ID</span>
            <strong>{patient.patientId}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Phone</span>
            <strong>{patient.phone || 'Not added'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Gender</span>
            <strong>{patient.gender || 'Not added'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Status</span>
            <strong>{patient.status || 'PRESCRIBED'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Prescription Date</span>
            <strong>{formatDate(prescription?.createdAt)}</strong>
          </div>
        </div>
      </section>

      <section className="panel-card panel-card--wide pharmacy-prescription-card">
        <div className="panel-section__header">
          <h3>Recently Prescribed Medicines</h3>
          <span>{prescriptionItems.length} medicines</span>
        </div>

        {pageError ? <p className="form-error">{pageError}</p> : null}

        <div className="pharmacy-prescription-sheet">
          <header className="pharmacy-prescription-sheet__header">
            <div>
              <h4>HealthSync Hospital</h4>
              <p>Latest Prescription for Dispensing</p>
            </div>
            <div className="pharmacy-prescription-sheet__header-right">
              <div className="pharmacy-prescription-sheet__meta">
                <span>Latest Prescription</span>
                <strong>#{prescription?.prescriptionId || 'Not added'}</strong>
              </div>
              <div className="pharmacy-prescription-sheet__actions">
                <button
                  className="secondary-button pharmacy-secondary-button"
                  type="button"
                  onClick={handlePrintBill}
                >
                  Print Bill
                </button>
                <button
                  className="panel-action-button pharmacy-done-button"
                  type="button"
                  onClick={handleMarkDone}
                  disabled={isCompleting || isLoading}
                >
                  {isCompleting ? 'Saving...' : 'Done'}
                </button>
              </div>
            </div>
          </header>

          <div className="pharmacy-prescription-table">
            <div className="pharmacy-prescription-table__head">
              <span>Medicine</span>
              <span>Type</span>
              <span>Qty</span>
              <span>Dosage</span>
              <span>Frequency</span>
              <span>Duration</span>
              <span>Bill</span>
            </div>

            {isLoading ? (
              <div className="pharmacy-prescription-table__empty">
                Loading latest prescription...
              </div>
            ) : null}

            {!isLoading && prescriptionItems.length === 0 ? (
              <div className="pharmacy-prescription-table__empty">
                No latest prescription available for this patient.
              </div>
            ) : null}

            {!isLoading
              ? prescriptionItems.map((item, index) => (
                  <div
                    key={`${prescription?.prescriptionId || patientId}-${index}`}
                    className="pharmacy-prescription-table__row"
                  >
                    <span>
                      {item.medicineName || item.medicine?.medicineName || 'Medicine'}
                    </span>
                    <span>
                      {item.medicineType || item.medicine_type || 'Not added'}
                    </span>
                    <span>{item.quantity || 'Not added'}</span>
                    <span>
                      {item.dosageValue || item.dosage?.dosageValue || 'Not added'}
                    </span>
                    <span>
                      {item.frequencyValue || item.frequency?.frequency || 'Not added'}
                    </span>
                    <span>
                      {item.durationValue || item.duration?.duration || 'Not added'}
                    </span>
                    <span>
                      {formatCurrency(
                        item.pricePerMedicine || item.price_per_medicine
                      )}
                    </span>
                  </div>
                ))
              : null}
          </div>

          <section className="pharmacy-billing-card">
            <div className="pharmacy-billing-card__summary">
              <div className="pharmacy-billing-card__row pharmacy-billing-card__row--grand">
                <span>Total Medicine Bill</span>
                <strong>{formatCurrency(totalBill)}</strong>
              </div>
            </div>
            <p className="pharmacy-billing-card__copy">
              This total is based on the latest prescribed medicines for this patient.
            </p>
          </section>
        </div>
      </section>
    </PharmacyPanelLayout>
  );
}

export default PharmacyPatientPrescriptionPage;
