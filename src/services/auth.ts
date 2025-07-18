// Utilidad para obtener el token JWT guardado
export function getToken() {
  return localStorage.getItem('jwt');
}

// Wrapper para fetch que agrega el header Authorization automáticamente
export async function fetchWithAuth(url: string, options: any = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
}
