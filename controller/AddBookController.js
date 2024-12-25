const Book = require("../models/BookModel");

const AddBookController = async (req, res) => {
  try {
    const { ISBN, title, author, yearOfPublish, available, availableCopies } =
      req.body;
    const newBook = await Book.create({
      ISBN,
      title,
      author,
      yearOfPublish,
      available,
      availableCopies,
    });
    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      newBook,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = AddBookController;
