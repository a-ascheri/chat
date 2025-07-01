// [3] CONTEXTO DE CANAL: src/context/ChannelContext.tsx
// Este archivo define el contexto global de canal para toda la app.
// Permite compartir el canal seleccionado y la función para actualizarlo entre todos los componentes.
// Esencial para saber en qué canal está el usuario y para filtrar los mensajes.

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// [3.1] Interfaz del contexto de canal: define el shape del objeto global
interface ChannelContextType {
  channel: string; // canal actual seleccionado
  setChannel: (ch: string) => void; // función para actualizar el canal
}

// [3.2] Crea el contexto de canal (React Context API)
const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

// [3.3] Proveedor del contexto de canal
// Debe envolver a toda la app (en layout o _app)
export const ChannelProvider = ({ children }: { children: ReactNode }) => {
  
  // [3.4] Estado local para el canal seleccionado
  // Sintaxis: const [channel, setChannel] = useState('General');
  const [channel, setChannel] = useState('General');
  
  // [3.5] Provee el valor del contexto a los hijos
  return (
    <ChannelContext.Provider value={{ channel, setChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};

// [3.6] Hook personalizado para consumir el contexto de canal
export function useChannel() {
  const context = useContext(ChannelContext);
  if (!context) throw new Error('useChannel must be used within a ChannelProvider');
  return context;
}

// [3.7] RESUMEN DE FLUJO:
// - ChannelProvider debe envolver la app para que todos los componentes accedan al canal.
// - useChannel() permite leer y actualizar el canal seleccionado desde cualquier componente.
// - El estado channel se comparte globalmente y se actualiza con setChannel.
// - Esencial para filtrar mensajes y saber a qué canal enviar/recibir mensajes.

// Define el componente ChannelProvider como un proveedor de contexto de canal
// Utiliza el hook useChannel para acceder al contexto global de canal
// Este hook debe devolver un objeto con las propiedades channel y setChannel
// *channel es el canal actual seleccionado por el usuario
// *setChannel es una función que permite cambiar el canal actual
// *ChannelProvider componente renderiza el contexto de canal y provee el valor a los hijos
// *El componente se exporta como el componente por defecto del módulo
// *Esto permite que otros componentes importen y utilicen ChannelProvider fácilmente
// *El componente ChannelProvider es responsable de proporcionar el contexto de canal a toda la app
// *El componente utiliza el contexto de canal para obtener el canal actual y la función para 
// cambiar el canal seleccionado por el usuario
// *El componente debe envolver a toda la app (en layout o _app) para que todos los componentes 
// puedan acceder al contexto de canal
// *El hook useChannel permite a los componentes acceder al canal actual y a la función para cambiarlo
// *Esto permite que los componentes que necesitan saber el canal actual o cambiarlo lo hagan de manera sencilla
// *El contexto de canal  es esencial para que la app funcione correctamente
// *ya que permite a los componentes saber en qué canal están y enviar/recibir mensajes
// *El componente ChannelProvider es el encargado de gestionar el estado del canal actual
// *y proporcionar la funcionalidad para cambiarlo a través del contexto global
// *El componente se renderiza dentro de un div con una clase CSS para estilos
// *El componente utiliza un estado local para almacenar el canal actual
// *y una función para actualizarlo cuando el usuario selecciona un nuevo canal.

