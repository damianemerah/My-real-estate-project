const express = require("express");
const cityController = require("../controllers/stateController");

const router = express.Router();

router.get("/", cityController.getAllCity);
router.post("/new", cityController.createCity);

module.exports = router;
