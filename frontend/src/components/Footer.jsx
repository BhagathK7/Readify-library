// frontend/src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Readify</div>
      <div className="muted">A minimal digital library & bookstore</div>
    </footer>
  );
}
