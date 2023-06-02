// const User = require("../models/userModel");
const Property = require("../models/propertyModel");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Blog } = require("../models/blogModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const properties = await Property.find();
  const blogs = await Blog.find();

  res.status(200).render("overview", {
    title: "All Properties",
    properties,
    blogs,
  });
});

exports.getBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find();

  res.status(200).render("blogs", {
    title: "All blogs",
    blogs,
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findById(req.params.id).populate({
    path: "agent",
    fields: "name companyName logo contact",
  });

  res.status(200).render("property", {
    title: property.name,
    property,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  res.status(200).render("blog", {
    blog,
    title: blog.title,
  });
});

exports.getLogin = (req, res) => {
  res.status(200).render("login", {
    title: "Login to your account",
  });
};
