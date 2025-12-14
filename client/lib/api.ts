/**
 * API Client Utility
 * 
 * All API calls go through the Next.js rewrite proxy.
 * This hides the actual backend URL from the browser.
 * 
 * Browser sees: /api/hero
 * Server proxies to: http://localhost:5000/api/hero
 */

// Use relative URL - Next.js rewrites will proxy to backend
const API_BASE_URL = '/api';

interface ApiResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
    timestamp?: string;
}

interface FetchOptions extends RequestInit {
    timeout?: number;
}

/**
 * Base fetch wrapper with error handling and timeout
 */
async function fetchWithTimeout<T>(
    url: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> {
    const { timeout = 10000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions.headers,
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }

        throw error;
    }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string, options?: FetchOptions): Promise<T | null> {
    try {
        const response = await fetchWithTimeout<T>(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            ...options,
        });
        return response.data;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.error(`API GET ${endpoint} failed:`, error);
        }
        return null;
    }
}

/**
 * POST request
 */
export async function apiPost<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: FetchOptions
): Promise<ApiResponse<T>> {
    const response = await fetchWithTimeout<T>(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
    return response;
}

/**
 * PUT request
 */
export async function apiPut<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: FetchOptions
): Promise<ApiResponse<T>> {
    const response = await fetchWithTimeout<T>(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options,
    });
    return response;
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string, options?: FetchOptions): Promise<ApiResponse<T>> {
    const response = await fetchWithTimeout<T>(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        ...options,
    });
    return response;
}

// ==========================================
// Specific API Functions
// ==========================================

// Define loose types for now to avoid build errors
export async function fetchHeroData(): Promise<any> {
    const data = await apiGet<any>('/hero');
    return data;
}

export async function fetchProjects(): Promise<any> {
    return apiGet<any>('/projects');
}

export async function fetchBlogs(): Promise<any> {
    return apiGet<any>('/blogs');
}

export async function fetchCertificates(): Promise<any> {
    return apiGet<any>('/certificates');
}

export async function fetchExperiences(): Promise<any> {
    return apiGet<any>('/experiences');
}

export async function sendContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    return apiPost('/contact', data);
}
