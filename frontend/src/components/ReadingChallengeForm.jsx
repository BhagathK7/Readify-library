// frontend/src/components/ReadingChallengeForm.jsx

import React, { useState } from 'react';
import { fetchJSON } from '../utils/api';

export default function ReadingChallengeForm({ onClose, onChallengeAdded }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState('books');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // The backend route is /api/auth/challenges, not /api/challenges
      await fetchJSON('/auth/challenges', {
        method: 'POST',
        body: JSON.stringify({ title, target, unit })
      });
      alert('Challenge added successfully!');
      onChallengeAdded();
      onClose();
    } catch (e) {
      alert('Failed to add challenge: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="challenge-form-modal">
      <div className="modal-content">
        <h3>Set a New Challenge</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Challenge Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., 'My 2025 Reading Goal'"
              required
            />
          </div>
          <div className="form-group">
            <label>Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="books">Books</option>
              <option value="pages">Pages</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Challenge'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}