import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.');
      localStorage.setItem('token', data.token); navigate('/');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><div className="auth-brand"><FaRobot /> MicroGPT</div><h1>Welcome back</h1><p>Sign in to continue your conversations.</p>{error && <div className="auth-error">{error}</div>}<label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /></label><button className="auth-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button><div className="auth-switch">New to MicroGPT? <Link to="/signup">Create an account</Link></div><Link className="auth-back" to="/">← Back to chat</Link></form></main>;
}
