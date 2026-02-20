import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import api from '../api/client';

interface Props {
  book?: Book | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyForm = {
  title: '', author: '', genre: '', description: '', coverImage: '',
  publicationDate: '', isbn: '', publisher: '', pages: '', language: 'English',
  rating: '0', totalRatings: '0',
};

const GENRES = ['Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance',
  'Historical Fiction', 'Young Adult', 'Adventure', 'Biography', 'Self-Help', 'Horror', 'Other'];

const BookForm: React.FC<Props> = ({ book, onSuccess, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverImage: book.coverImage,
        publicationDate: book.publicationDate.split('T')[0],
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        pages: String(book.pages || ''),
        language: book.language || 'English',
        rating: String(book.rating),
        totalRatings: String(book.totalRatings),
      });
    } else {
      setForm(emptyForm);
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        pages: parseInt(form.pages) || 0,
        rating: parseFloat(form.rating) || 0,
        totalRatings: parseInt(form.totalRatings) || 0,
      };
      if (book) {
        await api.put(`/books/${book._id}`, payload);
      } else {
        await api.post('/books', payload);
      }
      onSuccess();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-field">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Book title" />
            </div>
            <div className="form-field">
              <label>Author *</label>
              <input name="author" value={form.author} onChange={handleChange} required placeholder="Author name" />
            </div>
            <div className="form-field">
              <label>Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange} required>
                <option value="">Select genre...</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Publication Date *</label>
              <input name="publicationDate" type="date" value={form.publicationDate} onChange={handleChange} required />
            </div>
            <div className="form-field full-width">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Book description..." />
            </div>
            <div className="form-field full-width">
              <label>Cover Image URL</label>
              <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-field">
              <label>Publisher</label>
              <input name="publisher" value={form.publisher} onChange={handleChange} placeholder="Publisher" />
            </div>
            <div className="form-field">
              <label>ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" />
            </div>
            <div className="form-field">
              <label>Pages</label>
              <input name="pages" type="number" value={form.pages} onChange={handleChange} placeholder="0" min="0" />
            </div>
            <div className="form-field">
              <label>Language</label>
              <input name="language" value={form.language} onChange={handleChange} placeholder="English" />
            </div>
            <div className="form-field">
              <label>Rating (0–5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Total Ratings</label>
              <input name="totalRatings" type="number" min="0" value={form.totalRatings} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
