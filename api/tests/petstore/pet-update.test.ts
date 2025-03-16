import { expect } from "chai";
import { APIRequest } from "../utils/request";
import { debugLog } from "../../api-config";  // Import debugLog function

const api = new APIRequest();
let petId: number;

describe("Petstore API - Update Pet", function () {
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

  it("Should update pet details", async function () {
    if (!petId) throw new Error("[ERROR] Pet ID is undefined. Cannot proceed with update.");

    const updatedPet = { id: petId, name: "FluffyUpdated", status: "sold" };

    debugLog(`[API] Updating pet ID ${petId} with new details.`);

    const response = await api.put("/pet", updatedPet);
    expect(response.status).to.equal(200);
    expect(response.data).to.include({ name: updatedPet.name, status: updatedPet.status });

    debugLog(`[API] Pet ${petId} updated successfully.`);
  });

  it("Should return 400 for invalid update request", async function () {
    try {
      await api.put("/pet", { invalidField: "test" });
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
      debugLog("[ERROR] Invalid pet update request returned expected 400 status.");
    }
  });

  it("Should return 404 when updating a non-existent pet", async function () {
    try {
      await api.put("/pet", { id: 99999999, name: "GhostPet", status: "sold" });
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      debugLog("[ERROR] Attempted to update a non-existent pet. API returned 404 as expected.");
    }
  });
});
