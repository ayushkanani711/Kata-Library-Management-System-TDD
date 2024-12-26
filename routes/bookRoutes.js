const express = require("express");
const router = express.Router();
const addBookController = require("../controller/addBookController");
const borrowBookController = require("../controller/borrowBookController");
const returnBookController = require("../controller/returnBookController");

// Routes
router.post("/addNewBook", addBookController);
router.post("/borrowBook", borrowBookController);
router.post("/returnBook", returnBookController);

module.exports = router;
