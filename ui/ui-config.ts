import * as dotenv from "dotenv";
dotenv.config({ path: './ui/.env' });  // Load UI-specific .env file

const logLevel = process.env.LOG_LEVEL || "info";  // Default to 'info' if LOG_LEVEL is not set

// Function to log messages only when LOG_LEVEL is "debug"
export function debugLog(message: string) {
  if (logLevel === "debug") {
    console.log(`[DEBUG] ${message}`);
  }
}

// Export logLevel in case it's needed elsewhere
export { logLevel };
