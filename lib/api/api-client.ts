import { AppStore } from '@/store';
import { setAccessToken } from '@/store/features/auth/authSlice';
import { EnhancedStore } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

class AxiosCustom {
    private instance: AxiosInstance;
    private handleLogout?: () => Promise<void>;
    private store!: AppStore;

    private isRefreshing = false;
    private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

    public get: AxiosInstance['get'];
    public post: AxiosInstance['post'];
    public put: AxiosInstance['put'];
    public patch: AxiosInstance['patch'];
    public delete: AxiosInstance['delete'];

    constructor() {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
            withCredentials: true,
            timeout: 30 * 1000,
        };

        this.instance = axios.create(config);

        this.instance.interceptors.request.use(
            (config) => {
                const token = this.store.getState().auth.accessToken;
                if (token) config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                this.handleTokenRefresh(error);
            },
        );

        this.get = this.instance.get.bind(this.instance);
        this.post = this.instance.post.bind(this.instance);
        this.put = this.instance.put.bind(this.instance);
        this.patch = this.instance.patch.bind(this.instance);
        this.delete = this.instance.delete.bind(this.instance);
    }

    async handleTokenRefresh(error: AxiosError) {
        const originalRequest = error.config;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
                const { data } = await this.instance.post('/auth/refresh');

                const newToken = data.accessToken;
                this.store.dispatch(setAccessToken(newToken));

                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Retry the failed requests
                    this.failedQueue.forEach((req) => req.resolve(newToken));
                    this.failedQueue = [];

                    return this.instance(originalRequest);
                }
            } catch (refreshError) {
                this.failedQueue.forEach((req) => req.reject(refreshError));
                this.failedQueue = [];

                //call logout
                if (this.handleLogout) {
                    this.handleLogout();
                }

                throw refreshError;
            } finally {
                this.isRefreshing = false;
            }
        } else {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            }).then((token: any) => {
                if (originalRequest) {
                    originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
                    return this.instance(originalRequest);
                }
            });
        }
    }

    public set setHandleLogout(handleLogout: () => Promise<void>) {
        this.handleLogout = handleLogout;
    }

    public set setStore(store: EnhancedStore) {
        this.store = store;
    }
}

const apiClient = new AxiosCustom();

export default apiClient;
