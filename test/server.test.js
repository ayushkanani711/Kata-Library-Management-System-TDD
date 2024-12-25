const request = require("supertest");
const app = require("../app"); // Import the app from app.js

describe("Server Running Check", () => {
  //
  test("should respond to the GET request at the root url", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running");
  });
  //
  test("should respond to the GET request at the /api url", async () => {
    const response = await request(app).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running");
  });
  //
  test("should respond 404 for a non-existent route", async () => {
    const response = await request(app).post("/api/non-existent-route");
    expect(response.statusCode).toBe(404);
  });
});
