import { expect } from "chai";
import { APIRequest } from "../utils/request";
import { debugLog } from "../../api-config";  // Import debugLog function

const api = new APIRequest();

describe("Petstore API - Create Pet", function () {
  this.timeout(10000);

  it("Should create a pet with valid data", async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available",
    };

    debugLog(`[API] Creating pet: ${JSON.stringify(petData)}`);

    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    expect(response.data).to.include({ name: petData.name, status: petData.status });

    debugLog(`[API] Pet created successfully with ID: ${response.data.id}`);
  });

  it("Should return 400 for invalid pet creation", async function () {
    try {
      const invalidPayload = { invalidField: "test" };
      debugLog(`[API] Attempting invalid pet creation: ${JSON.stringify(invalidPayload)}`);

      await api.post("/pet", invalidPayload);
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
      debugLog(`[ERROR] Invalid pet creation failed as expected. Status: ${error.response.status}`);
    }
  });
});
