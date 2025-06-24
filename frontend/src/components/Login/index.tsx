'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import styles from './styles.module.scss';

const Login: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const { setUsername } = useUser();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput);
    }
  };
  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
