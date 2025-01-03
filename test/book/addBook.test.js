const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
});

afterEach(() => {
  console.error.mockRestore(); // Restore console.error after tests
});

describe("Add Book Check", () => {
  beforeEach(() => {
    book = {
      ISBN: "1234567890123",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    };

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  // Test for add book
  test("Should handle POST request", async () => {
    //
    Book.create.mockResolvedValue(book);

    const response = await request(app)
      .post("/api/books/addNewBook")
      .send(book);
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Book added successfully");
  });

  // Test for attempting to add an existing book
  test("Should restrict to add existing book", async () => {
    Book.findOne.mockResolvedValue(book);

    const response = await request(app)
      .post("/api/books/addNewBook")
      .send(book);
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Book already exists");
  });

  // Test for attempting to add a book with missing fields
  test("Should restrict to add book with missing fields", async () => {
    const response = await request(app)
      .post("/api/books/addNewBook")
      .send({ title: "The Alchemist" });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("All fields are required");
  });

  // Test for incorrect input
  test("Should restrict to add book with incorrect input", async () => {
    const response = await request(app).post("/api/books/addNewBook").send({
      ISBN: 1234567891235,
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect input type");
  });

  // Test for incorrect ISBN length
  test("Should restrict to add book with incorrect ISBN length", async () => {
    const response = await request(app).post("/api/books/addNewBook").send({
      ISBN: "123456789012345",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("ISBN should be 13 characters long");
  });

  // Test for not adding book with 0 copies
  test("Should restrict to add book with 0 copies", async () => {
    const response = await request(app).post("/api/books/addNewBook").send({
      ISBN: "1234567890123",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 0,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Book should have at least 1 copy");
  });

  // Test for invalid year (e.g., future years)
  test("Should restrict adding a book with a future year of publication", async () => {
    const response = await request(app)
      .post("/api/books/addNewBook")
      .send({
        ISBN: "1234567890123",
        title: "Future Book",
        author: "Author Name",
        yearOfPublish: new Date().getFullYear() + 1, // Next year
        available: true,
        availableCopies: 5,
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid year of publication");
  });

  // Test for invalid boolean value for 'available'
  test("Should restrict adding a book with non-boolean 'available' value", async () => {
    const response = await request(app).post("/api/books/addNewBook").send({
      ISBN: "1234567890123",
      title: "Book with invalid availability",
      author: "Author",
      yearOfPublish: 2024,
      available: "yes",
      availableCopies: 10,
    });
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect input type");
  });

  // Test for database error during book creation
  test("Should handle error when failing to create a new book", async () => {
    Book.findOne.mockResolvedValue(null);
    Book.create.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/books/addNewBook")
      .send(book);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Error adding the book. Please try again!"
    );
  });

  // Test for handling unexpected errors
  test("Should handle unexpected errors gracefully", async () => {
    Book.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app).post("/api/books/addNewBook").send({
      ISBN: "1234567890123",
      title: "The Alchemist",
      author: "Paulo Coelho",
      yearOfPublish: 1988,
      available: true,
      availableCopies: 10,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Internal server error");
  });
});
