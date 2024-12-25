const request = require("supertest");
const app = require("../app"); // Import the app from app.js

describe("Server Running Check", () => {
  //
  test("should respond to the GET request at the root url", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running");
  });
});
