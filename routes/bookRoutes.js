const express = require("express");
const router = express.Router();
const AddBookController = require("../controller/AddBookController");

router.post("/addNewBook", AddBookController);

module.exports = router;
