const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const pool = require("./config/db.js");
const { roleNames } = require("./utils/commonUtils");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middlewares/errorHandler.js");
dotenv.config();
const app = express();
//PORT
const port = process.env.PORT || 8080;
// Swagger Server URL
// process.env.SWAGGER_SERVER_URL ||
const swaggerServerUrl = process.env.SWAGGER_SERVER_URL;

//middlewares
app.use(cors({}));

app.use(express.json());
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CCM",
      version: "1.0.0",
    },
    servers: [
      {
        url: swaggerServerUrl,
      },
    ],
  },
  apis: ["./routes/userRoutes.js"],
};
const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", userRoutes);
console.log(`User role is: ${roleNames[1]}`);
app.use(errorHandler);

//routes
app.get("/test", (req, res) => {
  res.status(200).send("<h1>CCM</h1>");
  console.log("get success");
});
//test db connection
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.message);
//     process.exit(1); // Exit the process if the database connection fails
//   } else {
//     console.log("Database connection successful!");
//     connection.release(); // Release the connection back to the pool
//   }
// });
//Listen
app.listen(port, () => {
  console.log(`Server running on port :${port}`);
});
