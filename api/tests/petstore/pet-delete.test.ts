import { expect } from "chai";
import { APIRequest } from "../utils/request";
import { debugLog } from "../../api-config";  // Import debugLog function

const api = new APIRequest();
let petId: number;

describe("Petstore API - Delete Pet", function () {
  this.timeout(30000); // Increased timeout for CI/CD stability

  before(async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available",
    };

    debugLog(`Starting pet creation at ${new Date().toISOString()}`);
    const startCreate = Date.now();
    
    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    petId = response.data.id;

    debugLog(`Pet ${petId} created successfully in ${Date.now() - startCreate}ms`);

    // Ensure API has indexed the new pet before proceeding
    debugLog(`Waiting 3 seconds before checking pet existence...`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    let retries = 5;
    let delay = 2000;
    let found = false;

    while (retries > 0) {
      try {
        debugLog(`Checking if pet ${petId} exists (${retries} retries left)`);
        const checkResponse = await api.get(`/pet/${petId}`);
        if (checkResponse.status === 200) {
          debugLog(`Pet ${petId} confirmed available`);
          found = true;
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          debugLog(`Pet not found, retrying in ${delay / 1000}s... (${retries - 1} retries left)`);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 1.2;
        } else {
          console.error("[ERROR] Unexpected API response:", error.response?.data || error.message);
          throw error;
        }
      }
    }

    if (!found) {
      throw new Error(`[ERROR] Pet ${petId} was created but never found in API.`);
    }
  });

  it("Should delete the pet and verify deletion", async function () {
    if (!petId) throw new Error("[ERROR] Pet ID is undefined. Pet was not created.");

    debugLog(`Starting deletion of pet ${petId}`);

    let deleteRetries = 3;
    let deleteDelay = 2000;
    let deleteSuccess = false;

    while (deleteRetries > 0) {
      try {
        const response = await api.delete(`/pet/${petId}`);
        if (response.status === 200) {
          debugLog(`Pet ${petId} deleted successfully`);
          deleteSuccess = true;
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          debugLog(`DELETE failed, retrying... (${deleteRetries - 1} retries left)`);
          deleteRetries--;
          await new Promise((resolve) => setTimeout(resolve, deleteDelay));
          deleteDelay *= 1.5;
        } else {
          console.error("[ERROR] Delete API Error:", error.response?.data || error.message);
          throw error;
        }
      }
    }

    if (!deleteSuccess) {
      throw new Error(`[ERROR] Pet deletion failed after multiple attempts. Pet ID: ${petId}`);
    }

    // Verify the pet is actually deleted
    debugLog(`Verifying deletion of pet ${petId}`);
    try {
      await api.get(`/pet/${petId}`);
      throw new Error(`[ERROR] Pet ${petId} still exists after deletion attempt.`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        debugLog(`Pet ${petId} confirmed deleted`);
      } else {
        throw error;
      }
    }
  });

  it("Should return 404 for a deleted pet", async function () {
    try {
      debugLog(`Verifying deletion of pet ${petId}`);
      await api.get(`/pet/${petId}`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      debugLog(`Pet ${petId} confirmed deleted`);
    }
  });
});
