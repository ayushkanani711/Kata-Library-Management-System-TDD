const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

describe("Book returning check", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  // Test for borrowing a book
  test("Should handle POST request for return book", async () => {
    const returnBook = {
      ISBN: "1234567890123",
    };

    const response = await request(app)
      .post("/api/books/returnBook")
      .send(returnBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Book returned successfully");
  });
});
