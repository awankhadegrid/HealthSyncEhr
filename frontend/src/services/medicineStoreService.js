import api from './api';

export const MEDICINE_STORE_ENDPOINTS = {
  list: '/api/medicineStore/medicines',
  schedule: '/api/medicineStore/schedule-sync',
  addToMaster: (storeMedicineId) =>
    `/api/medicineStore/medicines/${storeMedicineId}/add-to-master`,
};

export async function getMedicineStoreItems() {
  const response = await api.get(MEDICINE_STORE_ENDPOINTS.list);
  return response.data;
}

export async function scheduleMedicineStoreSync(payload) {
  const response = await api.post(MEDICINE_STORE_ENDPOINTS.schedule, payload);
  return response.data;
}

export async function addMedicineStoreItemToMaster(storeMedicineId, payload) {
  const response = await api.post(
    MEDICINE_STORE_ENDPOINTS.addToMaster(storeMedicineId),
    payload
  );
  return response.data;
}
