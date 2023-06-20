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
    authController.isLoggedIn,
    authController.restrictTo("agent", "admin"),
    viewController.newProperty
  )
  .get("/property/:id", authController.isLoggedIn, viewController.getProperty);

router.get("/blog/:id", authController.isLoggedIn, viewController.getBlog);
router.get("/blog", authController.isLoggedIn, viewController.getBlogs);

router.get("/login", authController.isLoggedIn, viewController.getLogin);

router.get("/", authController.isLoggedIn, viewController.getOverview);

router.get("/*", viewController.getErrorPage);

module.exports = router;
