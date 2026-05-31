import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@madtecno.com',
        password: password,
      });

      if (error) {
        setError('❌ Contraseña incorrecta');
        setPassword('');
      } else {
        localStorage.setItem('adminAuth', 'true');
        onLogin();
      }
    } catch (err: any) {
      setError('❌ Error al conectar con Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000e23] to-[#0c1a30] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Lock className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-primary mb-2">
            MAD TECNO
          </h1>
          <p className="text-on-surface-variant">Panel de Administración</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-highest border border-primary/20 rounded-2xl p-8 space-y-6 backdrop-blur-sm"
        >
          <div>
            <label className="block text-primary font-bold mb-2">
              Contraseña de Administrador
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                disabled={loading}
                className="w-full px-4 py-3 bg-surface-container border border-primary/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Lock size={20} />
                Acceder
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-on-surface-variant text-xs">
            Acceso restringido solo para administradores
          </p>
        </form>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-primary/40 text-sm">
            <div className="w-8 h-px bg-primary/40" />
            <span>🔒 ÁREA SEGURA</span>
            <div className="w-8 h-px bg-primary/40" />
          </div>
        </div>
      </div>
    </div>
  );
};