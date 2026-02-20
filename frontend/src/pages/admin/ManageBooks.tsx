import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Book } from '../../types';
import BookForm from '../../components/BookForm';
import StarRating from '../../components/StarRating';

const ManageBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/books', {
        params: { page, limit: 10, search },
      });
      setBooks(data.books);
      setTotalPages(data.pagination.totalPages);
      setTotalBooks(data.pagination.totalBooks);
    } catch {
      console.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/books/${id}`);
      setDeleteId(null);
      loadBooks();
    } catch {
      alert('Failed to delete book');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditBook(null);
    loadBooks();
  };

  const openEdit = (book: Book) => { setEditBook(book); setShowForm(true); };
  const openAdd = () => { setEditBook(null); setShowForm(true); };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Manage Books</h1>
          <p>{totalBooks} books in library</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/admin" className="btn btn-outline">← Dashboard</Link>
          <button onClick={openAdd} className="btn btn-primary">+ Add Book</button>
        </div>
      </div>

      <div className="manage-toolbar">
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="manage-search"
        />
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <>
          <div className="book-table-wrap">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title / Author</th>
                  <th>Genre</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Reads</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="table-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60&q=80'; }}
                      />
                    </td>
                    <td>
                      <div className="table-title">{book.title}</div>
                      <div className="table-author">{book.author}</div>
                    </td>
                    <td><span className="genre-pill">{book.genre}</span></td>
                    <td>{new Date(book.publicationDate).getFullYear()}</td>
                    <td><StarRating rating={book.rating} size="sm" /></td>
                    <td><strong>{book.readCount.toLocaleString()}</strong></td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => openEdit(book)} className="btn btn-sm btn-outline">Edit</button>
                        <button onClick={() => setDeleteId(book._id)} className="btn btn-sm btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: '1.5rem' }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">‹ Prev</button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">Next ›</button>
            </div>
          )}
        </>
      )}

      {/* Book form modal */}
      {showForm && (
        <BookForm
          book={editBook}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditBook(null); }}
        />
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <h2>Delete Book?</h2>
            <p style={{ margin: '1rem 0', color: '#6b7280' }}>
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteId(null)} className="btn btn-outline">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;
