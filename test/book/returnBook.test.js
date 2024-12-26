const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

describe("Book returning check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
  });

  afterEach(() => {
    console.error.mockRestore(); // Restore console.error after tests
  });

  // Test for missing ISBN
  test("Should return 403 if ISBN is missing", async () => {
    const response = await request(app).post("/api/books/returnBook").send({});
    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("ISBN is required");
  });

  // Test for invalid ISBN length
  test("Should restrict returning a book with invalid ISBN length", async () => {
    const response = await request(app).post("/api/books/returnBook").send({
      ISBN: "1234567890", // Invalid ISBN length
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "ISBN must be a string of 13 characters"
    );
  });

  // Test for returning a book not borrowed
  test("Should return 404 if book is not found", async () => {
    Book.findOne.mockResolvedValue(null);

    const returnBook = {
      ISBN: "1234567891234",
    };

    const response = await request(app)
      .post("/api/books/returnBook")
      .send(returnBook);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Book not found");
  });

  // Test for returning a book that is not borrowed
  test("Should handle POST request for return book", async () => {
    Book.findOne.mockResolvedValue({
      ISBN: "1234567890123",
      availableCopies: 9,
    });
    Book.findOneAndUpdate.mockResolvedValue({
      ISBN: "1234567890123",
      availableCopies: 10,
      available: true,
    });

    const returnBook = {
      ISBN: "1234567890123",
    };

    const response = await request(app)
      .post("/api/books/returnBook")
      .send(returnBook);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Book returned successfully");
    expect(response.body.updatedBook.availableCopies).toBe(10);
  });

  // Test for invalid ISBN length
  test("Should restrict returning a book with invalid ISBN length", async () => {
    const response = await request(app).post("/api/books/returnBook").send({
      ISBN: "1234567890", // Invalid ISBN length
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "ISBN must be a string of 13 characters"
    );
  });

  // Test for failed update operation
  test("Should return 500 if book information fails to update", async () => {
    Book.findOne.mockResolvedValue({
      ISBN: "1234567890123",
      availableCopies: 9,
    });
    Book.findOneAndUpdate.mockResolvedValue(null);

    const response = await request(app).post("/api/books/returnBook").send({
      ISBN: "1234567890123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Failed to update the book information");
  });

  // Test for internal server error
  test("Should handle unexpected errors gracefully", async () => {
    Book.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/api/books/returnBook").send({
      ISBN: "1234567890123",
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Internal server error");
  });
});
