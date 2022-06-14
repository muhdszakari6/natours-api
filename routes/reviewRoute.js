const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const {
  addReview,
  getReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserIds,
} = reviewController;
const { protect, restrictTo } = authController;

router.use(authController.protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, addReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview);

module.exports = router;
