const request = require("supertest");
const express = require("express");

describe("Server Running Check", () => {
  let app;
  beforeAll(() => {
    // Initialize the express app
    app = express();
  });

  //
  test("should respond to the GET request at the root url", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running");
  });
});
