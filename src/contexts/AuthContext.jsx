import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão atual ao carregar o app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserRole(session.user.id);
      else setLoading(false);
    });

    // Escuta mudanças (login, logout, token expirado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca se o usuário é 'admin' ou 'user' na tabela profiles
  const fetchUserRole = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('role, is_banned')
      .eq('id', userId)
      .single();
    
    if (data) {
      // SE O USUÁRIO ESTIVER BANIDO, EXPULSA ELE
      if (data.is_banned) {
        await supabase.auth.signOut();
        alert('Acesso negado: Sua conta foi suspensa pelo administrador.');
        setUser(null);
        setRole(null);
      } else {
        setRole(data.role);
      }
    }
    setLoading(false);
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, signIn, signUp, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);