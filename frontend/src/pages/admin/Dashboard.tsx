import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Insights } from '../../types';
import StarRating from '../../components/StarRating';

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<Insights>('/admin/insights')
      .then((r) => setInsights(r.data))
      .catch(() => setError('Failed to load insights'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (error) return <div className="error-state centered"><p> {error}</p></div>;
  if (!insights) return null;

  const { overview, mostRead, leastRead, recentlyAdded, perBook, genreStats } = insights;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Book Hub Analytics &amp; Insights</p>
        </div>
        <Link to="/admin/books" className="btn btn-primary">Manage Books →</Link>
      </div>

      {/* Overview cards */}
      <div className="stat-cards">
        <div className="stat-card blue">
          <div className="stat-card-icon">📚</div>
          <div className="stat-card-value">{overview.totalBooks}</div>
          <div className="stat-card-label">Total Books</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-icon">👁</div>
          <div className="stat-card-value">{overview.totalReads.toLocaleString()}</div>
          <div className="stat-card-label">Total Reads</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-card-icon">📊</div>
          <div className="stat-card-value">{overview.avgReadsPerBook}</div>
          <div className="stat-card-label">Avg Reads / Book</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-card-icon">🏷</div>
          <div className="stat-card-value">{genreStats.length}</div>
          <div className="stat-card-label">Genres</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Top 5 Most Read */}
        <div className="dashboard-card">
          <h2>🏆 Top 5 Most Read</h2>
          <div className="rank-list">
            {mostRead.map((book, i) => (
              <div key={book._id} className="rank-item">
                <span className={`rank-num rank-${i + 1}`}>{i + 1}</span>
                <img src={book.coverImage} alt={book.title} className="rank-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&q=80'; }} />
                <div className="rank-info">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </div>
                <div className="rank-count">
                  <span className="count-badge">{book.readCount.toLocaleString()}</span>
                  <span className="count-label">reads</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 Least Read */}
        <div className="dashboard-card">
          <h2>📉 Bottom 5 Least Read</h2>
          <div className="rank-list">
            {leastRead.map((book, i) => (
              <div key={book._id} className="rank-item">
                <span className="rank-num rank-low">{i + 1}</span>
                <img src={book.coverImage} alt={book.title} className="rank-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&q=80'; }} />
                <div className="rank-info">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </div>
                <div className="rank-count">
                  <span className="count-badge low">{book.readCount.toLocaleString()}</span>
                  <span className="count-label">reads</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div className="dashboard-card">
          <h2>🆕 Recently Added</h2>
          <div className="recent-list">
            {recentlyAdded.map((book) => (
              <div key={book._id} className="recent-item">
                <img src={book.coverImage} alt={book.title} className="rank-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&q=80'; }} />
                <div>
                  <strong>{book.title}</strong>
                  <p>{book.author} · {book.genre}</p>
                  <small>{new Date(book.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Genre Stats */}
        <div className="dashboard-card">
          <h2>📂 Genre Stats</h2>
          <table className="stats-table">
            <thead>
              <tr><th>Genre</th><th>Books</th><th>Reads</th><th>Avg ★</th></tr>
            </thead>
            <tbody>
              {genreStats.map((g) => (
                <tr key={g._id}>
                  <td>{g._id}</td>
                  <td>{g.count}</td>
                  <td>{g.totalReads.toLocaleString()}</td>
                  <td><StarRating rating={g.avgRating} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Read Count per Book */}
        <div className="dashboard-card full-width-card">
          <h2>📖 Read Count per Book</h2>
          <div className="reads-bar-list">
            {perBook.slice(0, 15).map((book) => {
              const max = perBook[0]?.readCount || 1;
              const pct = (book.readCount / max) * 100;
              return (
                <div key={book._id} className="reads-bar-item">
                  <span className="reads-bar-title">{book.title}</span>
                  <div className="reads-bar-track">
                    <div className="reads-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="reads-bar-val">{book.readCount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
