import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import DoctorPrescriptionHistoryModal from '../../components/doctor/DoctorPrescriptionHistoryModal.jsx';
import DoctorPanelLayout from '../../components/doctor/DoctorPanelLayout.jsx';
import {
  getPatientPrescriptionHistory,
  getPrescriptionOptions,
  savePatientPrescription,
} from '../../services/doctorPrescriptionService.js';

const INITIAL_PRESCRIPTION = {
  medicineId: '',
  dosageId: '',
  frequencyId: '',
  durationId: '',
};

const MEDICINE_OPTIONS = [
  { id: 1, label: 'Amoxicillin' },
  { id: 2, label: 'Azithromycin' },
  { id: 3, label: 'Cetirizine' },
  { id: 4, label: 'Dolo 650' },
];

const DOSAGE_OPTIONS = [
  { id: 1, label: '250 mg' },
  { id: 2, label: '500 mg' },
  { id: 3, label: '650 mg' },
  { id: 4, label: '1 tablet' },
];

const FREQUENCY_OPTIONS = [
  { id: 1, label: 'Once daily' },
  { id: 2, label: 'Twice daily' },
  { id: 3, label: 'Three times daily' },
  { id: 4, label: 'SOS' },
];

const DURATION_OPTIONS = [
  { id: 1, label: '3 days' },
  { id: 2, label: '5 days' },
  { id: 3, label: '7 days' },
  { id: 4, label: '10 days' },
];

function normalizeOption(option, config) {
  if (typeof option === 'string') {
    return {
      id: option,
      label: option,
    };
  }

  return {
    id: String(option?.[config.idKey] ?? option?.id ?? ''),
    label: option?.[config.labelKey] ?? option?.label ?? '',
  };
}

function normalizeOptionGroup(options, fallbackOptions, config) {
  if (!Array.isArray(options) || options.length === 0) {
    return fallbackOptions.map((option) => ({
      id: String(option.id),
      label: option.label,
    }));
  }

  return options
    .map((option) => normalizeOption(option, config))
    .filter((option) => option.id && option.label);
}

function findSelectedOption(options, selectedId) {
  return options.find((option) => option.id === selectedId) || null;
}

function DoctorPatientSummaryPage() {
  const location = useLocation();
  const { patientId } = useParams();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName = location.state?.user?.name || storedUser?.name || 'Doctor';
  const patient = location.state?.patient || null;
  const [prescriptionForm, setPrescriptionForm] = useState(INITIAL_PRESCRIPTION);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [prescriptionOptions, setPrescriptionOptions] = useState({
    medicines: MEDICINE_OPTIONS,
    dosages: DOSAGE_OPTIONS,
    frequencies: FREQUENCY_OPTIONS,
    durations: DURATION_OPTIONS,
  });
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const patientSummary = patient || {
    patientId,
    firstName: 'Patient',
    lastName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    status: 'INCABIN',
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPrescriptionForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleAddMedicine = (event) => {
    event.preventDefault();
    setSaveError('');

    const selectedMedicine = findSelectedOption(
      prescriptionOptions.medicines,
      prescriptionForm.medicineId
    );
    const selectedDosage = findSelectedOption(
      prescriptionOptions.dosages,
      prescriptionForm.dosageId
    );
    const selectedFrequency = findSelectedOption(
      prescriptionOptions.frequencies,
      prescriptionForm.frequencyId
    );
    const selectedDuration = findSelectedOption(
      prescriptionOptions.durations,
      prescriptionForm.durationId
    );

    if (
      !selectedMedicine ||
      !selectedDosage ||
      !selectedFrequency ||
      !selectedDuration
    ) {
      setSaveError('Select all prescription details before adding medicine.');
      return;
    }

    setPrescriptionItems((currentItems) => [
      ...currentItems,
      {
        id: Date.now(),
        medicineId: selectedMedicine.id,
        medicineName: selectedMedicine.label,
        dosageId: selectedDosage.id,
        dosage: selectedDosage.label,
        frequencyId: selectedFrequency.id,
        frequency: selectedFrequency.label,
        durationId: selectedDuration.id,
        duration: selectedDuration.label,
      },
    ]);

    setPrescriptionForm(INITIAL_PRESCRIPTION);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadPrescriptionOptions() {
      try {
        const response = await getPrescriptionOptions();

        if (!isMounted) {
          return;
        }

        setPrescriptionOptions({
          medicines: normalizeOptionGroup(
            response?.medicines,
            MEDICINE_OPTIONS,
            { idKey: 'medicineId', labelKey: 'medicineName' }
          ),
          dosages: normalizeOptionGroup(
            response?.dosages,
            DOSAGE_OPTIONS,
            { idKey: 'dosageId', labelKey: 'dosageValue' }
          ),
          frequencies: normalizeOptionGroup(
            response?.frequencies,
            FREQUENCY_OPTIONS,
            { idKey: 'frequencyId', labelKey: 'frequency' }
          ),
          durations: normalizeOptionGroup(
            response?.durations,
            DURATION_OPTIONS,
            { idKey: 'durationId', labelKey: 'duration' }
          ),
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setPrescriptionOptions({
          medicines: MEDICINE_OPTIONS,
          dosages: DOSAGE_OPTIONS,
          frequencies: FREQUENCY_OPTIONS,
          durations: DURATION_OPTIONS,
        });
      }
    }

    loadPrescriptionOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenHistory = async () => {
    setIsHistoryOpen(true);
    setHistoryError('');
    setIsHistoryLoading(true);

    try {
      const response = await getPatientPrescriptionHistory(patientSummary.patientId);
      setHistoryData(response);
    } catch (error) {
      setHistoryData([]);
      setHistoryError(
        error.response?.data?.message ||
          'Unable to load previous prescriptions. Check backend API.'
      );
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const buildPrescriptionPayload = () => ({
    patientId: Number(patientSummary.patientId),
    createdAt: new Date().toISOString(),
    items: prescriptionItems.map((item) => ({
      medicineId: Number(item.medicineId),
      dosageId: Number(item.dosageId),
      frequencyId: Number(item.frequencyId),
      durationId: Number(item.durationId),
    })),
  });

  const handlePrintPrescription = async () => {
    if (prescriptionItems.length === 0) {
      setSaveError('Add at least one medicine before printing the prescription.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      await savePatientPrescription(
        patientSummary.patientId,
        buildPrescriptionPayload()
      );
      window.print();
    } catch (error) {
      setSaveError(
        error.response?.data?.message ||
          'Unable to save prescription. Check backend API.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DoctorPanelLayout heading="Patient Summary" userName={userName}>
      <section className="panel-card panel-card--wide doctor-summary-card">
        <div className="doctor-summary__header">
          <div>
            <p className="doctor-summary__eyebrow">Consultation</p>
            <h3>
              {patientSummary.firstName} {patientSummary.lastName}
            </h3>
          </div>

          <div className="doctor-summary__actions">
            <button
              className="secondary-button doctor-summary__history-button"
              type="button"
              onClick={handleOpenHistory}
            >
              Previous prescriptions
            </button>
            <Link className="secondary-button doctor-summary__back" to="/doctor/dashboard">
              Back to dashboard
            </Link>
          </div>
        </div>

        <div className="doctor-patient-overview">
          <div className="doctor-patient-overview__item">
            <span>Patient ID</span>
            <strong>{patientSummary.patientId}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Phone</span>
            <strong>{patientSummary.phone || 'Not added'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Gender</span>
            <strong>{patientSummary.gender || 'Not added'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>DOB</span>
            <strong>{patientSummary.dateOfBirth || 'Not added'}</strong>
          </div>
          <div className="doctor-patient-overview__item">
            <span>Status</span>
            <strong>{patientSummary.status || 'INCABIN'}</strong>
          </div>
        </div>
      </section>

      <section className="doctor-summary-grid">
        <section className="panel-card doctor-prescription-form-card">
          <div className="panel-section__header">
            <h3>Prescription Details</h3>
            <span>Add medicine</span>
          </div>

          <form className="doctor-prescription-form" onSubmit={handleAddMedicine}>
            <label className="input-group" htmlFor="medicineId">
              <span>Medicine Name</span>
              <select
                id="medicineId"
                name="medicineId"
                value={prescriptionForm.medicineId}
                onChange={handleChange}
              >
                <option value="">Select medicine</option>
                {prescriptionOptions.medicines.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="input-group" htmlFor="dosageId">
              <span>Dosage</span>
              <select
                id="dosageId"
                name="dosageId"
                value={prescriptionForm.dosageId}
                onChange={handleChange}
              >
                <option value="">Select dosage</option>
                {prescriptionOptions.dosages.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="input-group" htmlFor="frequencyId">
              <span>Frequency</span>
              <select
                id="frequencyId"
                name="frequencyId"
                value={prescriptionForm.frequencyId}
                onChange={handleChange}
              >
                <option value="">Select frequency</option>
                {prescriptionOptions.frequencies.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="input-group" htmlFor="durationId">
              <span>Duration</span>
              <select
                id="durationId"
                name="durationId"
                value={prescriptionForm.durationId}
                onChange={handleChange}
              >
                <option value="">Select duration</option>
                {prescriptionOptions.durations.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="doctor-prescription-form__actions doctor-prescription-form__full">
              <button className="panel-action-button doctor-add-medicine-button" type="submit">
                Add medicine
              </button>
            </div>
          </form>

          {saveError ? <p className="form-error">{saveError}</p> : null}
        </section>

        <section className="panel-card doctor-prescription-preview-card">
          <div className="panel-section__header doctor-prescription-preview__header">
            <h3>Prescription Preview</h3>
            <div className="doctor-prescription-preview__actions">
              <button
                className="panel-action-button doctor-print-button"
                type="button"
                onClick={handlePrintPrescription}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Print prescription'}
              </button>
            </div>
          </div>

          <article className="prescription-sheet">
            <header className="prescription-sheet__header">
              <div>
                <h4>HealthSync Hospital</h4>
                <p>Clinical Prescription</p>
              </div>
              <div className="prescription-sheet__meta">
                <span>Date</span>
                <strong>{new Date().toISOString().split('T')[0]}</strong>
              </div>
            </header>

            <section className="prescription-sheet__patient">
              <div>
                <span>Patient Name</span>
                <strong>
                  {patientSummary.firstName} {patientSummary.lastName}
                </strong>
              </div>
              <div>
                <span>Patient ID</span>
                <strong>{patientSummary.patientId}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{patientSummary.phone || 'Not added'}</strong>
              </div>
              <div>
                <span>Gender / DOB</span>
                <strong>
                  {patientSummary.gender || 'Not added'} /{' '}
                  {patientSummary.dateOfBirth || 'Not added'}
                </strong>
              </div>
            </section>

            <section className="prescription-sheet__table">
              <div className="prescription-sheet__row prescription-sheet__row--head">
                <span>Medicine</span>
                <span>Dosage</span>
                <span>Frequency</span>
                <span>Duration</span>
              </div>

              {prescriptionItems.length === 0 ? (
                <div className="prescription-sheet__empty">
                  Added medicines will appear here in prescription format.
                </div>
              ) : null}

              {prescriptionItems.map((item) => (
                <div key={item.id} className="prescription-sheet__row">
                  <span>{item.medicineName}</span>
                  <span>{item.dosage}</span>
                  <span>{item.frequency}</span>
                  <span>{item.duration}</span>
                </div>
              ))}
            </section>
          </article>
        </section>
      </section>

      <DoctorPrescriptionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyData={historyData}
        isLoading={isHistoryLoading}
        loadError={historyError}
      />
    </DoctorPanelLayout>
  );
}

export default DoctorPatientSummaryPage;
