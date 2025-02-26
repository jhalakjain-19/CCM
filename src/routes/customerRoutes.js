const express = require("express");
const CustomerController = require("../controllers/customerController");

const router = express.Router();

//Router to get all attribute types
router.get("/attr-types", CustomerController.getAttrTypes);

//Router to get all data types
router.get("/data-types", CustomerController.getDataTypes);
//create aattribute name
router.post("/create-attribute", CustomerController.createAttribute);
//get all attribute name
router.get("/get-attributes", CustomerController.getAttributes);
module.exports = router;
