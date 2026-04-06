import api from './api';

export const PHARMACY_PATIENT_ENDPOINTS = {
  prescribedList: '/api/pharmacy/patients/prescribed',
};

export async function getPrescribedPatients() {
  const response = await api.get(PHARMACY_PATIENT_ENDPOINTS.prescribedList);
  return response.data;
}
