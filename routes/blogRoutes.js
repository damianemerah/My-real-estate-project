const express = require("express");
const blogSchema = require("../controllers/blogController");

const router = express.Router();

router.get("/", blogSchema.getAllBlog);
router.post("/new", blogSchema.createBlog);

module.exports = router;
