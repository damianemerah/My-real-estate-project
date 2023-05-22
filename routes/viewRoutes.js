const express = require("express");
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");

const router = express.Router();

router.get("/", viewController.getOverview);
router.get("/blog/:id", viewController.getBlog);

module.exports = router;
