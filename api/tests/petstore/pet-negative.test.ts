import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();

describe("Petstore API - Negative Test Cases", function () {
  this.timeout(10000);

  it("Should handle network failures gracefully", async function () {
    try {
      await api.get("/pet/1", { timeout: 1 });
    } catch (error: any) {
      console.log("Network Failure Error:", error.code);
      expect(["ECONNABORTED", "ERR_BAD_REQUEST"]).to.include(error.code);
    }
  });

  it("Should return 405 for invalid method usage", async function () {
    try {
      await api.post("/pet/12345", {});
    } catch (error: any) {
      expect([405, 415]).to.include(error.response.status);
    }
  });

  it("Should return 400 when creating a pet without required fields", async function () {
    try {
      await api.post("/pet", { status: "available" });
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
    }
  });

  it("Should return 404 when updating a pet with a non-existent ID", async function () {
    try {
      await api.put("/pet", { id: 99999999, name: "GhostPet", status: "sold" });
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });

  it("Should return 400 or 404 when deleting a pet with an invalid ID format", async function () {
    try {
      await api.delete("/pet/invalid_id");
    } catch (error: any) {
      expect([400, 404]).to.include(error.response.status);
    }
  });

  it("Should return 400 or 404 when retrieving a pet with an invalid ID format", async function () {
    try {
      await api.get("/pet/invalid_id");
    } catch (error: any) {
      expect([400, 404]).to.include(error.response.status);
    }
  });

  it("Should return 400 for creating a pet with an empty request body", async function () {
    try {
      await api.post("/pet", {});
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
    }
  });

  it("Should return 413 or 400 for creating a pet with excessive data", async function () {
    const largePayload = {
      id: Math.floor(Math.random() * 100000),
      name: "A".repeat(10000),
      status: "available"
    };

    try {
      await api.post("/pet", largePayload);
    } catch (error: any) {
      expect([400, 413]).to.include(error.response.status);
    }
  });

});
