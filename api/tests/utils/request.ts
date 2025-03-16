import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG } from "../config/api-config";

const isCI = process.env.CI === "true"; // Detect if running in CI/CD

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

  async get(endpoint: string, params = {}): Promise<AxiosResponse> {
    try {
      if (!isCI) console.log(`[API] GET request to ${endpoint} with params:`, params);
      return await this.client.get(endpoint, { params });
    } catch (error: any) {
      console.error(`[ERROR] GET ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async post(endpoint: string, body: object): Promise<AxiosResponse> {
    try {
      // Log only metadata, not full request body
      if (!isCI) {
        const bodySummary = JSON.stringify(body).length > 500 ? `{ Large Payload - ${JSON.stringify(body).length} chars }` : body;
        console.log(`[API] POST request to ${endpoint} with body:`, bodySummary);
      }
      
      return await this.client.post(endpoint, body);
    } catch (error: any) {
      console.error(`[ERROR] POST ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async put(endpoint: string, body: object): Promise<AxiosResponse> {
    try {
      if (!isCI) console.log(`[API] PUT request to ${endpoint} with body:`, JSON.stringify(body));
      return await this.client.put(endpoint, body);
    } catch (error: any) {
      console.error(`[ERROR] PUT ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async delete(endpoint: string): Promise<AxiosResponse> {
    try {
      if (!isCI) console.log(`[API] DELETE request to ${endpoint}`);
      return await this.client.delete(endpoint);
    } catch (error: any) {
      console.error(`[ERROR] DELETE ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }
}
