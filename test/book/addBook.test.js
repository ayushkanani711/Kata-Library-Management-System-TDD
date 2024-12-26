const request = require("supertest");
require("dotenv").config();
const App = process.env.APP_URL;

describe("Add Book Check", () => {
  test("Should handle POST request", async () => {
    const book = {
      ISBN: "1234567891238",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    };
    const response = await request(App)
      .post("/api/books/addNewBook")
      .send(book);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book added successfully");
    console.log("Book added successfully");
  });

  test("Should restrict to add existing book", async () => {
    const book = {
      ISBN: "1234567891234",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    };
    const response = await request(App)
      .post("/api/books/addNewBook")
      .send(book);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Book already exists");
    console.log("Book already exists");
  });
});
