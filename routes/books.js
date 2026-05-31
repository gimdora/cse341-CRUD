const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', booksController.getAll);
router.get('/:id', booksController.getOne);

// these routes need login
router.post('/', isAuthenticated, booksController.createBook);
router.put('/:id', isAuthenticated, booksController.updateBook);
router.delete('/:id', isAuthenticated, booksController.deleteBook);

module.exports = router;