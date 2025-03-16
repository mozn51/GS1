import dotenv from "dotenv";

// Load API-specific environment variables from the correct .env file
dotenv.config({ path: './tests/api/.env' });

const logLevel = process.env.LOG_LEVEL || "info";  // Default to 'info' if LOG_LEVEL is missing

// Function to log debug messages only when LOG_LEVEL=debug
export function debugLog(message: string) {
  if (logLevel === "debug") {
    console.log(`[DEBUG] [${new Date().toISOString()}] ${message}`);
  }
}

// API Configuration settings with fallback defaults
export const API_CONFIG = {
  BASE_URL: process.env.BASE_URL || "https://petstore.swagger.io/v2",
  API_KEY: process.env.API_KEY || "special-key",
  TIMEOUT: Number(process.env.API_TIMEOUT) || 10000, // Default timeout (10s)
};

// Log API configuration only when LOG_LEVEL=debug
debugLog(`API Configuration Loaded: ${JSON.stringify(API_CONFIG, null, 2)}`);
