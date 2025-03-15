import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();
let petId: number;

describe("Petstore API - Update Pet", function () {
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

  it("Should update pet details", async function () {
    if (!petId) throw new Error("Pet ID is undefined. Cannot proceed with update.");

    const updatedPet = { id: petId, name: "FluffyUpdated", status: "sold" };

    const response = await api.put("/pet", updatedPet);
    expect(response.status).to.equal(200);
    expect(response.data).to.include({ name: updatedPet.name, status: updatedPet.status });
  });

  it("Should return 400 for invalid update request", async function () {
    try {
      await api.put("/pet", { invalidField: "test" });
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
    }
  });

  it("Should return 404 when updating a non-existent pet", async function () {
    try {
      await api.put("/pet", { id: 99999999, name: "GhostPet", status: "sold" });
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });
});
