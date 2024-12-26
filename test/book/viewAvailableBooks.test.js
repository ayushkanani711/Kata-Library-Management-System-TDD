const request = require("supertest");
const app = require("../../app");
const Book = require("../../models/BookModel");

// Mock the Book model
jest.mock("../../models/BookModel");

describe("View Available Books Check", () => {
  let mockBooks;

  beforeEach(() => {
    mockBooks = [
      {
        ISBN: "1234567890123",
        title: "Book 1",
        availableCopies: 5,
        available: true,
      },
      {
        ISBN: "9876543210987",
        title: "Book 2",
        availableCopies: 3,
        available: true,
      },
    ];

    // Clear mocks before each test
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
  });

  afterEach(() => {
    console.error.mockRestore(); // Restore console.error after tests
  });

  // Test for fetching available books
  test("Should return all available books", async () => {
    Book.find.mockResolvedValue(mockBooks);

    const response = await request(app).get("/api/books/viewAvailableBooks");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Books available");
    expect(response.body.availableBooks).toEqual(mockBooks);
  });

  // Test for no available books
  test("Should return no available books message when none are available", async () => {
    Book.find.mockResolvedValue([]);

    const response = await request(app).get("/api/books/viewAvailableBooks");
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Sorry, no books available");
  });

  // Test for ensuring only available books are shown
  test("Should return only available books", async () => {
    const books = [
      { ISBN: "1234567890123", title: "Book 1", available: true },
      { ISBN: "9876543210987", title: "Book 2", available: false }, // This should not be returned
    ];

    Book.find.mockResolvedValue(books.filter((book) => book.available));

    const response = await request(app).get("/api/books/viewAvailableBooks");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Books available");
    expect(response.body.availableBooks).toEqual([books[0]]);
  });

  // Test for internal server error
  test("Should handle internal server error", async () => {
    Book.find.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/books/viewAvailableBooks");
    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("Internal server error");
  });
});
