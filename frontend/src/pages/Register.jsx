// frontend/src/pages/Register.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <button className="btn-primary" type="submit">Create Account</button>
      </form>
      <div className="muted" style={{ textAlign: 'center' }}>Already have an account? <Link to="/login">Log In</Link></div>
    </div>
  );
}