import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { AuthProvider } from '@/services/auth/authProvider';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_APP_API_ARQUITECTURA_URL,
      timeout: Number(import.meta.env.VITE_APP_TIMEOUT) || 10000,
      withCredentials: true,
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          // Obtener token de acceso
          const token = await AuthProvider.getAccessToken();
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          
          // Headers de seguridad adicionales
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          config.headers['X-API-Key'] = import.meta.env.VITE_APP_NAME_API_KEY;
          config.headers['Content-Type'] = 'application/json; charset=utf-8';
          
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Si es un error 401 y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Intentar refrescar el token
            const token = await AuthProvider.getAccessToken(['api://default']);
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Si el refresh falla, logout y redirigir
            await AuthProvider.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        // Para otros errores, simplemente retornar
        return Promise.reject(error);
      }
    );
  }
  
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
  
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }
  
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }
  
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }
  
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance();