const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews');

router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getOne);
router.post('/', reviewsController.createReview);
router.put('/:id', reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
