import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getErrorMessage } from '../api/client.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <form className="card form auth" onSubmit={submit}>
      <h1>Create account</h1>
      <input required placeholder="Full name" value={form.name} onChange={set('name')} />
      <input type="email" required placeholder="Email" value={form.email} onChange={set('email')} />
      <input type="password" required minLength={6} placeholder="Password (min 6 chars)"
        value={form.password} onChange={set('password')} />
      {error && <p className="error">{error}</p>}
      <button className="btn full">Register</button>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}
