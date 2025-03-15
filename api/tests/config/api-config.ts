import dotenv from "dotenv";
dotenv.config();

export const API_CONFIG = {
  BASE_URL: process.env.BASE_URL ?? "https://petstore.swagger.io/v2",
  API_KEY: process.env.API_KEY ?? "special-key",
  TIMEOUT: Number(process.env.API_TIMEOUT) || 10000, // Default timeout if not provided
};
