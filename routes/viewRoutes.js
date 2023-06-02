const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
// const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", authController.isLoggedIn, viewController.getOverview);
router.get("/blog/:id", viewController.getBlog);
router.get("/property/:id", viewController.getProperty);
router.get("/blog", authController.isLoggedIn, viewController.getBlogs);

router.get("/login", viewController.getLogin);

module.exports = router;
