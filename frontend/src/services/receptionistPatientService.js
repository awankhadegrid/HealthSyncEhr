import api from './api';

export const RECEPTIONIST_PATIENT_ENDPOINTS = {
  listByStatus: '/api/receptionist/patients/listbystatus',
  listByDate: '/api/receptionist/patients/by-date',
  searchByPhone: '/api/receptionist/patients/search',
  register: '/api/receptionist/patients/register',
  updateStatus: (patientId) => `/api/receptionist/patients/${patientId}/status`,
};

export async function getDashboardPatients(statuses = ['PENDING', 'INCABIN']) {
  const params = new URLSearchParams();
  statuses.forEach((status) => params.append('statuses', status));

  const response = await api.get(RECEPTIONIST_PATIENT_ENDPOINTS.listByStatus, {
    params,
  });

  return response.data;
}

export async function searchPatientsByPhone(phone) {
  const response = await api.get(RECEPTIONIST_PATIENT_ENDPOINTS.searchByPhone, {
    params: { phone },
  });

  return response.data;
}

export async function getPatientsByDate(date) {
  const response = await api.get(RECEPTIONIST_PATIENT_ENDPOINTS.listByDate, {
    params: { date },
  });

  return response.data;
}

export async function registerPatient(payload) {
  const response = await api.post(RECEPTIONIST_PATIENT_ENDPOINTS.register, payload);
  return response.data;
}

export async function updatePatientStatus(patientId, status) {
  const response = await api.patch(
    RECEPTIONIST_PATIENT_ENDPOINTS.updateStatus(patientId),
    { status }
  );

  return response.data;
}

export async function movePatientToCabin(patientId) {
  return updatePatientStatus(patientId, 'INCABIN');
}
