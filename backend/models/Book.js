const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    author: { type: String, required: [true, 'Author is required'], trim: true },
    genre: { type: String, required: [true, 'Genre is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    },
    publicationDate: { type: Date, required: [true, 'Publication date is required'] },
    isbn: { type: String, default: '' },
    publisher: { type: String, default: '' },
    pages: { type: Number, default: 0 },
    language: { type: String, default: 'English' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    readCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Full-text search index
bookSchema.index({ title: 'text', author: 'text', description: 'text', genre: 'text' });

module.exports = mongoose.model('Book', bookSchema);
