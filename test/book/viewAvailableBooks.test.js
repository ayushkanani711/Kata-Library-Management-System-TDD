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
  });

  // Test for fetching available books
  test("Should return all available books", async () => {
    Book.find.mockResolvedValue(mockBooks);

    const response = await request(app).get("/api/books/viewAvailableBooks");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Available books fetched successfully");
    expect(response.body.books).toEqual(mockBooks);
  });
});
