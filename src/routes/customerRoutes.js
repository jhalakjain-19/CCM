const express = require("express");
const CustomerController = require("../controllers/customerController");

const router = express.Router();

// Route to get all customers
//router.get("/", CustomerController.getAllCustomers);

// // Route to get a single customer by ID
// router.get("/:id", CustomerController.getCustomerById);

// // Route to create a new customer
// router.post("/", CustomerController.createCustomer);

// // Route to update a customer
// router.put("/:id", CustomerController.updateCustomer);

// // Route to delete a customer
// router.delete("/:id", CustomerController.deleteCustomer);

router.get("/attr-types", CustomerController.getAttrTypes);
module.exports = router;
