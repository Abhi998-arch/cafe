import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { Coffee, Shield, User, Smartphone, Key } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, isDbConnected } = useApp();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('password123'); // Default password for easier review
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password, selectedRole);
      } else {
        await register(email, fullName || 'New User', phone, password, selectedRole);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '10px 0' }}>
      <div className="glass-premium" style={{ padding: '36px 28px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        
        {/* Brand Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #E6C594 0%, #C68B59 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(212, 163, 115, 0.3)',
            marginBottom: '16px'
          }}>
            <Coffee size={30} color="#121212" />
          </div>
          <h1 className="serif-text text-gradient" style={{ fontSize: '2.2rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Café Antigravity
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Smart Ordering Experience
          </p>
        </div>

        {/* Auth Toggle Tabs */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255, 255, 255, 0.04)', 
          padding: '4px', 
          borderRadius: '10px', 
          marginBottom: '28px',
          border: '1px solid var(--border-color)' 
        }}>
          <button 
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
              background: isLogin ? 'var(--bg-surface-light-hover)' : 'transparent',
              color: isLogin ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-smooth)'
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
              background: !isLogin ? 'var(--bg-surface-light-hover)' : 'transparent',
              color: !isLogin ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-smooth)'
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {!isLogin && (
            <>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Full Name
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={14} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  className="form-control"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Email Address
            </label>
            <input 
              type="email" 
              className="form-control"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password (only if DB is connected, or always show for consistency) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={14} /> {isDbConnected ? 'Password' : 'Password (Demo)'}
            </label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selector (For demo mapping) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> Select System Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {(['customer', 'kitchen', 'cafe', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  style={{
                    padding: '10px 8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedRole === r ? 'var(--primary)' : 'var(--border-color)',
                    background: selectedRole === r ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.02)',
                    color: selectedRole === r ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {r === 'customer' ? 'Customer' : r === 'kitchen' ? 'Kitchen Staff' : r === 'cafe' ? 'Cafe Staff' : 'Admin / Owner'}
                </button>
              ))}
            </div>
            {!isDbConnected && (
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', marginTop: '4px', display: 'block' }}>
                💡 Running in Local Demo mode. Selecting a role logs you into that view directly.
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '12px' }}
          >
            {submitting ? 'Processing...' : isLogin ? 'Access App' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
