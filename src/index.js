const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const customerRoutes = require("./routes/customerRoutes.js");
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
      title: "CCM API Documentation",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: swaggerServerUrl, // Change based on your API URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Format of the token
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply globally
      },
    ],
  },
  apis: ["./routes/userRoutes.js", "./routes/customerRoutes.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", userRoutes);
app.use("/api/customer", customerRoutes);
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
