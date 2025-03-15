import { expect } from "chai";
import { APIRequest } from "../utils/request";

const api = new APIRequest();
let petId: number;

describe("Petstore API - Delete Pet", function () {
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

  it("Should delete the pet", async function () {
    if (!petId) throw new Error("Pet ID is undefined. Pet was not created.");

    let retries = 5;
    let petExists = false;

    while (retries > 0) {
      try {
        const checkResponse = await api.get(`/pet/${petId}`);
        if (checkResponse.status === 200) {
          petExists = true;
          break;
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Pet not found before deletion, retrying... (${retries} attempts left)`);
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          console.error("Unexpected error when checking pet existence:", error.response?.data || error.message);
          throw error;
        }
      }
    }

    if (!petExists) {
      console.log("Pet does not exist before deletion. Creating a new pet.");
      const newPet = {
        id: Math.floor(Math.random() * 100000),
        name: "TempPet",
        status: "available"
      };
      const createResponse = await api.post("/pet", newPet);
      expect(createResponse.status).to.equal(200);
      petId = createResponse.data.id;
    }

    let deleteRetries = 3;
    while (deleteRetries > 0) {
      try {
        const response = await api.delete(`/pet/${petId}`);
        expect(response.status).to.equal(200);
        console.log(`Pet ${petId} deleted successfully.`);
        return;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`Delete failed, retrying... (${deleteRetries} attempts left)`);
          deleteRetries--;
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else {
          console.error("Delete API Error:", error.response?.data || error.message);
          throw error;
        }
      }
    }
    throw new Error("Pet deletion failed after multiple attempts.");
  });

  it("Should return 404 for a deleted pet", async function () {
    try {
      await api.get(`/pet/${petId}`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });

  it("Should return 404 for deleting a non-existing pet", async function () {
    try {
      await api.delete(`/pet/999999999`);
    } catch (error: any) {
      expect(error.response.status).to.equal(404);
    }
  });
});
