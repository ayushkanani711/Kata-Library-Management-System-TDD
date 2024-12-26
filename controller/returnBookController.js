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

    return res.status(201).json({
      status: true,
      message: "Book returned successfully",
    });
  } catch {
    console.error("Error in returnBookController:", err);
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = returnBookController;
