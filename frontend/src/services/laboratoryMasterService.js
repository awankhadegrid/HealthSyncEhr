import api from './api';

export const LABORATORY_MASTER_ENDPOINTS = {
  createTest: '/api/laboratory/addLabTests',
  listTests: '/api/laboratory/getAllLabTests',
};

export async function createLaboratoryTest(payload) {
  const response = await api.post(LABORATORY_MASTER_ENDPOINTS.createTest, payload);
  return response.data;
}

export async function getAllLaboratoryTests() {
  const response = await api.get(LABORATORY_MASTER_ENDPOINTS.listTests);
  return response.data;
}
