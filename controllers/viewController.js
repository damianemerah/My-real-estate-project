const User = require("../models/userModel");
const Property = require("../models/propertyModel");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { Blog } = require("../models/blogModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getOverview = catchAsync(async (req, res, next) => {
  const properties = await Property.find({ featured: true }).populate("agent");
  const blogs = await Blog.find();

  res.status(200).render("overview", {
    title: "DreamLand",
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
    fields: "name companyName logo contact role",
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

exports.getSignup = (req, res) => {
  res.status(200).render("signup", {
    title: "Create an account",
  });
};

exports.newProperty = (req, res) => {
  res.status(200).render("newProperty", {
    title: "New property",
  });
};

exports.updatePropertyView = catchAsync(async (req, res) => {
  const property = await Property.findById(req.params.id);

  res.status(200).render("updateProperty", {
    title: property.name,
    property,
  });
});

exports.getAllProperties = catchAsync(async (req, res) => {
  // const properties = await Property.find();
  // console.log(properties[0].agent.name);

  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Property.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

  res.status(200).render("properties", {
    title: "All Property",
    properties,
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser,
  });
});

exports.getErrorPage = (req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
};

exports.getBookmarks = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("bookmark");

  const properties = [...user.bookmark];
  res.status(200).render("bookmarks", {
    title: "Bookmarks",
    properties,
  });
});
