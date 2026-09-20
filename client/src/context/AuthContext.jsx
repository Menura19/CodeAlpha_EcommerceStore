import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  // On first load, trade a stored token for the current user.
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setInitialising(false);
      return;
    }

    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setInitialising(false));
  }, []);

  const persist = ({ token, user: nextUser }) => {
    localStorage.setItem('token', token);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return persist(data);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return persist(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, setUser, initialising, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be called inside an AuthProvider.');
  return context;
}
