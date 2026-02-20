import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import StarRating from './StarRating';

interface Props {
  book: Book;
}

const BookCard: React.FC<Props> = ({ book }) => {
  const year = new Date(book.publicationDate).getFullYear();

  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="card-cover">
        <img
          src={book.coverImage}
          alt={book.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
          }}
        />
        <div className="card-genre-badge">{book.genre}</div>
      </div>
      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">by {book.author}</p>
        <div className="card-rating">
          <StarRating rating={book.rating} size="sm" />
        </div>
        <div className="card-meta">
          <span className="card-year">{year}</span>
          <span className="card-reads">👁 {book.readCount.toLocaleString()} reads</span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
