import React from 'react';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminMenu } from './AdminMenu';
import { AdminStaff } from './AdminStaff';
import { AdminOrders } from './AdminOrders';

interface AdminDashboardProps {
  currentAdminTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentAdminTab }) => {
  return (
    <div className="dashboard-main" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {currentAdminTab === 'analytics' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 className="serif-text" style={{ fontSize: '1.8rem', fontWeight: 600 }}>Analytics Overview</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Real-time revenue, order statistics, and menu insights.
            </p>
          </div>
          <AdminAnalytics />
        </div>
      )}

      {currentAdminTab === 'menu' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 className="serif-text" style={{ fontSize: '1.8rem', fontWeight: 600 }}>Menu Catalog Manager</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Add new beverages or snacks, toggle item availability, and update details.
            </p>
          </div>
          <AdminMenu />
        </div>
      )}

      {currentAdminTab === 'staff' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 className="serif-text" style={{ fontSize: '1.8rem', fontWeight: 600 }}>Staff Roster</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Create accounts and configure role permissions for kitchen and front desk employees.
            </p>
          </div>
          <AdminStaff />
        </div>
      )}

      {currentAdminTab === 'orders' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <h1 className="serif-text" style={{ fontSize: '1.8rem', fontWeight: 600 }}>Master Order Queue</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Audit full history of customer orders, payments, and preparation statuses.
            </p>
          </div>
          <AdminOrders />
        </div>
      )}

    </div>
  );
};
