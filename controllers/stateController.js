const catchAsync = require("./../utils/catchAsync");
const { State, City } = require("../models/stateModel");
const AppError = require("../utils/appError");

exports.createState = catchAsync(async (req, res, next) => {
  const state = await State.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: state,
    },
  });
});

exports.deleteState = catchAsync(async (req, res, next) => {
  const state = await State.findByIdAndDelete(req.params.id);

  if (!state) return next(new AppError("No doc with that id"));

  req.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.updateState = catchAsync(async (req, res, next) => {
  const state = await State.findByIdAndUpdate(req.body);

  req.status(200).json({
    status: "success",
    data: {
      data: state,
    },
  });
});

exports.getState = catchAsync(async (req, res, next) => {
  const state = await State.findById(req.params.id);

  req.status(200).json({
    status: "success",
    data: {
      data: state,
    },
  });
});

exports.getAllState = catchAsync(async (req, res, next) => {
  const states = await State.find();

  req.status(200).json({
    status: "success",
    data: {
      data: states,
    },
  });
});

exports.createCity = catchAsync(async (req, res, next) => {
  const city = await City.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: city,
    },
  });
});

exports.getAllCity = catchAsync(async (req, res, next) => {
  const cities = await City.find();

  res.status(200).json({
    status: "success",
    result: cities.length,
    data: {
      data: cities,
    },
  });
});
