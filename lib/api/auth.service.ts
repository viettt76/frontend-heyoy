import apiClient from './api-client';
import { LoginDto, SignupDto } from '@/types/auth';

export const loginService = (data: LoginDto) => {
    return apiClient.post('/auth/login', data);
};

export const signupService = (data: SignupDto) => {
    return apiClient.post('/auth/signup', data);
};

export const logoutService = () => {
    return apiClient.post('/auth/logout');
};

export const refreshTokenService = () => {
    return apiClient.post('/auth/refresh');
};
