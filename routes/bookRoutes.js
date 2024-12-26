const express = require("express");
const router = express.Router();
const AddBookController = require("../controller/AddBookController");
const borrowBookController = require("../controller/borrowBookController");

router.post("/addNewBook", AddBookController);
router.post("/borrowBook", borrowBookController);

module.exports = router;
