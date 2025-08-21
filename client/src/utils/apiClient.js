const API_TIMEOUT = 5000; 
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; 

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

class TimeoutError extends Error {
    constructor() {
        super('Request timed out');
        this.name = 'TimeoutError';
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function apiClient(endpoint, options = {}) {
    const {
        method = 'GET',
        body,
        timeout = API_TIMEOUT,
        retries = MAX_RETRIES,
        signal,
        headers = {}
    } = options;

    let attempt = 0;
    let lastError;

    while (attempt <= retries) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            const combinedSignal = signal ? mergeAbortSignals(signal, controller.signal) : controller.signal;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: combinedSignal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.message || 'API request failed',
                    response.status,
                    errorData
                );
            }

            return await response.json();

        } catch (error) {
            lastError = error;

            if (error.name === 'AbortError') {
                throw new TimeoutError();
            }

            if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                throw error;
            }

            if (attempt === retries) {
                throw lastError;
            }

            // Wait before retrying
            await delay(RETRY_DELAY * Math.pow(2, attempt));
            attempt++;
        }
    }
}

export const api = {
    get: (endpoint, options = {}) => 
        apiClient(endpoint, { ...options, method: 'GET' }),
    
    post: (endpoint, data, options = {}) => 
        apiClient(endpoint, { ...options, method: 'POST', body: data }),
    
    put: (endpoint, data, options = {}) => 
        apiClient(endpoint, { ...options, method: 'PUT', body: data }),
    
    delete: (endpoint, options = {}) => 
        apiClient(endpoint, { ...options, method: 'DELETE' })
}; 


function mergeAbortSignals(signalA, signalB) {
    const controller = new AbortController();

    const abort = () => {
        if (!controller.signal.aborted) {
            controller.abort();
        }
    };

    signalA?.addEventListener('abort', abort);
    signalB?.addEventListener('abort', abort);

    return controller.signal;
}
