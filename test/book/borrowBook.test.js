const request = require("supertest");
require("dotenv").config();
const App = process.env.APP_URL;

describe("Borrow book check", () => {
  // Test for borrowing a book
  test("Should handle POST request for borrowBook", async () => {
    const borrowBook = {
      ISBN: "1234567891234",
    };
    const response = await request(App)
      .post("/api/books/borrowBook")
      .send(borrowBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Book borrowed successfully");
    console.log("Book borrowed successfully");
  });

  // Test for attempting to borrow a non-existent book
  test("Should restrict to borrow book if not available", async () => {
    const borrowBook = {
      ISBN: "1234567891230",
    };
    const response = await request(App)
      .post("/api/books/borrowBook")
      .send(borrowBook);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Book not available in the library");
    console.log("Book not available in the library");
  });

  // Test for attempting to borrow a book with no available copies
  test("Should restrict to borrow book if stock is not available", async () => {
    const borrowBook = {
      ISBN: "1234567891234",
    };
    const response = await request(App)
      .post("/api/books/borrowBook")
      .send(borrowBook);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "Book stock is not available in the library"
    );
    console.log("Book stock is not available in the library");
  });
});
