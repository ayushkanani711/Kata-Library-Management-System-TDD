const request = require("supertest");
require("dotenv").config();
const app = require("../app");

describe("Server Running Check", () => {
  // Test for the root url ("/")
  test("should respond to the GET request at the root url", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running");
  });

  // Test for the /api url
  test("should respond to the GET request at the /api url", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running");
  });

  // Test for a non-existent route
  test("should respond 404 for a non-existent route", async () => {
    const response = await request(app).post("/api/non-existent-route");
    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Route not found");
  });
});
