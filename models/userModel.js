const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide your email'],
      validate: [validator.isEmail, 'Your email must be valid'],
      lowercase: true,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'guide', 'lead-guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password.'],
      minlength: [
        8,
        'Your password must be more than or equal to 8 characters',
      ],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password.'],
      minlength: [
        8,
        'Your confirm password must be more than or equal to 8 characters',
      ],
      //This only works on SAVE() and CREATE();
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password and Confirm Password are not the same',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function (next) {
  //Only run this function if password was modified
  if (!this.isModified('password')) return next();

  //Hash password with cost of 12 and delete passwordConfirm
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = +(this.passwordChangedAt.getTime() / 1000);
    return JWTtimestamp < changedTimeStamp;
  }

  //false means not changes
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
