import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      const updated = { id: data._id, name: data.name, email: data.email, role: data.role };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    } catch { /* token invalid — interceptor handles redirect */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
