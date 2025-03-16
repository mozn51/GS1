import { expect } from "chai";
import { APIRequest } from "../utils/request";
import { debugLog } from "../../api-config";  // Import debugLog function

const api = new APIRequest();
let petId: number;

describe("Petstore API - Read Pet", function () {
  this.timeout(10000);

  before(async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available",
    };

    debugLog(`[API] Creating pet: ${JSON.stringify(petData)}`);

    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    petId = response.data.id;

    debugLog(`[API] Pet created successfully with ID: ${petId}`);
  });

  it("Should retrieve pet details", async function () {
    if (!petId) throw new Error("[ERROR] Pet ID is undefined.");

    let retries = 5;
    let response: any;

    // Initial wait to allow API persistence
    await new Promise((resolve) => setTimeout(resolve, 3000));

    while (retries > 0) {
      try {
        response = await api.get(`/pet/${petId}`);
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(petId);

        debugLog(`[API] Successfully retrieved pet ${petId}`);
        return;
      } catch (error: any) {
        if (error.response?.status === 404) {
          debugLog(`[API] Pet not found, retrying... (${retries - 1} attempts left)`);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          console.error("[ERROR] Unexpected error during pet retrieval:", error.response?.data || error.message);
          throw error;
        }
      }
    }
    throw new Error(`[ERROR] Pet retrieval failed after multiple attempts. Pet ID: ${petId}`);
  });

  it("Should return 404 for a non-existing pet", async function () {
    try {
      await api.get(`/pet/999999999`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      debugLog("[API] Confirmed: Non-existing pet returned 404 as expected.");
    }
  });
});
