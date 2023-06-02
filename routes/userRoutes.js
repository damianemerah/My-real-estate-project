const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);

module.exports = router;
