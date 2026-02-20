import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => { setEmail('admin@bookhub.com'); setPassword('admin123'); };
  const fillReader = () => { setEmail('reader@bookhub.com'); setPassword('reader123'); };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">📚</div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Book Hub account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required placeholder="••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">Quick access</div>
        <div className="demo-btns">
          <button onClick={fillAdmin} className="btn btn-outline btn-sm">Fill Admin</button>
          <button onClick={fillReader} className="btn btn-outline btn-sm">Fill Reader</button>
        </div>

        <p className="auth-switch">
          No account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
