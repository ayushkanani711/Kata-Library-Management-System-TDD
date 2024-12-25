const Book = require("../models/BookModel");

const AddBookController = async (req, res) => {
  try {
    const { ISBN, title, author, yearOfPublish, available, availableCopies } =
      req.body;

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

    const existingBook = await Book.findOne({ ISBN });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Book already exists",
      });
    }

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

module.exports = AddBookController;
