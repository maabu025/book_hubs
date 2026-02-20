import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api/client';
import { Book, BookFilters, BooksState, Pagination } from '../types';

const defaultFilters: BookFilters = {
  search: '',
  genre: '',
  author: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  minRating: 0,
  startYear: '',
  endYear: '',
};

const initialState: BooksState = {
  items: [],
  selectedBook: null,
  loading: false,
  error: null,
  filters: defaultFilters,
  pagination: { currentPage: 1, totalPages: 1, totalBooks: 0, limit: 12 },
  genres: [],
  authors: [],
};

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (_, { getState }) => {
    const { books } = getState() as { books: BooksState };
    const { filters, pagination } = books;

    const params: Record<string, string | number> = {
      page: pagination.currentPage,
      limit: pagination.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    if (filters.search) params.search = filters.search;
    if (filters.genre) params.genre = filters.genre;
    if (filters.author) params.author = filters.author;
    if (filters.minRating) params.minRating = filters.minRating;
    if (filters.startYear) params.startYear = filters.startYear;
    if (filters.endYear) params.endYear = filters.endYear;

    const { data } = await api.get('/books', { params });
    return data as { books: Book[]; pagination: Pagination };
  }
);

export const fetchBookById = createAsyncThunk('books/fetchBookById', async (id: string) => {
  const { data } = await api.get<Book>(`/books/${id}`);
  return data;
});

export const fetchGenres = createAsyncThunk('books/fetchGenres', async () => {
  const { data } = await api.get<string[]>('/books/genres');
  return data;
});

export const fetchAuthors = createAsyncThunk('books/fetchAuthors', async () => {
  const { data } = await api.get<string[]>('/books/authors');
  return data;
});

export const incrementReadCount = createAsyncThunk('books/incrementRead', async (id: string) => {
  const { data } = await api.post<{ readCount: number }>(`/books/${id}/read`);
  return { id, readCount: data.readCount };
});

// ── Slice ─────────────────────────────────────────────────────────────────────

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setGenre: (state, action: PayloadAction<string>) => {
      state.filters.genre = action.payload;
      state.pagination.currentPage = 1;
    },
    setAuthor: (state, action: PayloadAction<string>) => {
      state.filters.author = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.filters.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.filters.sortOrder = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.filters.minRating = action.payload;
      state.pagination.currentPage = 1;
    },
    setYearRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.filters.startYear = action.payload.start;
      state.filters.endYear = action.payload.end;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = defaultFilters;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.books;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch books';
      })
      .addCase(fetchBookById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch book';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => { state.genres = action.payload; })
      .addCase(fetchAuthors.fulfilled, (state, action) => { state.authors = action.payload; })
      .addCase(incrementReadCount.fulfilled, (state, action) => {
        const book = state.items.find((b) => b._id === action.payload.id);
        if (book) book.readCount = action.payload.readCount;
        if (state.selectedBook?._id === action.payload.id) {
          state.selectedBook.readCount = action.payload.readCount;
        }
      });
  },
});

export const {
  setSearch, setGenre, setAuthor, setSortBy, setSortOrder,
  setMinRating, setYearRange, clearFilters, setPage,
} = booksSlice.actions;

export default booksSlice.reducer;
