const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

describe("Book returning check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for returning a book not borrowed (not in the system)
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
});
