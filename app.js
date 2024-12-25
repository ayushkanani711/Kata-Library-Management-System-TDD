const express = require("express");
const app = express();
const PORT = 5002;

app.get("/", (req, res) => {
  return res.status(200).send("Server is running");
});

app.listen(PORT, () => {
  console.log(`\nServer is running on port : ${PORT}`);
});

module.exports = app;
