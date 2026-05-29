const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');

// check if book data is valid (used by POST and PUT)
const validateBook = (data) => {
  const requiredFields = [
    'title', 'author', 'isbn', 'genre',
    'publishedYear', 'publisher', 'pageCount', 'language'
  ];
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `${field} is required.`;
    }
  }
  if (typeof data.publishedYear !== 'number' || data.publishedYear < 0) {
    return 'publishedYear must be a positive number.';
  }
  if (typeof data.pageCount !== 'number' || data.pageCount <= 0) {
    return 'pageCount must be a positive number.';
  }
  if (data.rating !== undefined) {
    if (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5) {
      return 'rating must be a number between 0 and 5.';
    }
  }
  return null;
};

// GET all books
const getAll = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get all books'
  try {
    const result = await mongodb.getDb().db().collection('books').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while getting books.' });
  }
};

// GET one book by id
const getOne = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get a single book by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book id format.' });
    }
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('books').findOne({ _id: bookId });
    if (!result) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while getting book.' });
  }
};

// POST create a new book
const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Create a new book'
  try {
    // validate input first
    const error = validateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      publishedYear: req.body.publishedYear,
      publisher: req.body.publisher,
      pageCount: req.body.pageCount,
      language: req.body.language,
      summary: req.body.summary || '',
      rating: req.body.rating !== undefined ? req.body.rating : 0
    };
    const result = await mongodb.getDb().db().collection('books').insertOne(book);
    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create book.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while creating book.' });
  }
};

// PUT update a book
const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Update a book by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book id format.' });
    }
    // validate input
    const error = validateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    const bookId = new ObjectId(req.params.id);
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      genre: req.body.genre,
      publishedYear: req.body.publishedYear,
      publisher: req.body.publisher,
      pageCount: req.body.pageCount,
      language: req.body.language,
      summary: req.body.summary || '',
      rating: req.body.rating !== undefined ? req.body.rating : 0
    };
    const result = await mongodb.getDb().db().collection('books').replaceOne({ _id: bookId }, book);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while updating book.' });
  }
};

// DELETE a book
const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Delete a book by id'
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid book id format.' });
    }
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('books').deleteOne({ _id: bookId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error while deleting book.' });
  }
};

module.exports = {
  getAll,
  getOne,
  createBook,
  updateBook,
  deleteBook
};
