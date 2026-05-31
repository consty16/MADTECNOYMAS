import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ADMIN_PASSWORD = 'madtecno2025'; // Respaldo o compatibilidad

export function useAdminAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión de Supabase o sesión local guardada
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session || localStorage.getItem('admin_session') === 'true');
      } catch (err) {
        console.error('Error checking supabase session:', err);
        setIsLoggedIn(localStorage.getItem('admin_session') === 'true');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios de estado en Auth de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session || localStorage.getItem('admin_session') === 'true');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_session', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out of Supabase:', err);
    }
    setIsLoggedIn(false);
    localStorage.removeItem('admin_session');
  };

  return { isLoggedIn, loading, login, logout };
}
