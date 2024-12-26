const request = require("supertest");

const App = "http://localhost:5001";

describe("Server Running Check", () => {
  //
  test("should respond to the GET request at the root url", async () => {
    const response = await request(App).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server is running");
  });

  //
  test("should respond to the GET request at the /api url", async () => {
    const response = await request(App).get("/api");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("API is running");
  });

  //
  test("should respond 404 for a non-existent route", async () => {
    const response = await request(App).post("/api/non-existent-route");
    expect(response.statusCode).toBe(404);
  });
});
