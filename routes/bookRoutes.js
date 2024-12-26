const express = require("express");
const router = express.Router();
const addBookController = require("../controller/addBookController");
const borrowBookController = require("../controller/borrowBookController");
const returnBookController = require("../controller/returnBookController");
const viewAvailableBooksController = require("../controller/viewAvailableBooksController");

// Routes
router.post("/addNewBook", addBookController);
router.post("/borrowBook", borrowBookController);
router.post("/returnBook", returnBookController);
router.get("/viewAvailableBooks", viewAvailableBooksController);

module.exports = router;
