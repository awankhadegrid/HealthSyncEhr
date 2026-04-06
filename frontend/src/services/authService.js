import api from './api';

const LOGIN_ENDPOINTS = {
  receptionist: '/api/auth/receptionist/login',
  doctor: '/api/auth/doctor/login',
  pharmacy: '/api/auth/pharmacy/login',
};

export async function loginByRole(role, payload) {
  const endpoint = LOGIN_ENDPOINTS[role];

  if (!endpoint) {
    throw new Error('Unsupported login role.');
  }

  const response = await api.post(endpoint, payload);

  return response.data;
}

export { LOGIN_ENDPOINTS };
