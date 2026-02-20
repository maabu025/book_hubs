import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchGenres, fetchAuthors,
  setSearch, setGenre, setAuthor, setSortBy, setSortOrder,
  setMinRating, setYearRange, clearFilters, fetchBooks,
} from '../store/booksSlice';

const FilterSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, genres, authors, pagination } = useAppSelector((s) => s.books);
  const [searchVal, setSearchVal] = useState(filters.search);

  // Load filter options on mount
  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchAuthors());
  }, [dispatch]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => dispatch(setSearch(searchVal)), 400);
    return () => clearTimeout(t);
  }, [searchVal, dispatch]);

  // Re-fetch whenever filters or page changes
  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch, filters, pagination.currentPage]);

  const handleClear = () => {
    setSearchVal('');
    dispatch(clearFilters());
  };

  const hasActiveFilters =
    filters.search || filters.genre || filters.author || filters.minRating > 0 ||
    filters.startYear || filters.endYear;

  return (
    <aside className="filter-sidebar">
      <div className="filter-header">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button onClick={handleClear} className="clear-btn">Clear all</button>
        )}
      </div>

      {/* Search */}
      <div className="filter-group">
        <label>Search</label>
        <div className="search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Title, author, keyword..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          {searchVal && <button onClick={() => setSearchVal('')} className="clear-x">×</button>}
        </div>
      </div>

      {/* Genre */}
      <div className="filter-group">
        <label>Genre</label>
        <select value={filters.genre} onChange={(e) => dispatch(setGenre(e.target.value))}>
          <option value="">All genres</option>
          {genres.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Author */}
      <div className="filter-group">
        <label>Author</label>
        <select value={filters.author} onChange={(e) => dispatch(setAuthor(e.target.value))}>
          <option value="">All authors</option>
          {authors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Min Rating */}
      <div className="filter-group">
        <label>Minimum Rating</label>
        <div className="rating-row">
          {[0, 3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              className={`rating-chip ${filters.minRating === r ? 'active' : ''}`}
              onClick={() => dispatch(setMinRating(r))}
            >
              {r === 0 ? 'Any' : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Year range */}
      <div className="filter-group">
        <label>Publication Year</label>
        <div className="year-row">
          <input
            type="number"
            placeholder="From"
            min="1800"
            max="2024"
            value={filters.startYear}
            onChange={(e) => dispatch(setYearRange({ start: e.target.value, end: filters.endYear }))}
          />
          <span>–</span>
          <input
            type="number"
            placeholder="To"
            min="1800"
            max="2024"
            value={filters.endYear}
            onChange={(e) => dispatch(setYearRange({ start: filters.startYear, end: e.target.value }))}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label>Sort by</label>
        <select value={filters.sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
          <option value="createdAt">Date Added</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="rating">Rating</option>
          <option value="publicationDate">Publication Date</option>
          <option value="readCount">Popularity</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Order</label>
        <div className="order-row">
          <button
            className={`order-btn ${filters.sortOrder === 'desc' ? 'active' : ''}`}
            onClick={() => dispatch(setSortOrder('desc'))}
          >↓ Desc</button>
          <button
            className={`order-btn ${filters.sortOrder === 'asc' ? 'active' : ''}`}
            onClick={() => dispatch(setSortOrder('asc'))}
          >↑ Asc</button>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
