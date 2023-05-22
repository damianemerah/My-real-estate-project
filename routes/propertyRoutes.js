const express = require("express");
const propertyController = require("../controllers/propertyController");

const route = express.Router();

route.get("/", propertyController.getAllProperty);
route.get("/:id", propertyController.getProperty);

route.post("/create", propertyController.createProperty);
route.delete("/:id", propertyController.deleteProperty);
route.patch("/:id", propertyController.updateProperty);

module.exports = route;
