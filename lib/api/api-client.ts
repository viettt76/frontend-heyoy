import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios';

class AxiosCustom {
    private instance: AxiosInstance;
    private handleLogout?: () => void;

    public get: AxiosInstance['get'];
    public post: AxiosInstance['post'];
    public put: AxiosInstance['put'];
    public patch: AxiosInstance['patch'];
    public delete: AxiosInstance['delete'];

    constructor() {
        this.instance = axios.create({
            baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
        });

        this.instance.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error),
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === HttpStatusCode.Forbidden) {
                    if (this.handleLogout) {
                        this.handleLogout();
                    }
                }
                return Promise.reject(error);
            },
        );

        this.get = this.instance.get.bind(this.instance);
        this.post = this.instance.post.bind(this.instance);
        this.put = this.instance.put.bind(this.instance);
        this.patch = this.instance.patch.bind(this.instance);
        this.delete = this.instance.delete.bind(this.instance);
    }
}

const apiClient = new AxiosCustom();

export default apiClient;
