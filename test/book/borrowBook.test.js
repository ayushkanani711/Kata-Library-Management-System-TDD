const request = require("supertest");
require("dotenv").config();
const App = process.env.APP_URL;

describe("Borrow book check", () => {
  test("Should handle POST request for borrowBook", async () => {
    const borrowBook = {
      ISBN: "1234567891238",
    };
    const response = await request(App)
      .post("api/books/borrowBook")
      .send(borrowBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe("Book borrowed successfully");
  });
});
