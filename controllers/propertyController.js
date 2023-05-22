const catchAsync = require("./../utils/catchAsync");
const { Property, House } = require("../models/propertyModel");

exports.createProperty = catchAsync(async (req, res, next) => {
  let property;
  if (req.body.type.toLowerCase() === "land")
    property = await Property.create(req.body);
  else if (req.body.type.toLowerCase() === "house")
    property = await House.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      data: property,
    },
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.find(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: property,
    },
  });
});

exports.getAllProperty = catchAsync(async (req, res, next) => {
  const properties = await Property.find({});

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
