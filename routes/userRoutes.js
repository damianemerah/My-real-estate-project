const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router
  .patch("/bookmark/add", authController.protect, userController.addBookmark)
  .patch(
    "/bookmark/remove",
    authController.protect,
    userController.removeBookmark
  );
router.get(
  "/me",
  authController.isLoggedIn,
  userController.getMe,
  userController.getUser
);
router.patch(
  "/updateMe",
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.get("/logout", authController.logout);
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/:id", userController.getUser);

router.get("/", userController.getUsers);

module.exports = router;
