// [4] COMPONENTE Login: Permite al usuario ingresar su nombre y autenticarse en la app.
// Se muestra cuando el usuario no está logueado. Al loguearse, se actualiza el contexto 
// global de usuario.

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import styles from './styles.module.scss';

const Login: React.FC = () => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  
  const { setUsername } = useUser();

  // Usar rutas relativas que serán manejadas por el proxy de Next.js
  useEffect(() => {
    // Siempre usar la ruta relativa
    const authUrl = '/api/auth/login';
    console.log('Using relative URL with Next.js proxy:', authUrl);
    setApiUrl(authUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Usar la URL configurada en el estado
      console.log('Attempting login with URL:', apiUrl);
      console.log('Username:', usernameInput.trim());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameInput.trim() }),
        // Importante para CORS
        credentials: 'include',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      if (data.token) {
        // Guardar token y datos de usuario en localStorage
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('sessionId', data.sessionId);
        
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        
        console.log('Login successful, storing credentials:', {
          username: data.username,
          sessionId: data.sessionId,
          userId: data.userId || 'not provided'
        });
        
        // Actualizar contexto
        setUsername(data.username);
      } else {
        throw new Error('No se recibió token del servidor');
      }
      
    } catch (err) {
      if (err instanceof Error) {
        console.error('Login error:', err);
        setError(err.message || 'Error al conectar con el servidor');
      } else {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  // [4.4] Renderiza el formulario de login
  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;

// [4.5] RESUMEN DE FLUJO:
// - Se muestra solo si el usuario no está logueado.
// - Al enviar el formulario, actualiza el contexto global de usuario.
// - Esto hace que la app muestre la lista de canales y el chat.

// En resumen, el componente Login es responsable de permitir que el usuario ingrese su nombre 
// de usuario para autenticarse en la aplicación. Utiliza el contexto de usuario para actualizar 
// el estado global cuando el usuario envía su nombre. 
// El formulario se renderiza con un input y un botón, y al enviar, se actualiza el contexto 
// global de usuario, lo que permite que otros componentes como ChannelList y Chat se muestren 
// correctamente.
// El componente Login es esencial para iniciar el flujo de la aplicación, ya que permite al
// usuario autenticarse y acceder a las funcionalidades del chat. Sin este componente, la app 
// no podría identificar al usuario ni mostrar los canales y mensajes correspondientes.
// El componente utiliza el contexto de usuario para actualizar el nombre de usuario globalmente,
// lo que permite que otros componentes como ChannelList y Chat accedan a esta información y 
// muestren el nombre del usuario en el chat. Además, el componente Login es el primer punto de 
// contacto del usuario con la aplicación, permitiéndole ingresar su nombre y comenzar a 
// interactuar en los canales de chat. Es fundamental para el flujo de la aplicación, 
// ya que sin un usuario autenticado.
// El componente Login es el primer punto de contacto del usuario con la aplicación,
// permitiéndole ingresar su nombre y comenzar a interactuar en los canales de chat.
// Es fundamental para el flujo de la aplicación, ya que sin un usuario autenticado,
// no se pueden mostrar los canales ni enviar mensajes. Además, el componente Login.
