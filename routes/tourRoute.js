const express = require('express');

const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');

const reviewRouter = require('./reviewRoute');

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.addReview
//   );

router.use('/:tourId/reviews', reviewRouter);

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
  // checkID,
} = tourController;

const { protect, restrictTo } = authController;

// router.param('id', checkID);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/tour-stats').get(getTourStats);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
