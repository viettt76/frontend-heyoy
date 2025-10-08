import apiClient from './api-client';

export const getMyInfo = () => {
    return apiClient.get('/users/me');
};
