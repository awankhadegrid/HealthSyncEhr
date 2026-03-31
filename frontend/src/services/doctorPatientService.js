import api from './api';

export const DOCTOR_PATIENT_ENDPOINTS = {
  inCabinList: '/api/doctor/patients/in-cabin',
};

export async function getInCabinPatients() {
  const response = await api.get(DOCTOR_PATIENT_ENDPOINTS.inCabinList);
  return response.data;
}
