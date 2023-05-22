const express = require("express");
const stateController = require("../controllers/stateController");

const router = express.Router();

router.get("/", stateController.getAllState);
router.get("/:id", stateController.getState);
router.post("/new", stateController.createState);
router.patch("/:id", stateController.updateState);
router.delete("/:id", stateController.deleteState);

module.exports = router;
