import api from './api';

export const PHARMACY_MASTER_ENDPOINTS = {
  overview: '/api/pharmacy/masters/prescription-options',
  medicines: '/api/pharmacy/masters/medicines',
  dosages: '/api/pharmacy/masters/addDosages',
  frequencies: '/api/pharmacy/masters/addFrequencies',
  durations: '/api/pharmacy/masters/addDurations',
};

export async function getPrescriptionMasterData() {
  const response = await api.get(PHARMACY_MASTER_ENDPOINTS.overview);
  return response.data;
}

export async function createMedicineMaster(payload) {
  const response = await api.post(PHARMACY_MASTER_ENDPOINTS.medicines, payload);
  return response.data;
}

export async function createDosageMaster(payload) {
  const response = await api.post(PHARMACY_MASTER_ENDPOINTS.dosages, payload);
  return response.data;
}

export async function createFrequencyMaster(payload) {
  const response = await api.post(PHARMACY_MASTER_ENDPOINTS.frequencies, payload);
  return response.data;
}

export async function createDurationMaster(payload) {
  const response = await api.post(PHARMACY_MASTER_ENDPOINTS.durations, payload);
  return response.data;
}
