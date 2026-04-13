import api from './api';

export const LABORATORY_DASHBOARD_ENDPOINTS = {
  pendingOrders: '/api/laboratory/orders/pending',
  markSampleCollected: '/api/laboratory/orders/sample-collected',
  submitResults: '/api/laboratory/results/submit',
};

export async function getPendingLaboratoryOrders() {
  const response = await api.get(LABORATORY_DASHBOARD_ENDPOINTS.pendingOrders);
  return response.data;
}

export async function markSampleAsCollected(labOrderTestId) {
  const response = await api.post(LABORATORY_DASHBOARD_ENDPOINTS.markSampleCollected, {
    labOrderTestId: labOrderTestId,
  });
  return response.data;
}

export async function submitLabTestResults(resultsPayload) {
  const response = await api.post(LABORATORY_DASHBOARD_ENDPOINTS.submitResults, resultsPayload);
  return response.data;
}
