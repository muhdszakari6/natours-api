const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeature');
const AppError = require('../utils/appError');

const User = require('../models/userModel');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //Create error if user post password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update.', 400));
  }

  //Update user document
  const filteredBody = filterObj(req.body, 'name', 'emails');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup',
  });
};

exports.getUser = factory.getOne(User);

exports.getAllUsers = factory.getAll(User);

exports.deleteUser = factory.deleteOne(User);

exports.updateUser = factory.updateOne(User);
