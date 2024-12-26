const app = require("./app");
const connectToMongo = require("./config/database");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectToMongo();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB and start the server:", error);
    process.exit(1); // Exit process with failure code
  }
};

startServer();
