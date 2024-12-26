const Book = require("../models/BookModel");

const borrowBookController = async (req, res) => {
  try {
    const { ISBN } = req.body;

    // Validate input
    if (!ISBN) {
      return res.status(403).json({
        status: false,
        message: "ISBN is required",
      });
    }

    // Find the book by ISBN
    const book = await Book.findOne({ ISBN });
    if (!book) {
      return res.status(400).json({
        status: false,
        message: "Book not available in the library",
      });
    }

    // Check if the book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        status: false,
        message: "Book stock is not available in the library",
      });
    }

    // Update the book's availability
    const remainingCopies = book.availableCopies - 1;
    const isAvailable = remainingCopies > 0;

    const updatedBook = await Book.findOneAndUpdate(
      { ISBN },
      {
        availableCopies: remainingCopies,
        available: isAvailable,
      },
      { new: true } // Return the updated document
    );

    // Return success response
    return res.status(201).json({
      status: true,
      message: "Book borrowed successfully",
      updatedBook,
    });
  } catch (err) {
    console.error("Error in borrowBookController:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = borrowBookController;
