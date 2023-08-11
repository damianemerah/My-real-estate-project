const uuid = require("uuid");
const multer = require("multer");
const sharp = require("sharp");
const Property = require("../models/propertyModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, please upload only images"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadPropertyImages = (req, res, next) => {
  upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 20 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error occurred (e.g., file size exceeds limits)
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new AppError(
            "Too many files uploaded for 'images' field. Maximum count is 20.",
            400
          )
        );
      }
    } else if (err) {
      // Other error occurred
      return next(err);
    }
    // No error, proceed to the next middleware
    next();
  });
};

exports.resizePropertyImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  if (req.files.imageCover) {
    req.body.imageCover = `property-${uuid.v4()}-${Date.now()}-cover.jpeg`;

    // Cover image

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/properties/${req.body.imageCover}`);
  }

  if (req.files.images) {
    //images
    if (!req.body.images) {
      req.body.images = [];
    } else if (typeof req.body.images === "string") {
      const arr = [];
      arr.push(req.body.images);

      req.body.images = [...arr];
    }

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `property-${uuid.v4()}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/properties/${filename}`);

        req.body.images.push(filename);
      })
    );
  }
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createProperty = catchAsync(async (req, res, next) => {
  req.body.amenities = JSON.parse(req.body.amenities);
  req.body.location = JSON.parse(req.body.location);
  req.body.agent = req.user;
  const filteredBody = filterObj(
    req.body,
    "amenities",
    "name",
    "price",
    "priceDiscount",
    "imageCover",
    "images",
    "tags",
    "area",
    "type",
    "location",
    "description",
    "agent"
  );

  const property = await Property.create(filteredBody);

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
    fields: "name companyName",
  });

  res.status(200).json({
    status: "success",
    data: {
      data: property,
    },
  });
});

exports.getAllProperty = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new APIFeatures(Property.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;

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
    data: null,
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  req.body.amenities = JSON.parse(req.body.amenities);
  req.body.location = JSON.parse(req.body.location);
  req.body.agent = req.user;
  const filteredBody = filterObj(
    req.body,
    "name",
    "price",
    "priceDiscount",
    "amenities",
    "imageCover",
    "images",
    "tags",
    "area",
    "type",
    "location",
    "description",
    "agent"
  );

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: property,
    },
  });
});
