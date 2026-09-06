import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, Coffee, ShoppingBag, ClipboardList, LogOut, 
  BarChart3, Users, Settings, Grid3X3
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentAdminTab: string;
  setCurrentAdminTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentAdminTab,
  setCurrentAdminTab
}) => {
  const { user, role, logout, cart, orders } = useApp();

  const cartCount = cart.reduce((tot, item) => tot + item.quantity, 0);
  const activeOrdersCount = orders.filter(
    o => o.status !== 'COMPLETED'
  ).length;

  // CUSTOMER BOTTOM NAVIGATION BAR
  if (role === 'customer') {
    return (
      <div className="mobile-nav">
        <div 
          className={`mobile-nav-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </div>

        <div 
          className={`mobile-nav-item ${currentTab === 'menu' ? 'active' : ''}`}
          onClick={() => setCurrentTab('menu')}
        >
          <Coffee size={20} />
          <span>Menu</span>
        </div>

        <div 
          className={`mobile-nav-item ${currentTab === 'cart' ? 'active' : ''}`}
          onClick={() => setCurrentTab('cart')}
          style={{ position: 'relative' }}
        >
          <ShoppingBag size={20} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '4px', right: '14px',
              background: 'var(--accent-orange)', color: 'white',
              fontSize: '0.65rem', fontWeight: 'bold', minWidth: '16px', height: '16px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2px', border: '1px solid var(--bg-base)'
            }}>
              {cartCount}
            </span>
          )}
        </div>

        <div 
          className={`mobile-nav-item ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => setCurrentTab('orders')}
          style={{ position: 'relative' }}
        >
          <ClipboardList size={20} />
          <span>Orders</span>
          {activeOrdersCount > 0 && (
            <span style={{
              position: 'absolute', top: '4px', right: '12px',
              background: 'var(--primary)', color: 'var(--text-dark)',
              fontSize: '0.65rem', fontWeight: 'bold', minWidth: '16px', height: '16px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2px', border: '1px solid var(--bg-base)',
              boxShadow: '0 0 8px var(--primary)'
            }}>
              {activeOrdersCount}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ADMIN SIDEBAR NAVIGATION
  if (role === 'admin') {
    return (
      <div className="dashboard-sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #E6C594 0%, #C68B59 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Settings size={20} color="#121212" />
          </div>
          <div>
            <h2 className="serif-text" style={{ fontSize: '1.2rem', fontWeight: 600 }}>Café Admin</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Management</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <button
            type="button"
            onClick={() => setCurrentAdminTab('analytics')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '12px 16px', border: 'none', borderRadius: '8px',
              background: currentAdminTab === 'analytics' ? 'var(--primary)' : 'transparent',
              color: currentAdminTab === 'analytics' ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              transition: 'var(--transition-smooth)'
            }}
          >
            <BarChart3 size={18} />
            Analytics
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('menu')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '12px 16px', border: 'none', borderRadius: '8px',
              background: currentAdminTab === 'menu' ? 'var(--primary)' : 'transparent',
              color: currentAdminTab === 'menu' ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Grid3X3 size={18} />
            Menu Catalog
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('staff')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '12px 16px', border: 'none', borderRadius: '8px',
              background: currentAdminTab === 'staff' ? 'var(--primary)' : 'transparent',
              color: currentAdminTab === 'staff' ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Users size={18} />
            Staff Accounts
          </button>

          <button
            type="button"
            onClick={() => setCurrentAdminTab('orders')}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '12px 16px', border: 'none', borderRadius: '8px',
              background: currentAdminTab === 'orders' ? 'var(--primary)' : 'transparent',
              color: currentAdminTab === 'orders' ? 'var(--text-dark)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
              transition: 'var(--transition-smooth)'
            }}
          >
            <ClipboardList size={18} />
            Order Queue
          </button>
        </div>

        {/* Footer Profile & Logout */}
        <div style={{ 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {user?.full_name || 'Administrator'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.email || 'admin@cafe.com'}
            </span>
          </div>
          
          <button
            type="button"
            onClick={logout}
            className="btn btn-danger"
            style={{ padding: '10px', fontSize: '0.85rem', width: '100%' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // STAFF DASHBOARD HEADERS (Kitchen, Cafe)
  return null; // Will render headers in individual dashboards to support full-width visual layout
};

// CUSTOM HEADER FOR CUSTOMERS
export const CustomerHeader: React.FC = () => {
  const { user, logout } = useApp();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'var(--primary-glow)', border: '1px solid var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {(user?.full_name || 'C').charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Welcome back,</span>
          <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {user?.full_name || 'Valued Guest'}
          </span>
        </div>
      </div>

      <button
        onClick={logout}
        style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px', borderRadius: '8px', transition: 'var(--transition-smooth)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-orange)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
};
