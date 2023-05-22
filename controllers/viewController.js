const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Blog } = require("../models/blogModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const properties = await Property.find();

  res.status(200).render("overview", {
    title: "All Properties",
    properties,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  console.log(blog);

  res.status(200).render("blog", {
    blog,
    title: blog.title,
  });
});
