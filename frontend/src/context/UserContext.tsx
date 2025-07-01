// [2] CONTEXTO DE USUARIO: src/context/UserContext.tsx
// Este archivo define el contexto global de usuario para toda la app.
// Permite compartir el nombre de usuario y la función para actualizarlo entre todos los componentes.
// Es fundamental para la autenticación y el flujo de la app.

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// [2.1] Interfaz del contexto de usuario: define el shape del objeto global
interface UserContextType {
  username: string; // nombre de usuario actual
  setUsername: (name: string) => void; // función para actualizar el nombre
}

// [2.2] Crea el contexto de usuario (React Context API)
const UserContext = createContext<UserContextType | undefined>(undefined);

// [2.3] Proveedor del contexto de usuario
// Debe envolver a toda la app (en layout o _app)
export const UserProvider = ({ children }: { children: ReactNode }) => {
  
  // [2.4] Estado local para el nombre de usuario
  // Sintaxis: const [username, setUsername] = useState('');
  const [username, setUsername] = useState('');
  
  // [2.5] Provee el valor del contexto a los hijos
  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

// [2.6] Hook personalizado para consumir el contexto de usuario
export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}

// [2.7] RESUMEN DE FLUJO:
// - UserProvider debe envolver la app para que todos los componentes accedan al usuario.
// - useUser() permite leer y actualizar el nombre de usuario desde cualquier componente.
// - El estado username se comparte globalmente y se actualiza con setUsername.
// - Esencial para saber si el usuario está logueado y para identificarlo en el chat.

// Define el componente UserProvider como un proveedor de contexto de usuario
// Utiliza el hook useUser para acceder al contexto global de usuario
// Este hook debe devolver un objeto con las propiedades username y setUsername
// *username es el nombre de usuario actual
// *setUsername es una función que permite cambiar el nombre de usuario actual
// *UserProvider componente renderiza el contexto de usuario y provee el valor a los hijos
// *El componente se exporta como el componente por defecto del módulo
// *Esto permite que otros componentes importen y utilicen UserProvider fácilmente
// *El componente UserProvider es responsable de proporcionar el contexto de usuario a toda la app
// *El componente utiliza el contexto de usuario para obtener el nombre de usuario actual y la función para cambiar
// el nombre de usuario seleccionado por el usuario
// *El componente debe envolver a toda la app (en layout o _app) para que todos los componentes puedan acceder al contexto de usuario
// *El hook useUser permite a los componentes acceder al nombre de usuario actual y a la función para cambiarlo
// *Esto permite que los componentes que necesitan saber el nombre de usuario actual o cambiarlo lo hagan de manera sencilla
// *El contexto de usuario es esencial para que la app funcione correctamente
// *Permite saber si el usuario está logueado y para identificarlo en el chat
// *El componente UserProvider es fundamental para el flujo de la app,
// *ya que permite a los componentes saber quién es el usuario actual y actualizar su nombre cuando sea necesario
// *El contexto de usuario es utilizado por otros componentes como Login, ChannelList y Chat
// *para mostrar información relevante al usuario y permitirle interactuar en el chat
// *El componente UserProvider es el primer punto de contacto del usuario
// *con la app, permitiéndole ingresar su nombre y comenzar a interactuar en los canales de chat.
// *El componente utiliza el contexto de usuario para actualizar el nombre de usuario globalmente
// *lo que permite que otros componentes como ChannelList y Chat muestren el nombre del usuario
// *y lo utilicen para enviar mensajes.
