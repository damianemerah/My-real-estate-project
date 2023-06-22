const express = require("express");
const propertyController = require("../controllers/propertyController");
const authController = require("../controllers/authController");

const route = express.Router();

route.post(
  "/new",
  authController.protect,
  propertyController.uploadPropertyImages,
  propertyController.resizePropertyImages,
  propertyController.createProperty
);

route
  .get("/:id", propertyController.getProperty)
  .delete("/:id", authController.protect, propertyController.deleteProperty)
  .patch(
    "/:id",
    authController.protect,
    propertyController.uploadPropertyImages,
    propertyController.resizePropertyImages,
    propertyController.updateProperty
  );
route.get("/", propertyController.getAllProperty);

module.exports = route;
