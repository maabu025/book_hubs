const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// All routes here require admin
router.use(protect, adminOnly);

// GET /api/admin/insights  — comprehensive dashboard data
router.get('/insights', async (req, res) => {
  try {
    const [
      totalBooks,
      totalReadsAgg,
      mostRead,
      leastRead,
      recentlyAdded,
      perBook,
      genreStats,
    ] = await Promise.all([
      Book.countDocuments(),

      Book.aggregate([{ $group: { _id: null, total: { $sum: '$readCount' } } }]),

      Book.find().sort({ readCount: -1 }).limit(5).select('title author readCount coverImage genre rating'),

      Book.find().sort({ readCount: 1 }).limit(5).select('title author readCount coverImage genre rating'),

      Book.find().sort({ createdAt: -1 }).limit(10).select('title author createdAt coverImage genre'),

      Book.find().sort({ readCount: -1 }).select('title author readCount'),

      Book.aggregate([
        {
          $group: {
            _id: '$genre',
            count: { $sum: 1 },
            totalReads: { $sum: '$readCount' },
            avgRating: { $avg: '$rating' },
          },
        },
        { $sort: { totalReads: -1 } },
      ]),
    ]);

    const totalReads = totalReadsAgg[0]?.total ?? 0;

    res.json({
      overview: {
        totalBooks,
        totalReads,
        avgReadsPerBook: totalBooks ? (totalReads / totalBooks).toFixed(1) : '0',
      },
      mostRead,
      leastRead,
      recentlyAdded,
      perBook,
      genreStats,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
