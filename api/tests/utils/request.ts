import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG, debugLog } from "../../api-config"; // Import debugLog

export class APIRequest {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "api_key": API_CONFIG.API_KEY,
      },
      timeout: API_CONFIG.TIMEOUT, // Apply global timeout
    });
  }

  private async logExecutionTime<T>(request: Promise<T>, method: string, endpoint: string): Promise<T> {
    const start = Date.now();
    try {
      const response = await request;
      const duration = Date.now() - start;

      // Log request time only in debug mode
      debugLog(`[API] ${method} ${endpoint} completed in ${duration}ms`);
      return response;
    } catch (error: any) {
      const duration = Date.now() - start;

      // Log API error only in debug mode
      debugLog(`[API] ${method} ${endpoint} failed after ${duration}ms: ${JSON.stringify(error.response?.data || error.message)}`);
      throw error;
    }
  }

  async get(endpoint: string, params = {}): Promise<AxiosResponse> {
    return this.logExecutionTime(this.client.get(endpoint, { params }), "GET", endpoint);
  }

  async post(endpoint: string, body: object): Promise<AxiosResponse> {
    return this.logExecutionTime(this.client.post(endpoint, body), "POST", endpoint);
  }

  async put(endpoint: string, body: object): Promise<AxiosResponse> {
    return this.logExecutionTime(this.client.put(endpoint, body), "PUT", endpoint);
  }

  async delete(endpoint: string): Promise<AxiosResponse> {
    return this.logExecutionTime(this.client.delete(endpoint), "DELETE", endpoint);
  }
}
