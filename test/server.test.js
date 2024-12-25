const request = require("supertest");
const app = require("../app");

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

describe("Add Book Check", () => {
  test("Should handle POST request", async () => {
    const book = {
      ISBN: "123456789124",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    };
    const response = await request(app)
      .post("/api/books/addNewBook")
      .send(book);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book added successfully");
  });
});
