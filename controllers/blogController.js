const { Blog, Comment } = require("../models/blogModel");
const AppError = require("../utils/appError");
const catchAsync = require("./../utils/catchAsync");

exports.createBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: blog,
    },
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) return next(new AppError("No document found with that id", 404));

  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: blog,
    },
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.find(req.params.id).populate("comments");

  res.status(200).json({
    status: "success",
    data: {
      data: blog,
    },
  });
});

exports.getAllBlog = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find({});

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      data: blogs,
    },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.create(req.body);

  req.status(201).json({
    status: "success",
    data: {
      data: comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findOneAndDelete(req.params.id);

  if (!comment) return next(new AppError("No comment with that id", 404));

  req.status(201).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
