import apiClient from './api-client';
import { LoginDto, SignupDto } from '@/types/auth';

export const loginService = (data: LoginDto) => {
    return apiClient.post('/auth/login', data);
};

export const signupService = (data: SignupDto) => {
    return apiClient.post('/auth/signup', data);
};
