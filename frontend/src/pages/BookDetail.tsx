import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBookById, incrementReadCount } from '../store/booksSlice';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedBook: book, loading, error } = useAppSelector((s) => s.books);
  const { isAuthenticated } = useAuth();
  const [readMarked, setReadMarked] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchBookById(id));
  }, [id, dispatch]);

  const handleMarkRead = async () => {
    if (!id) return;
    await dispatch(incrementReadCount(id));
    setReadMarked(true);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  if (error || !book)
    return (
      <div className="error-state centered">
        <p>Book not found.</p>
        <Link to="/" className="btn btn-primary">← Back to Library</Link>
      </div>
    );

  const year = new Date(book.publicationDate).getFullYear();

  return (
    <div className="book-detail">
      <Link to="/" className="back-link">← Back to Library</Link>

      <div className="book-detail-card">
        <div className="book-cover-wrap">
          <img
            src={book.coverImage}
            alt={book.title}
            className="book-cover-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
            }}
          />
          <div className="genre-tag">{book.genre}</div>
        </div>

        <div className="book-info">
          <h1 className="book-detail-title">{book.title}</h1>
          <p className="book-detail-author">by <strong>{book.author}</strong></p>

          <div className="book-detail-rating">
            <StarRating rating={book.rating} />
            <span className="rating-count">({book.totalRatings.toLocaleString()} ratings)</span>
          </div>

          <div className="book-stats">
            <div className="stat">
              <span className="stat-value">{book.readCount.toLocaleString()}</span>
              <span className="stat-label">Reads</span>
            </div>
            <div className="stat">
              <span className="stat-value">{year}</span>
              <span className="stat-label">Published</span>
            </div>
            {book.pages > 0 && (
              <div className="stat">
                <span className="stat-value">{book.pages}</span>
                <span className="stat-label">Pages</span>
              </div>
            )}
          </div>

          <div className="book-description">
            <h2>About this book</h2>
            <p>{book.description}</p>
          </div>

          {book.publisher && (
            <div className="book-meta-list">
              {book.publisher && <div><strong>Publisher:</strong> {book.publisher}</div>}
              {book.isbn && <div><strong>ISBN:</strong> {book.isbn}</div>}
              <div><strong>Language:</strong> {book.language}</div>
            </div>
          )}

          <div className="book-actions">
            {isAuthenticated ? (
              <button
                className={`btn ${readMarked ? 'btn-success' : 'btn-primary'} btn-lg`}
                onClick={handleMarkRead}
                disabled={readMarked}
              >
                {readMarked ? '✓ Marked as Read!' : 'Mark as Read'}
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline btn-lg">Login to track reads</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
