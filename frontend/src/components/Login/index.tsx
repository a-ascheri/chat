// [4] COMPONENTE Login: Permite al usuario ingresar su nombre y autenticarse en la app.
// Se muestra cuando el usuario no está logueado. Al loguearse, se actualiza el contexto 
// global de usuario.

'use client';

import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import styles from './styles.module.scss';

const Login: React.FC = () => {
  
  // [4.1] Estado local para el input del nombre de usuario
  // Sintaxis: const [usernameInput, setUsernameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  
  // [4.2] Obtiene la función setUsername del contexto global de usuario
  const { setUsername } = useUser();

  // [4.3] Maneja el submit del formulario de login
  // Si el input no está vacío, actualiza el contexto global de usuario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setUsername(usernameInput);
    }
  };

  // [4.4] Renderiza el formulario de login
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
