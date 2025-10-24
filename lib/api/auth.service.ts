import apiClient from './api-client';
import { LoginDto, SignupDto } from '@/types/auth';

const prefix = '/api/auth';

export const loginService = (data: LoginDto) => {
    return apiClient.post(`${prefix}/login`, data);
};

export const signupService = (data: SignupDto) => {
    return apiClient.post(`${prefix}/signup`, data);
};

export const logoutService = () => {
    return apiClient.post(`${prefix}/logout`);
};

export const refreshTokenService = () => {
    return apiClient.post(`${prefix}/refresh`);
};
