import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthScreen } from './components/common/AuthScreen';
import { Navbar, CustomerHeader } from './components/common/Navbar';
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerMenu } from './components/customer/CustomerMenu';
import { CustomerCart } from './components/customer/CustomerCart';
import { CustomerOrders } from './components/customer/CustomerOrders';
import { KitchenDashboard } from './components/kitchen/KitchenDashboard';
import { CafeDashboard } from './components/cafe/CafeDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DEV_FORCE_ROLE } from './context/AppContext';
import type { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user, role: _role, setMockRole, isDbConnected, loading } = useApp();
  const role = DEV_FORCE_ROLE ?? _role;
  
  // Navigation states
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('analytics');

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh', 
        alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)',
        color: 'var(--text-main)', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid rgba(212,163,115,0.15)',
          borderTopColor: 'var(--primary)', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          BREWING SELECTIONS...
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 1. AUTHENTICATION ROUTE
  if (!user) {
    return (
      <div className="mobile-wrapper-outer">
        <div className="mobile-wrapper-inner">
          <div className="phone-notch"><div className="phone-speaker" /></div>
          <div className="phone-content" style={{ justifyContent: 'center' }}>
            <AuthScreen />
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN APPLICATION SHELLS BASED ON ROLE
  return (
    <div className="app-container">
      
      {/* A. Customer App Shell (Mobile Simulation) */}
      {role === 'customer' && (
        <div className="mobile-wrapper-outer">
          <div className="mobile-wrapper-inner">
            <div className="phone-notch"><div className="phone-speaker" /></div>
            
            <div className="phone-content">
              <CustomerHeader />
              
              {currentTab === 'home' && <CustomerHome setCurrentTab={setCurrentTab} />}
              {currentTab === 'menu' && <CustomerMenu />}
              {currentTab === 'cart' && <CustomerCart setCurrentTab={setCurrentTab} />}
              {currentTab === 'orders' && <CustomerOrders />}
            </div>

            <Navbar 
              currentTab={currentTab} 
              setCurrentTab={setCurrentTab}
              currentAdminTab={currentAdminTab}
              setCurrentAdminTab={setCurrentAdminTab}
            />
          </div>
        </div>
      )}

      {/* B. Kitchen Dashboard (Wide-screen) */}
      {role === 'kitchen' && <KitchenDashboard />}

      {/* C. Cafe Front Counter (Wide-screen) */}
      {role === 'cafe' && <CafeDashboard />}

      {/* D. Admin Dashboard (Wide-screen Sidebar Layout) */}
      {role === 'admin' && (
        <div className="dashboard-wrapper">
          <Navbar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab}
            currentAdminTab={currentAdminTab}
            setCurrentAdminTab={setCurrentAdminTab}
          />
          <AdminDashboard currentAdminTab={currentAdminTab} />
        </div>
      )}

      {/* FLOATING ROLE SWITCHER WIDGET FOR EASY REVIEW AND TESTING */}
      <div className="role-switcher-widget">
        <div className="role-switcher-title">
          <span>Review Environment</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>v1.0.0</span>
        </div>
        <div className="role-switcher-grid">
          {(['customer', 'kitchen', 'cafe', 'admin'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                setMockRole(r);
                if (r === 'customer') setCurrentTab('home');
              }}
              className={`role-switcher-btn ${role === r ? 'active' : ''}`}
            >
              {r === 'customer' ? 'Customer' : r === 'kitchen' ? 'Kitchen' : r === 'cafe' ? 'Counter' : 'Admin'}
            </button>
          ))}
        </div>
        <div className="role-switcher-db">
          <span>Database Connection</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>
              {isDbConnected ? 'Supabase' : 'Local Demo'}
            </span>
            <span className={`db-indicator ${isDbConnected ? 'connected' : 'mocked'}`} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
