/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const crypto = require('crypto');
const {
  BadRequestError,
  UnAuthorizedError,
  NotFoundError,
  InternalServerError,
} = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const {
  validateRegisterData,
  validateLoginData,
} = require('../utils/validators');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  const data = validateRegisterData(req.body);

  // Create user
  const user = await User.create(data);

  // await sendEmail({
  //   email: user.email,
  //   subject: `Welcome to the ${process.env.FROM_NAME} community!`,
  //   template: 'email/welcomeMessage',
  //   context: {
  //     'firstName': user.firstName
  //   }
  // })

  return sendTokenCookieResponse(user, 200, res);
};

/**
 * @desc    Log user in
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  const { email, password } = validateLoginData(req.body);

  if (!email || !password) {
    return next(
      new BadRequestError('Please enter an email address & a password'),
    );
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new UnAuthorizedError('Invalid credentials'), 401);

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new UnAuthorizedError('Invalid credentials'), 401);

  sendTokenCookieResponse(user, 200, res);
};

/**
 * @desc    Log user out / Clear token cookie
 * @route   GET /api/v1/auth/logout
 * @access  Public
 */
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
};

/**
 * @desc    Get current logged in user
 * @route   POST /api/v1/auth/me
 * @access  Private
 */
exports.currentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Get password reset token
 * @route   POST /api/v1/auth/reset
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new NotFoundError('No user found with that email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/reset/${resetToken}`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: `Password Reset Token :: ${process.env.FROM_NAME}`,
    //   template: 'email/forgotPassword',
    //   context: { 'resetURL': resetURL }
    // })

    res.status(200).json({ status: 'success', message: 'Reset token email sent' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new InternalServerError('Reset token email could not be sent', 500),
    );
  }

  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/reset/:resetToken
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    // eslint-disable-next-line no-dupe-keys
    resetPasswordToken: { $gt: Date.now() },
  });

  if (!user) return next(new BadRequestError('Oops! Invalid token :(', 400));

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiration = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenCookieResponse(user, 200, res);
};

/**
 * @desc    Update user details
 * @route   PUT /api/v1/auth/updateDetails
 * @access  Private
 */
exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
};

/**
 * @desc    Update user password
 * @route   PUT /api/v1/auth/updatePassword
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new UnAuthorizedError('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenCookieResponse(user, 200, res);
};

// Helper function for sending encrypted token cookie
const sendTokenCookieResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;

  return res.status(statusCode).cookie('token', token, options).json({
    status: 'success',
    token,
  });
};
