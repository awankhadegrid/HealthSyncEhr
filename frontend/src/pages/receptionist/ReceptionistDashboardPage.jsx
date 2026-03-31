import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddPatientModal from '../../components/receptionist/AddPatientModal.jsx';
import ReceptionistPanelLayout from '../../components/receptionist/ReceptionistPanelLayout.jsx';
import ReceptionistPatientTable from '../../components/receptionist/ReceptionistPatientTable.jsx';
import {
  getDashboardPatients,
  movePatientToCabin,
  registerPatient,
  searchPatientsByPhone,
  updatePatientStatus,
} from '../../services/receptionistPatientService.js';

const INITIAL_PATIENT_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  address: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  password: '',
  status: 'PENDING',
};

function normalizePatient(patient) {
  if (!patient || patient.patientId === undefined || patient.patientId === null) {
    return null;
  }

  const numericPatientId = Number(patient.patientId);

  if (!Number.isFinite(numericPatientId)) {
    return null;
  }

  return {
    ...patient,
    patientId: numericPatientId,
    status: patient.status || 'PENDING',
  };
}

function normalizePatients(payload) {
  if (Array.isArray(payload)) {
    return payload.map(normalizePatient).filter(Boolean);
  }

  if (Array.isArray(payload?.data)) {
    return payload.data.map(normalizePatient).filter(Boolean);
  }

  if (payload?.patientId) {
    const patient = normalizePatient(payload);
    return patient ? [patient] : [];
  }

  return [];
}

function ReceptionistDashboardPage() {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
  const userName =
    location.state?.user?.name || storedUser?.name || 'Receptionist';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupState, setLookupState] = useState('idle');
  const [lookupError, setLookupError] = useState('');
  const [matchedPatients, setMatchedPatients] = useState([]);
  const [registrationForm, setRegistrationForm] = useState(INITIAL_PATIENT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queuedPatients, setQueuedPatients] = useState([]);

  useEffect(() => {
    async function loadDashboardPatients() {
      try {
        const response = await getDashboardPatients(['PENDING', 'INCABIN']);
        const patients = normalizePatients(response);
        setQueuedPatients(patients);
      } catch (error) {
        setQueuedPatients([]);
      }
    }

    loadDashboardPatients();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setLookupPhone('');
    setLookupState('idle');
    setLookupError('');
    setMatchedPatients([]);
    setRegistrationForm(INITIAL_PATIENT_FORM);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLookupState('idle');
    setLookupError('');
    setMatchedPatients([]);
  };

  const handlePhoneLookup = async () => {
    if (!lookupPhone.trim()) {
      setLookupError('Enter a phone number first.');
      return;
    }

    setIsSubmitting(true);
    setLookupError('');

    try {
      const response = await searchPatientsByPhone(lookupPhone.trim());
      const foundPatients = normalizePatients(response);

      if (foundPatients.length > 0) {
        setMatchedPatients(foundPatients);
        setLookupState('existing');
      } else {
        setRegistrationForm((currentForm) => ({
          ...currentForm,
          phone: lookupPhone.trim(),
        }));
        setLookupState('register');
      }
    } catch (error) {
      setLookupError(
        error.response?.data?.message ||
          'Unable to search patient by phone. Check backend API.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegistrationChange = (event) => {
    const { name, value } = event.target;

    setRegistrationForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleRegisterPatient = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLookupError('');

    const payload = {
      ...registrationForm,
      status: 'PENDING',
    };

    try {
      const createdPatient = await registerPatient(payload);
      const normalizedPatient = normalizePatient(createdPatient);

      if (!normalizedPatient) {
        throw new Error('Registered patient response is missing a valid numeric patientId.');
      }

      setQueuedPatients((currentPatients) => [
        normalizedPatient,
        ...currentPatients,
      ]);
      handleCloseModal();
    } catch (error) {
      setLookupError(
        error.response?.data?.message ||
          error.message ||
          'Unable to register patient. Check backend API.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectExistingPatient = async (patient) => {
    const normalizedPatient = normalizePatient(patient);

    if (!normalizedPatient) {
      setLookupError('Selected patient is missing a valid numeric patientId.');
      return;
    }

    setIsSubmitting(true);
    setLookupError('');

    try {
      const updatedPatient = await updatePatientStatus(
        normalizedPatient.patientId,
        'PENDING'
      );

      const normalizedUpdatedPatient = normalizePatient({
        ...normalizedPatient,
        ...updatedPatient,
        patientId: updatedPatient?.patientId ?? normalizedPatient.patientId,
        status: updatedPatient?.status || 'PENDING',
      });

      if (!normalizedUpdatedPatient) {
        throw new Error('Backend did not return a valid patientId for the selected patient.');
      }

      setQueuedPatients((currentPatients) => {
        const alreadyQueued = currentPatients.some(
          (queuedPatient) =>
            queuedPatient.patientId === normalizedUpdatedPatient.patientId
        );

        if (alreadyQueued) {
          return currentPatients.map((queuedPatient) =>
            queuedPatient.patientId === normalizedUpdatedPatient.patientId
              ? { ...queuedPatient, ...normalizedUpdatedPatient, status: 'PENDING' }
              : queuedPatient
          );
        }

        return [normalizedUpdatedPatient, ...currentPatients];
      });

      handleCloseModal();
    } catch (error) {
      setLookupError(
        error.response?.data?.message ||
          error.message ||
          'Unable to add existing patient. Check backend API.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkInCabin = async (patientId) => {
    if (!Number.isFinite(Number(patientId))) {
      setLookupError('Patient ID is invalid. Please reload patients from backend.');
      return;
    }

    try {
      const updatedPatient = await movePatientToCabin(patientId);
      const normalizedUpdatedPatient = normalizePatient({
        ...updatedPatient,
        patientId,
        status: updatedPatient?.status || 'INCABIN',
      });

      setQueuedPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient.patientId === patientId
            ? normalizedUpdatedPatient || { ...patient, status: 'INCABIN' }
            : patient
        )
      );
    } catch (error) {
      setLookupError(
        error.response?.data?.message ||
          'Unable to update patient status. Check backend API.'
      );
    }
  };

  return (
    <ReceptionistPanelLayout
      heading="Receptionist Dashboard"
      userName={userName}
      actions={
        <button
          className="panel-action-button panel-topbar__button"
          type="button"
          onClick={handleOpenModal}
        >
          Add patient
        </button>
      }
    >
      <ReceptionistPatientTable
        patients={queuedPatients}
        onMarkInCabin={handleMarkInCabin}
      />

      <AddPatientModal
        isOpen={isModalOpen}
        phoneNumber={lookupPhone}
        onPhoneChange={(event) => setLookupPhone(event.target.value)}
        onLookup={handlePhoneLookup}
        lookupError={lookupError}
        lookupState={lookupState}
        matchedPatients={matchedPatients}
        registrationForm={registrationForm}
        onRegistrationChange={handleRegistrationChange}
        onRegisterPatient={handleRegisterPatient}
        onSelectExistingPatient={handleSelectExistingPatient}
        onClose={handleCloseModal}
        isSubmitting={isSubmitting}
      />
    </ReceptionistPanelLayout>
  );
}

export default ReceptionistDashboardPage;
