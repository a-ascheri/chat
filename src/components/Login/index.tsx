import React, { useState } from 'react';

const API_URL = (import.meta as any).env.VITE_API_URL + '/api/auth/login' || 'http://localhost:8080/api/auth/login';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!res.ok) throw new Error('Login inválido');
      const data = await res.json();
      localStorage.setItem('jwt', data.token);
      onLogin && onLogin(data.token, username);
    } catch (err) {
      setError('Usuario inválido o error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: 'auto', padding: 24 }}>
      <h2>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 8 }}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </form>
  );
}
