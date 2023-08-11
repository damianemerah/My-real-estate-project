const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { async } = require("regenerator-runtime");

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      data: users,
    },
  });
});

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

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for updating password", 400));
  }
  //2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.addBookmark = catchAsync(async (req, res, next) => {
  const { bookmark } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { bookmark },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.removeBookmark = catchAsync(async (req, res, next) => {
  const { bookmark } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $pull: { bookmark },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("No such user", 401));

  res.status(204).json({
    status: "success",
    data: null,
  });
});
