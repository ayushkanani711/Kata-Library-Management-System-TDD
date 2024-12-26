const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

describe("Borrow book check", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for borrowing a book
  test("Should handle POST request for borrowBook", async () => {
    const book = {
      ISBN: "1234567890123",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    };

    Book.findOne.mockResolvedValue(book);

    // Mock Book.findOneAndUpdate to simulate updating the book's availableCopies
    Book.findOneAndUpdate.mockResolvedValue({
      ...book,
      availableCopies: 9,
    });
    const response = await request(app)
      .post("/api/books/borrowBook")
      .send({ ISBN: "1234567891235" });
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Book borrowed successfully");
  });

  // Test for attempting to borrow a non-existent book
  test("Should restrict to borrow book if not available", async () => {
    Book.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/books/borrowBook")
      .send({ ISBN: "1234567891235" });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Book not available in the library");
  });

  // Test for attempting to borrow a book with no available copies
  test("Should restrict to borrow book if stock is not available", async () => {
    const book = {
      ISBN: "1234567891235",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 0,
    };

    // Mock Book.findOne to return the book data with 0 availableCopies
    Book.findOne.mockResolvedValue(book);

    const response = await request(app)
      .post("/api/books/borrowBook")
      .send({ ISBN: "1234567891239" });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "Book stock is not available in the library"
    );
  });

  // Test for invalid ISBN format
  test("Should restrict borrowing with invalid ISBN format", async () => {
    const response = await request(app).post("/api/books/borrowBook").send({
      ISBN: "12345", // Invalid ISBN format
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Invalid ISBN format");
  });

  // Test for borrowing a book when stock reaches zero
  test("Should restrict borrowing if book stock reaches zero", async () => {
    const book = {
      ISBN: "1234567890123",
      title: "Book with no stock",
      availableCopies: 0,
    };
    Book.findOne.mockResolvedValue(book);

    const response = await request(app).post("/api/books/borrowBook").send({
      ISBN: "1234567890123",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe(
      "Book stock is not available in the library"
    );
  });
});
