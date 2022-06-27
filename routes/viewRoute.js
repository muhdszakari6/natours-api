const express = require('express');

const viewController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.use(viewController.alerts);

router.get(
  '/',
  // bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.get('/login', authController.isLoggedIn, viewController.getLogin);

router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/me', authController.protect, viewController.getAccount);

router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
