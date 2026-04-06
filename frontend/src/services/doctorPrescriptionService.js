import api from './api';

export const DOCTOR_PRESCRIPTION_ENDPOINTS = {
  options: '/api/doctor/prescriptions/options',
  save: (patientId) => `/api/doctor/patients/${patientId}/prescriptions`,
  history: (patientId) => `/api/doctor/patients/${patientId}/previousPrescriptions`,
};

export async function getPrescriptionOptions() {
  const response = await api.get(DOCTOR_PRESCRIPTION_ENDPOINTS.options);
  return response.data;
}

export async function savePatientPrescription(patientId, payload) {
  const response = await api.post(
    DOCTOR_PRESCRIPTION_ENDPOINTS.save(patientId),payload
  );

  return response.data;
}

export async function getPatientPrescriptionHistory(patientId) {
  const response = await api.get(
    DOCTOR_PRESCRIPTION_ENDPOINTS.history(patientId)
  );

  return response.data;
}
