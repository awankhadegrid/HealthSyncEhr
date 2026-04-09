import api from './api';

export const PHARMACY_PATIENT_ENDPOINTS = {
  prescribedList: '/api/pharmacy/patients/prescribed',
  latestPrescription: (patientId) =>
    `/api/pharmacy/patients/${patientId}/latest-prescription`,
  updateStatus: (patientId) => `/api/pharmacy/patients/${patientId}/status`,
};

export async function getPrescribedPatients() {
  const response = await api.get(PHARMACY_PATIENT_ENDPOINTS.prescribedList);
  return response.data;
}

export async function getLatestPatientPrescription(patientId) {
  const response = await api.get(
    PHARMACY_PATIENT_ENDPOINTS.latestPrescription(patientId)
  );
  return response.data;
}

export async function updatePharmacyPatientStatus(patientId, status) {
  const response = await api.patch(
    PHARMACY_PATIENT_ENDPOINTS.updateStatus(patientId),
    { status }
  );
  return response.data;
}
