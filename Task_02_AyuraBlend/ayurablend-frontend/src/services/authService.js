import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/users/register', { name, email, password });
  return response.data;
};

export const requestOtp = async (email, type) => {
  const response = await api.post('/users/request-otp', { email, type });
  return response.data;
};

export const verifyRegisterOtp = async (name, email, password, otp) => {
  const response = await api.post('/users/verify-register-otp', { name, email, password, otp });
  return response.data;
};

export const verifyLoginOtp = async (email, password, otp) => {
  const response = await api.post('/users/verify-login-otp', { email, password, otp });
  return response.data;
};
