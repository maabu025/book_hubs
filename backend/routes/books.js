const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/books  — list with filter/sort/pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      genre = '',
      author = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minRating,
      startYear,
      endYear,
    } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = new RegExp(author, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (startYear || endYear) {
      filter.publicationDate = {};
      if (startYear) filter.publicationDate.$gte = new Date(`${startYear}-01-01`);
      if (endYear) filter.publicationDate.$lte = new Date(`${endYear}-12-31`);
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [books, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Book.countDocuments(filter),
    ]);

    res.json({
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBooks: total,
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/books/genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres.sort());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/authors
router.get('/authors', async (req, res) => {
  try {
    const authors = await Book.distinct('author');
    res.json(authors.sort());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(err.kind === 'ObjectId' ? 404 : 500).json({ message: 'Book not found' });
  }
});

// POST /api/books/:id/read  (protected — any logged-in user)
router.post('/:id/read', protect, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { readCount: 1 } },
      { new: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ readCount: book.readCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/books  (admin only)
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').trim().notEmpty().withMessage('Title required'),
    body('author').trim().notEmpty().withMessage('Author required'),
    body('genre').trim().notEmpty().withMessage('Genre required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    body('publicationDate').isISO8601().withMessage('Valid date required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// PUT /api/books/:id  (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/books/:id  (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
