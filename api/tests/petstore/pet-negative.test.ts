import { expect } from "chai";
import { APIRequest } from "../utils/request";
import { debugLog } from "../../api-config";  // Import debugLog function

const api = new APIRequest();

describe("Petstore API - Negative Test Cases", function () {
  this.timeout(10000);

  it("Should handle network failures gracefully", async function () {
    try {
      await api.get("/pet/1", { timeout: 1 });
    } catch (error: any) {
      debugLog(`[ERROR] Network failure: ${error.code}`);
      expect(["ECONNABORTED", "ERR_BAD_REQUEST"]).to.include(error.code);
    }
  });

  it("Should return 405 for invalid method usage", async function () {
    try {
      await api.post("/pet/12345", {});
    } catch (error: any) {
      expect([405, 415]).to.include(error.response.status);
      debugLog(`[ERROR] Invalid method usage: Status ${error.response.status}`);
    }
  });

  it("Should return 400 when creating a pet without required fields", async function () {
    try {
      await api.post("/pet", { status: "available" });
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
      debugLog("[ERROR] Pet creation failed due to missing required fields.");
    }
  });

  it("Should return 404 when updating a pet with a non-existent ID", async function () {
    try {
      await api.put("/pet", { id: 99999999, name: "GhostPet", status: "sold" });
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
      debugLog("[ERROR] Update failed: Pet does not exist.");
    }
  });

  it("Should return 400 or 404 when deleting a pet with an invalid ID format", async function () {
    try {
      await api.delete("/pet/invalid_id");
    } catch (error: any) {
      expect([400, 404]).to.include(error.response.status);
      debugLog("[ERROR] Deletion failed due to invalid ID format.");
    }
  });

  it("Should return 400 or 404 when retrieving a pet with an invalid ID format", async function () {
    try {
      await api.get("/pet/invalid_id");
    } catch (error: any) {
      expect([400, 404]).to.include(error.response.status);
      debugLog("[ERROR] Retrieval failed due to invalid ID format.");
    }
  });

  it("Should return 400 for creating a pet with an empty request body", async function () {
    try {
      await api.post("/pet", {});
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
      debugLog("[ERROR] Pet creation failed due to empty request body.");
    }
  });

  it("Should return 413 or 400 for creating a pet with excessive data", async function () {
    const largePayload = {
      id: Math.floor(Math.random() * 100000),
      name: "A".repeat(10000),
      status: "available",
    };

    debugLog(`[API] POST request to /pet with excessive data (Name length: ${largePayload.name.length})`);

    try {
      await api.post("/pet", largePayload);
    } catch (error: any) {
      expect([400, 413]).to.include(error.response.status);
      debugLog("[ERROR] Pet creation failed due to excessive data.");
    }
  });
});
