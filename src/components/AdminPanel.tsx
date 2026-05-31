import React, { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { AdminOrders } from './AdminOrders';
import { AdminProductos } from './AdminProductos';
import { AdminShippingInfo } from './AdminShippingInfo';
import { AdminShippingRates } from './AdminShippingRates';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'productos' | 'shipping-info' | 'shipping-rates'>('orders');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out from Supabase:', err);
    }
    localStorage.removeItem('adminAuth');
    onLogout();
  };

  const sections = [
    { id: 'orders' as const, label: '📦 Órdenes', icon: '📦' },
    { id: 'productos' as const, label: '🛍️ Productos', icon: '🛍️' },
    { id: 'shipping-info' as const, label: '🚚 Info Envío', icon: '🚚' },
    { id: 'shipping-rates' as const, label: '💰 Tarifas Envío', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000e23] to-[#0c1a30]">
      {/* Header */}
      <header className="sticky top-0 bg-surface-container-highest/95 backdrop-blur border-b border-primary/20 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-black text-primary">🔧 ADMIN</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static left-0 top-16 lg:top-0 h-[calc(100vh-64px)] lg:h-screen w-64 bg-surface-container border-r border-primary/20 transition-transform duration-300 z-30 overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-on-primary shadow-[0_0_20px_rgba(86,241,224,0.3)]'
                    : 'text-on-surface hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {activeSection === 'orders' && <AdminOrders />}
            {activeSection === 'productos' && <AdminProductos />}
            {activeSection === 'shipping-info' && <AdminShippingInfo />}
            {activeSection === 'shipping-rates' && <AdminShippingRates />}
          </div>
        </main>
      </div>
    </div>
  );
};