// frontend/src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Readify Books Store</div>
      <div className="muted"> Library Bookstore</div>
    </footer>
  );
}
