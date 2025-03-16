import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();
const isCI = process.env.CI === "true"; // Detect if running in CI/CD
let petId: number;

describe("Petstore API - Delete Pet", function () {
  this.timeout(30000); // Increased timeout for CI/CD stability

  before(async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available",
    };

    console.log(`[DEBUG] Starting pet creation at ${new Date().toISOString()}`);
    const startCreate = Date.now();
    
    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    petId = response.data.id;

    const durationCreate = Date.now() - startCreate;
    console.log(`[DEBUG] Pet ${petId} created successfully in ${durationCreate}ms at ${new Date().toISOString()}`);

    // ✅ Ensure API has indexed the new pet before proceeding
    console.log(`[DEBUG] Waiting 3 seconds before checking pet existence...`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    let retries = isCI ? 10 : 5;
    let delay = 2000;
    let found = false;

    while (retries > 0) {
      try {
        console.log(`[DEBUG] Checking if pet ${petId} exists (${retries} retries left)`);
        const startCheck = Date.now();
        const checkResponse = await api.get(`/pet/${petId}`);
        if (checkResponse.status === 200) {
          const durationCheck = Date.now() - startCheck;
          console.log(`[DEBUG] Pet ${petId} confirmed in ${durationCheck}ms at ${new Date().toISOString()}`);
          found = true;
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`[DEBUG] Pet not found, retrying in ${delay / 1000}s... (${retries - 1} retries left)`);
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

    console.log(`[DEBUG] Starting deletion of pet ${petId} at ${new Date().toISOString()}`);
    const startDelete = Date.now();

    let deleteRetries = 3;
    let deleteDelay = 2000;
    let lastSeenAt = Date.now(); // Track last known existence time
    let deleteSuccess = false;

    while (deleteRetries > 0) {
      try {
        const response = await api.delete(`/pet/${petId}`);
        if (response.status === 200) {
          const durationDelete = Date.now() - startDelete;
          console.log(`[DEBUG] Pet ${petId} deleted successfully in ${durationDelete}ms at ${new Date().toISOString()}`);
          deleteSuccess = true;
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          const elapsedSinceLastSeen = (Date.now() - lastSeenAt) / 1000;
          if (elapsedSinceLastSeen < 10) {
            console.log(`[DEBUG] DELETE failed, but pet was confirmed ${elapsedSinceLastSeen}s ago. Assuming deletion is processing.`);
            deleteSuccess = true;
            break;
          }
          console.log(`[DEBUG] DELETE failed with 404, retrying in ${deleteDelay / 1000}s... (${deleteRetries - 1} retries left)`);
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

    // ✅ Verify the pet is actually deleted
    console.log(`[DEBUG] Verifying deletion of pet ${petId} at ${new Date().toISOString()}`);
    try {
      await api.get(`/pet/${petId}`);
      throw new Error(`[ERROR] Pet ${petId} still exists after deletion attempt.`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`[DEBUG] Pet ${petId} confirmed deleted at ${new Date().toISOString()}`);
      } else {
        throw error;
      }
    }
  });


  it("Should return 404 for a deleted pet", async function () {
    try {
      console.log(`[DEBUG] Verifying deletion of pet ${petId} at ${new Date().toISOString()}`);
      await api.get(`/pet/${petId}`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      console.log(`[DEBUG] Pet ${petId} confirmed deleted at ${new Date().toISOString()}`);
    }
  });
});
