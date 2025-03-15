import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG } from "../config/api-config";

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
      return await this.client.get(endpoint, { params });
    } catch (error: any) {
      console.error(`GET ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async post(endpoint: string, body: object): Promise<AxiosResponse> {
    try {
      return await this.client.post(endpoint, body);
    } catch (error: any) {
      console.error(`POST ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async put(endpoint: string, body: object): Promise<AxiosResponse> {
    try {
      return await this.client.put(endpoint, body);
    } catch (error: any) {
      console.error(`PUT ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }

  async delete(endpoint: string): Promise<AxiosResponse> {
    try {
      return await this.client.delete(endpoint);
    } catch (error: any) {
      console.error(`DELETE ${endpoint} failed:`, error.response?.data || error.message);
      throw error;
    }
  }
}
