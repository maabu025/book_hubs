// ── User & Auth ──────────────────────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// ── Book ─────────────────────────────────────────────────────────────────────
export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  publicationDate: string;
  isbn: string;
  publisher: string;
  pages: number;
  language: string;
  rating: number;
  totalRatings: number;
  readCount: number;
  createdAt: string;
  updatedAt: string;
}

export type BookFormData = Omit<Book, '_id' | 'readCount' | 'createdAt' | 'updatedAt'>;

// ── Redux Filtering State ─────────────────────────────────────────────────────
export interface BookFilters {
  search: string;
  genre: string;
  author: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  minRating: number;
  startYear: string;
  endYear: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  limit: number;
}

export interface BooksState {
  items: Book[];
  selectedBook: Book | null;
  loading: boolean;
  error: string | null;
  filters: BookFilters;
  pagination: Pagination;
  genres: string[];
  authors: string[];
}

// ── Admin Insights ────────────────────────────────────────────────────────────
export interface GenreStat {
  _id: string;
  count: number;
  totalReads: number;
  avgRating: number;
}

export interface Insights {
  overview: { totalBooks: number; totalReads: number; avgReadsPerBook: string };
  mostRead: Book[];
  leastRead: Book[];
  recentlyAdded: Book[];
  perBook: { _id: string; title: string; author: string; readCount: number }[];
  genreStats: GenreStat[];
}
