const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
// const blogController = require("../controllers/blogController");

const router = express.Router();

router
  .get(
    "/property/:id/update",
    authController.protect,
    authController.restrictTo("agent", "admin"),
    viewController.updatePropertyView
  )
  .get(
    "/property/new",
    authController.protect,
    authController.restrictTo("agent", "admin"),
    viewController.newProperty
  )
  .get("/bookmarks", authController.protect, viewController.getBookmarks)
  .get("/me", authController.protect, viewController.getAccount)
  .get("/property/:id", authController.isLoggedIn, viewController.getProperty)
  .get("/property", authController.isLoggedIn, viewController.getAllProperties)
  .get("/login", authController.isLoggedIn, viewController.getLogin)
  .get("/signup", viewController.getSignup)
  .get("/", authController.isLoggedIn, viewController.getOverview)
  .get("/*", viewController.getErrorPage);
// .get("/blog/:id", authController.isLoggedIn, viewController.getBlog)
// .get("/blog", authController.isLoggedIn, viewController.getBlogs)

module.exports = router;
