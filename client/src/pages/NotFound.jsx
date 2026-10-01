import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty">
      <h1>404</h1>
      <p className="muted">This page does not exist.</p>
      <Link to="/" className="btn">Go home</Link>
    </section>
  );
}
