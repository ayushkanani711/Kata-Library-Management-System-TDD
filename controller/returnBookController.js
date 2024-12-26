const Book = require("../models/BookModel");

const returnBookController = async (req, res) => {
  try {
    const { ISBN } = req.body;

    // validate input
    if (!ISBN) {
      return res.status(403).json({
        status: false,
        message: "ISBN is required",
      });
    }

    // Validate input
    if (typeof ISBN !== "string" || ISBN.length !== 13) {
      return res.status(400).json({
        status: false,
        message: "ISBN must be a string of 13 characters",
      });
    }

    const returnedBook = await Book.findOne({ ISBN });
    if (!returnedBook) {
      return res.status(404).json({
        status: false,
        message: "Book not found",
      });
    }

    // Update available copies
    const remainingCopies = (returnedBook.availableCopies || 0) + 1;
    let isAvailable = remainingCopies > 0;

    const updatedBook = await Book.findOneAndUpdate(
      { ISBN },
      {
        availableCopies: remainingCopies,
        available: isAvailable,
      },
      { new: true }
    );

    if (updatedBook) {
      return res.status(201).json({
        status: true,
        message: "Book returned successfully",
        updatedBook,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Failed to update the book information",
      });
    }
  } catch (err) {
    console.error("Error in returnBookController:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = returnBookController;
