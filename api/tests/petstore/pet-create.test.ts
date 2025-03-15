import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();

describe("Petstore API - Create Pet", function () {
  this.timeout(10000);

  it("Should create a pet with valid data", async function () {
    const petData = {
      id: Math.floor(Math.random() * 100000),
      name: "Fluffy",
      status: "available"
    };

    const response = await api.post("/pet", petData);
    expect(response.status).to.equal(200);
    expect(response.data).to.include({ name: petData.name, status: petData.status });
  });

  it("Should return 400 for invalid pet creation", async function () {
    try {
      await api.post("/pet", { invalidField: "test" });
    } catch (error: any) {
      expect(error.response.status).to.equal(400);
    }
  });
});
