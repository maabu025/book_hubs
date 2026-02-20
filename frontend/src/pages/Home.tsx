import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks } from '../store/booksSlice';
import FilterSidebar from '../components/FilterSidebar';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: books, loading, error, pagination } = useAppSelector((s) => s.books);

  // Initial load
  useEffect(() => {
    dispatch(fetchBooks());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="home">
      <div className="home-hero">
        <h1>Discover Your Next<br /><em>Great Read</em></h1>
        <p>Browse {pagination.totalBooks} curated books across every genre</p>
      </div>

      <div className="home-layout">
        <FilterSidebar />

        <main className="books-main">
          {loading && (
            <div className="books-loading">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="error-state">
              <p>⚠️ {error}</p>
              <button onClick={() => dispatch(fetchBooks())} className="btn btn-primary">Try again</button>
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No books found</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <div className="books-count">
                <strong>{pagination.totalBooks}</strong> books found
              </div>
              <div className="books-grid">
                {books.map((book) => <BookCard key={book._id} book={book} />)}
              </div>
              <Pagination />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
