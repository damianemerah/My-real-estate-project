const catchAsync = require("../utils/catchAsync");
const Property = require("../models/propertyModel");
const AppError = require("../utils/appError");

exports.createProperty = catchAsync(async (req, res, next) => {
  const property = await Property.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: property,
    },
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.find(req.params.id).populate({
    path: "agent",
    fields: "name",
  });

  res.status(200).json({
    status: "success",
    data: {
      data: property,
    },
  });
});

exports.getAllProperty = catchAsync(async (req, res, next) => {
  const properties = await Property.find({}).populate("locations.city");

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: {
      data: properties,
    },
  });
});

exports.deleteProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if (!property)
    return next(new AppError("No document found with that id", 404));

  res.status(204).json({
    status: "success",
    data: {
      data: null,
    },
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: property,
    },
  });
});
