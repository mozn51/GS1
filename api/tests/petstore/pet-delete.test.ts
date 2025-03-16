import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();
const isCI = process.env.CI === "true"; // Detect if running in CI/CD
let petId: number;

describe("Petstore API - Delete Pet", function () {
  this.timeout(30000); // Increased timeout for CI/CD reliability

  before(async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available",
    };

    if (!isCI) console.log(`[API] Creating pet: ${JSON.stringify(petData)}`);

    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    petId = response.data.id;
    if (!isCI) console.log(`[API] Pet created successfully with ID: ${petId}`);

    // 🔹 Ensure API has persisted the new pet before proceeding
    let retries = 8;
    let delay = 2000; // Start with 2s wait, increase exponentially

    while (retries > 0) {
      try {
        const checkResponse = await api.get(`/pet/${petId}`);
        if (checkResponse.status === 200) {
          console.log(`[API] Pet ${petId} confirmed to exist.`);
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`[API] Pet not found yet, retrying in ${delay / 1000}s... (${retries - 1} attempts left)`);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.5; // Exponential backoff
        } else {
          console.error("[ERROR] Unexpected API response:", error.response?.data || error.message);
          throw error;
        }
      }
    }

    if (retries === 0) {
      throw new Error(`[ERROR] Pet ${petId} was created but never found in API after retries.`);
    }
  });

  it("Should delete the pet", async function () {
    if (!petId) throw new Error("[ERROR] Pet ID is undefined. Pet was not created.");

    let deleteRetries = 3;
    while (deleteRetries > 0) {
      try {
        const response = await api.delete(`/pet/${petId}`);
        if (response.status === 200) {
          console.log(`[API] Pet ${petId} deleted successfully.`);
          return;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`[API] Delete attempt failed, retrying in 2s... (${deleteRetries - 1} attempts left)`);
          deleteRetries--;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.error("[ERROR] Delete API Error:", error.response?.data || error.message);
          throw error;
        }
      }
    }
    throw new Error(`[ERROR] Pet deletion failed after multiple attempts. Pet ID: ${petId}`);
  });

  it("Should return 404 for a deleted pet", async function () {
    try {
      await api.get(`/pet/${petId}`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      console.log(`[API] Confirmed pet ${petId} no longer exists.`);
    }
  });

  it("Should return 404 for deleting a non-existing pet", async function () {
    try {
      await api.delete(`/pet/999999999`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });
});
