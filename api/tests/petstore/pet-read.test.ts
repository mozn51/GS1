import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();
let petId: number;

describe("Petstore API - Read Pet", function () {
  this.timeout(10000);

  before(async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available"
    };
    const response = await api.post("/pet", petData);
    petId = response.data.id;
  });

  it("Should retrieve pet details", async function () {
    if (!petId) throw new Error("Pet ID is undefined.");

    let retries = 5;
    let response: any;

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Initial wait for API persistence

    while (retries > 0) {
      try {
        response = await api.get(`/pet/${petId}`);
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(petId);
        return;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Pet not found, retrying... (${retries} attempts left)`);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          console.error("Unexpected error during pet retrieval:", error.response?.data || error.message);
          throw error;
        }
      }
    }
    throw new Error("Pet retrieval failed after multiple attempts.");
  });

  it("Should return 404 for a non-existing pet", async function () {
    try {
      await api.get(`/pet/999999999`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });
});
