import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { UserPlus, Smartphone, Mail, Trash2 } from 'lucide-react';

interface MockStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

const SEED_STAFF: MockStaffMember[] = [
  { id: 'st-1', name: 'Chef Marco', email: 'marco@cafe.com', phone: '+1 (555) 012-3456', role: 'kitchen' },
  { id: 'st-2', name: 'Sarah Jenkins', email: 'sarah@cafe.com', phone: '+1 (555) 019-8765', role: 'cafe' },
  { id: 'st-3', name: 'David Miller', email: 'david@cafe.com', phone: '+1 (555) 014-9988', role: 'admin' },
];

export const AdminStaff: React.FC = () => {
  const { createStaffAccount } = useApp();
  const [staffList, setStaffList] = useState<MockStaffMember[]>(() => {
    const cached = localStorage.getItem('cafe_staff');
    return cached ? JSON.parse(cached) : SEED_STAFF;
  });

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [staffRole, setStaffRole] = useState<UserRole>('kitchen');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    // Trigger backend creation (or fallback simulated logic)
    await createStaffAccount(fullName, email, phone, staffRole);

    const newMember: MockStaffMember = {
      id: `st-${Math.random().toString(36).substr(2, 9)}`,
      name: fullName,
      email,
      phone,
      role: staffRole
    };

    const nextStaff = [...staffList, newMember];
    setStaffList(nextStaff);
    localStorage.setItem('cafe_staff', JSON.stringify(nextStaff));
    
    // Clear and hide form
    setFullName('');
    setEmail('');
    setPhone('');
    setStaffRole('kitchen');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this staff account?")) {
      const nextStaff = staffList.filter(s => s.id !== id);
      setStaffList(nextStaff);
      localStorage.setItem('cafe_staff', JSON.stringify(nextStaff));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UserPlus size={16} /> Create Staff Account
          </button>
        )}
      </div>

      {/* Add Staff Form */}
      {showAddForm && (
        <div className="glass animate-fade-in" style={{ padding: '24px', background: 'rgba(22, 22, 24, 0.95)', border: '1px solid var(--primary)' }}>
          <h3 className="serif-text" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            New Employee Onboarding
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Sarah Jenkins"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="sarah@cafe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-control"
                placeholder="+1 (555) 012-3456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Permissions Role</label>
              <select 
                className="form-control"
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value as UserRole)}
                style={{ background: 'var(--bg-surface-solid)', cursor: 'pointer' }}
              >
                <option value="kitchen">Kitchen Staff (Kitchen Chef)</option>
                <option value="cafe">Cafe Counter Staff (Server)</option>
                <option value="admin">Administrator / Co-Owner</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Onboard Employee
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff list roster table */}
      <div className="glass" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Staff Name</th>
              <th style={{ padding: '12px 16px' }}>Role</th>
              <th style={{ padding: '12px 16px' }}>Email</th>
              <th style={{ padding: '12px 16px' }}>Contact Phone</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{member.name}</td>
                <td style={{ padding: '16px' }}>
                  <span className={`badge badge-${member.role === 'kitchen' ? 'preparing' : member.role === 'cafe' ? 'ready' : 'accepted'}`}>
                    {member.role === 'kitchen' ? 'Kitchen Chef' : member.role === 'cafe' ? 'Front Counter' : 'Administrator'}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} />
                    <span>{member.email}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                  {member.phone ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Smartphone size={12} />
                      <span>{member.phone}</span>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(member.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer', padding: '6px' }}
                    title="Delete Staff Account"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
