import React from 'react';
import { useApp } from '../../context/AppContext';
import type { Order, OrderStatus } from '../../types';
import { ChefHat, LogOut, Clock, Check } from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus, logout, user } = useApp();

  // Filter orders by categories suitable for kitchen
  const newOrders = orders.filter(o => o.status === 'PLACED');
  const activePreparation = orders.filter(o => o.status === 'ACCEPTED' || o.status === 'PREPARING');
  const readyOrders = orders.filter(o => o.status === 'READY');

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
  };

  const formatWaitTime = (createdAt: string) => {
    const elapsed = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(elapsed / 60000);
    if (mins < 1) return 'Just now';
    return `${mins}m ago`;
  };

  const renderOrderTicket = (order: Order) => {
    
    return (
      <div 
        key={order.id} 
        className="glass" 
        style={{ 
          padding: '16px', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Ticket Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ticket #{order.id}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              For: {order.profiles?.full_name || 'Walk-in Guest'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-orange)' }}>
            <Clock size={12} />
            <span>{formatWaitTime(order.created_at)}</span>
          </div>
        </div>

        {/* Ticket Items with interactive checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}>
          {order.order_items?.map(item => (
            <label 
              key={item.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                fontSize: '0.85rem', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <input 
                type="checkbox" 
                style={{ 
                  accentColor: 'var(--primary)', 
                  cursor: 'pointer',
                  width: '14px',
                  height: '14px'
                }} 
              />
              <span style={{ flex: 1 }}>
                {item.menu_items?.name} 
                <strong style={{ marginLeft: '4px', color: 'var(--primary)' }}>x{item.quantity}</strong>
              </span>
            </label>
          ))}
        </div>

        {/* Ticket Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {order.status === 'PLACED' && (
            <button 
              onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.8rem' }}
            >
              Accept Ticket
            </button>
          )}

          {order.status === 'ACCEPTED' && (
            <button 
              onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #E07A5F 0%, #C68B59 100%)' }}
            >
              Start Preparing
            </button>
          )}

          {order.status === 'PREPARING' && (
            <button 
              onClick={() => handleUpdateStatus(order.id, 'READY')}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #52B788 0%, #2a9d8f 100%)', boxShadow: 'none' }}
            >
              <Check size={14} /> Mark Ready
            </button>
          )}

          {order.status === 'READY' && (
            <span style={{ 
              display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', 
              fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-green)', gap: '4px',
              padding: '10px', background: 'rgba(82, 183, 136, 0.08)', borderRadius: '8px', border: '1px dashed var(--accent-green)'
            }}>
              Sent to pickup desk
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-wrapper">
      
      {/* Top Operations Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 40px', borderBottom: '1px solid var(--border-color)',
          background: 'rgba(22, 22, 24, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #E07A5F 0%, #C68B59 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ChefHat size={22} color="#121212" />
            </div>
            <div>
              <h1 className="serif-text" style={{ fontSize: '1.4rem' }}>Kitchen Operations</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Chef: {user?.full_name || 'Kitchen Staff'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Queue: <strong style={{ color: 'var(--text-main)' }}>{newOrders.length + activePreparation.length} orders</strong>
              </span>
            </div>
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Kanban Board Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', padding: '32px 40px', flex: 1 }}>
          
          {/* COLUMN 1: NEW ORDERS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-blue)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>New Tickets</h3>
              <span style={{ 
                background: 'rgba(78, 168, 222, 0.15)', color: 'var(--accent-blue)', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {newOrders.length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
              {newOrders.map(renderOrderTicket)}
              {newOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No new tickets. Enjoy the silence!
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: ACTIVE PREPARATION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--primary)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Preparing</h3>
              <span style={{ 
                background: 'var(--primary-glow)', color: 'var(--primary)', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {activePreparation.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
              {activePreparation.map(renderOrderTicket)}
              {activePreparation.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No active preparations.
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR PICKUP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-green)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Ready at Counter</h3>
              <span style={{ 
                background: 'rgba(82, 183, 136, 0.15)', color: 'var(--accent-green)', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {readyOrders.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
              {readyOrders.map(renderOrderTicket)}
              {readyOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No orders ready for pickup.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
