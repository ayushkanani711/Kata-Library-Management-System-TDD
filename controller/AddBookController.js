const Book = require("../models/BookModel");

const addBookController = async (req, res) => {
  try {
    const { ISBN, title, author, yearOfPublish, available, availableCopies } =
      req.body;

    // Validate input
    if (
      ISBN === undefined ||
      title === undefined ||
      author === undefined ||
      yearOfPublish === undefined ||
      available === undefined ||
      availableCopies === undefined
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate input types
    if (
      typeof ISBN !== "string" ||
      typeof title !== "string" ||
      typeof author !== "string" ||
      typeof yearOfPublish !== "number" ||
      typeof available !== "boolean" ||
      typeof availableCopies !== "number"
    ) {
      return res.status(403).json({
        success: false,
        message: "Incorrect input type",
      });
    }

    // Validate ISBN length
    if (ISBN.length !== 13) {
      return res.status(403).json({
        success: false,
        message: "ISBN should be 13 characters long",
      });
    }

    // Validate copy count
    if (availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book should have at least 1 copy",
      });
    }

    if (yearOfPublish > new Date().getFullYear()) {
      return res.status(403).json({
        success: false,
        message: "Invalid year of publication",
      });
    }

    // Check if the book already exists
    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book already exists",
      });
    }

    // Add the book
    const newBook = await Book.create({
      ISBN,
      title,
      author,
      yearOfPublish,
      available,
      availableCopies,
    });

    if (!newBook) {
      return res.status(400).json({
        success: false,
        message: "Error adding the book. Please try again!",
      });
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      newBook,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = addBookController;
