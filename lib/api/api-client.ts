import { AppStore } from '@/store';
import { setAccessToken } from '@/store/features/auth/authSlice';
import { EnhancedStore } from '@reduxjs/toolkit';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios, { HttpStatusCode } from 'axios';

class AxiosCustom {
    private instance: AxiosInstance;
    private store!: AppStore;
    private accessToken!: string;

    private isRefreshing = false;
    private failedQueue: Array<{ resolve: Function; reject: Function }> = [];

    constructor() {
        const config: AxiosRequestConfig = {
            baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30 * 1000,
            withCredentials: true,
        };
        const instance = axios.create(config);

        this.instance = instance;
    }

    public init(store: EnhancedStore, accessToken: string) {
        this.store = store;
        this.accessToken = accessToken;

        this.attachInterceptors();
    }

    private attachInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                const { response } = error;
                if (response?.status === 401 && !this.isRefreshing) {
                    return this.handleTokenRefresh(error);
                }

                throw error;
            },
        );
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

                throw refreshError;
            } finally {
                this.isRefreshing = false;
            }
        } else {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            })
                .then((token: any) => {
                    if (originalRequest) {
                        originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
                        return this.instance(originalRequest);
                    }
                })
                .catch(Promise.reject);
        }
    }

    // Create
    public post<D = any>(url: string): Promise<D>;
    public post<D = any, R = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R>;
    public post<D = any, R = any>(
        url: string,
        data: D,
        config: AxiosRequestConfig<D> & { integrity: true },
    ): Promise<AxiosResponse<R, D>>;
    public post<D, R>(url: string, data?: D, config: any = {}): Promise<unknown> {
        const { integrity, ...rest } = config;
        return new Promise((resolve, reject) => {
            this.instance
                .post<D, AxiosResponse<R>>(url, data, rest)
                .then((response) => resolve(integrity ? response : response.data))
                .catch((error: AxiosError) => {
                    if (error.response) {
                        reject(error.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    public patch<D, R>(url: string, data?: D, config: any = {}): Promise<unknown> {
        const { integrity, ...rest } = config;
        return new Promise((resolve, reject) => {
            this.instance
                .patch<D, AxiosResponse<R>>(url, data, rest)
                .then((response) => resolve(integrity ? response : response.data))
                .catch((error: AxiosError) => {
                    if (error.response) {
                        reject(error.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    // Read
    public get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        return new Promise((resolve, reject) => {
            this.instance
                .get<T, AxiosResponse<R>, D>(url, config)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.response) {
                        reject(error.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    // Update
    public put<D = any, R = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> {
        return new Promise((resolve, reject) => {
            this.instance
                .put<D, AxiosResponse<R>>(url, data, config)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.response) {
                        reject(error.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    // Delete
    public delete<D = any, R = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
        return new Promise((resolve, reject) => {
            this.instance
                .delete<D, AxiosResponse<R>>(url, config)
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.response) {
                        reject(error.response);
                    } else {
                        reject(error);
                    }
                });
        });
    }
}

const apiClient = new AxiosCustom();

export default apiClient;
