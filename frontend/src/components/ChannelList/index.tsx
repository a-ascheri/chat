// [5] COMPONENTE ChannelList: Muestra la lista de canales y permite seleccionar uno.
// Utiliza el contexto global de canal para saber cuál está activo y para cambiarlo.
// Es fundamental para navegar entre diferentes canales de chat.

import React from 'react';
import { useChannel } from '../../context/ChannelContext';
import styles from './styles.module.scss';

// [5.1] Lista de canales disponibles (puedes agregar más si quieres)
const channels = ['General', 'Tech', 'Random'];

const ChannelList: React.FC = () => { 
  
  // [5.2] Obtiene el canal actual y la función para cambiarlo desde el contexto global
  // Sintaxis: const { channel, setChannel } = useChannel();
  const { channel, setChannel } = useChannel();
 
  // [5.3] Renderiza la lista de canales
  return (
    <div className={styles.channelListContainer}>
      <h2>Canales</h2>
      <ul>
        
        {/*// [5.4] Renderiza cada canal como un elemento de lista (li)
        // El canal actual se resalta con una clase CSS activa
        // Mapear los canales utilizando el método map, 
        // rendereando un elemento de lista (li) para cada canal */}
        {channels.map((ch, idx) => (
          <li
            // Asignar clave unica a cada elemento de lista - setchannel para cambiar canal
            key={idx} 
            className={ch === channel ? styles.active : ''}
            onClick={() => setChannel(ch)}
            style={{ cursor: 'pointer' }}
          >
            {ch}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;

// [5.5] RESUMEN DE FLUJO:
// - Muestra la lista de canales disponibles.
// - Permite al usuario seleccionar un canal (actualiza el contexto global).
// - El canal seleccionado se resalta visualmente.
// - Esencial para navegar entre diferentes conversaciones en la app.

// Define el componente ChannelList - Importa el contexto de canal
// Utiliza el hook useChannel para acceder al canal actual y la función para cambiarlo
// El hook useChannel debe devolver un objeto con las propiedades channel y setChannel
// *channel es el canal actual seleccionado por el usuario
// *setChannel es una función que permite cambiar el canal actual
// *ChannelList componente renderiza una lista de canales disponibles
// Cada canal es un elemento de lista (li) - El canal actual se resalta con una clase CSS activa
// El componente se exporta como el componente por defecto del módulo
// Esto permite que otros componentes importen y utilicen ChannelList fácilmente
// El componente ChannelList es responsable de mostrar la lista de canales disponibles
// y permitir al usuario seleccionar uno para interactuar en el chat
// El componente utiliza el contexto de canal para obtener el canal actual y la función para cambiar
// el canal seleccionado por el usuario
// Dentro del div, se renderiza un título y una lista desordenada (ul) que contiene los canales
// Cada canal es un elemento de lista (li) que muestra el nombre del canal
// El componente utiliza un estilo de cursor pointer para indicar que los elementos son interactivos
// El componente ChannelList es una parte importante de la interfaz de usuario del chat,
// ya que permite a los usuarios navegar entre diferentes canales de conversación
// y participar en discusiones específicas según sus intereses.