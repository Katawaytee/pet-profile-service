import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "chai"; // Change this line
import request from "supertest";
import app from "../../server.js"; // Ensure server.js uses ES module syntax

let response;

Given("I have a pet profile", async function () {
  // Assuming pet profiles already exist in the database or you can create a mock pet here
});

When("I request the pet profile", async function () {
  response = await request(app).get("/pets"); // Modify endpoint as needed
});

Then("I should receive the pet profile", function () {
  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("data").that.is.an("array");
});
