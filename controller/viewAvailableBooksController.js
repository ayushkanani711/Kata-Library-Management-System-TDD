const Book = require("../models/BookModel");

const viewAvailableBooksController = async (req, res) => {
  try {
    const availableBooks = await Book.find({ available: true });
    if (availableBooks.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Sorry, no books available",
      });
    }
    res.status(200).json({
      status: true,
      message: "Books available",
      availableBooks,
    });
  } catch (err) {
    console.error("Error in viewAvailableBooksController:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = viewAvailableBooksController;
