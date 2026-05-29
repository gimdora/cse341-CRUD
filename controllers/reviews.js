const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// check if review data is valid (used by POST and PUT)
const validateReview = (data) => {
  if (!data.bookId) {
    return 'bookId is required.';
  }
  if (!ObjectId.isValid(data.bookId)) {
    return 'bookId must be a valid ObjectId.';
  }
  if (!data.reviewerName || data.reviewerName === '') {
    return 'reviewerName is required.';
  }
  if (data.rating === undefined || data.rating === null) {
    return 'rating is required.';
  }
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    return 'rating must be a number between 1 and 5.';
  }
  if (!data.comment || data.comment === '') {
    return 'comment is required.';
  }
  return null;
};

// GET all reviews
const getAll = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Get all reviews'
  try {
    const result = await mongodb.getDb().db().collection('reviews').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while getting reviews.' });
  }
};

// GET one review by id
const getOne = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Get a single review by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').findOne({ _id: reviewId });
    if (!result) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while getting review.' });
  }
};

// POST create a new review
const createReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Create a new review'
  try {
    // validate input
    const error = validateReview(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    const review = {
      bookId: req.body.bookId,
      reviewerName: req.body.reviewerName,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: new Date()
    };
    const result = await mongodb.getDb().db().collection('reviews').insertOne(review);
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create review.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while creating review.' });
  }
};

// PUT update a review
const updateReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Update a review by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }
    // validate input
    const error = validateReview(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    const reviewId = new ObjectId(req.params.id);
    const review = {
      bookId: req.body.bookId,
      reviewerName: req.body.reviewerName,
      rating: req.body.rating,
      comment: req.body.comment,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date()
    };
    const result = await mongodb.getDb().db().collection('reviews').replaceOne({ _id: reviewId }, review);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while updating review.' });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.summary = 'Delete a review by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id format.' });
    }
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('reviews').deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while deleting review.' });
  }
};

module.exports = {
  getAll,
  getOne,
  createReview,
  updateReview,
  deleteReview
};
