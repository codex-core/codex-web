// Client-side API utilities with security headers
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'your-secure-api-secret-key';

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export class SecureApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  }

  private getSecureHeaders(options: ApiRequestOptions = {}): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': API_SECRET,
      // Add CSRF token if available
      ...(typeof window !== 'undefined' && document.querySelector('meta[name="csrf-token"]') && {
        'x-csrf-token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content
      }),
    };

    // Add auth token if required and available
    if (options.requireAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getAuthToken(): string | null {
    // Get token from your auth system (localStorage, cookies, etc.)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || null;
    }
    return null;
  }

  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const { requireAuth, ...fetchOptions } = options;
    
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...this.getSecureHeaders({ requireAuth }),
        ...fetchOptions.headers,
      },
      credentials: 'same-origin', // Include cookies for same-origin requests
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Convenience methods
  async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create a default instance
export const apiClient = new SecureApiClient();

// Convenience functions for common operations
export const secureApi = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) => 
    apiClient.get<T>(endpoint, options),
  
  post: <T>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiClient.post<T>(endpoint, data, options),
  
  put: <T>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
    apiClient.put<T>(endpoint, data, options),
  
  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>) => 
    apiClient.delete<T>(endpoint, options),
};