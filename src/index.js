const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./config/db.js");
dotenv.config();
const app = express();
//PORT
const port = process.env.PORT || 8080;

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get("/test", (req, res) => {
  res.status(200).send("<h1>CCM</h1>");
  console.log("get success");
});
//test db connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  } else {
    console.log("Database connection successful!");
    connection.release(); // Release the connection back to the pool
  }
});
//Listen
app.listen(port, () => {
  console.log(`Server running on port :${port}`);
});
