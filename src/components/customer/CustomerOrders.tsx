import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Order, OrderStatus } from '../../types';
import { Calendar, Play, CheckCircle, Clock } from 'lucide-react';

export const CustomerOrders: React.FC = () => {
  const { orders, isDbConnected, simulateStatusTransition } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
  const pastOrders = orders.filter(o => o.status === 'COMPLETED');

  const statusSequence: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
  
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED': return 'Placed';
      case 'ACCEPTED': return 'Accepted';
      case 'PREPARING': return 'Preparing';
      case 'READY': return 'Ready for Pickup';
      case 'COMPLETED': return 'Completed';
    }
  };

  const handleToggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const renderOrderCard = (order: Order) => {
    const isExpanded = expandedOrderId === order.id;
    const activeIndex = statusSequence.indexOf(order.status);
    const dateStr = new Date(order.created_at).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
      <div 
        key={order.id} 
        className="glass animate-fade-in"
        style={{
          padding: '16px',
          background: 'rgba(22, 22, 24, 0.45)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div 
          onClick={() => handleToggleExpand(order.id)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Order #{order.id}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
              <Calendar size={12} />
              <span>{dateStr}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
              ₹{Number(order.total_amount).toFixed(2)}
            </span>
            <span className={`badge badge-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* EXPANDED DETAILS */}
        {isExpanded && (
          <div style={{ 
            marginTop: '8px', 
            paddingTop: '16px', 
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            
            {/* Real-time status line */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
              <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preparation Timeline
              </h5>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
                
                {/* Timeline connector bar */}
                <div style={{
                  position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px',
                  background: 'rgba(255,255,255,0.06)'
                }} />

                <div style={{
                  position: 'absolute', left: '7px', top: '8px', width: '2px',
                  height: `${(activeIndex / (statusSequence.length - 1)) * 100}%`,
                  background: order.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)',
                  boxShadow: `0 0 10px ${order.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)'}`,
                  transition: 'height 0.3s ease'
                }} />

                {statusSequence.map((st, i) => {
                  const isCurrent = i === activeIndex;
                  const isDone = i <= activeIndex;
                  
                  return (
                    <div key={st} style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: isDone ? 1 : 0.4 }}>
                      
                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute', left: '2px',
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: isCurrent 
                          ? order.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)' 
                          : isDone ? 'var(--text-main)' : 'rgba(255,255,255,0.1)',
                        border: isCurrent ? '2px solid var(--bg-base)' : 'none',
                        boxShadow: isCurrent 
                          ? `0 0 12px ${order.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)'}` 
                          : 'none',
                        transition: 'var(--transition-smooth)'
                      }} />

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: isCurrent ? 'bold' : 500,
                          color: isCurrent 
                            ? order.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)' 
                            : 'var(--text-main)'
                        }}>
                          {getStatusLabel(st)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Items Ordered
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {order.order_items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-main)', flex: 1 }}>
                      {item.menu_items?.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                    </span>
                    <span style={{ color: 'var(--accent-gold)' }}>
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Simulation Controls */}
            {!isDbConnected && order.status !== 'COMPLETED' && (
              <div style={{ 
                background: 'rgba(212,163,115,0.05)', border: '1px solid rgba(212,163,115,0.15)',
                padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>
                  ⚙️ Demo Tool: Simulate Order States
                </span>
                <button
                  onClick={() => simulateStatusTransition(order.id)}
                  className="btn btn-secondary"
                  style={{ padding: '6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Play size={12} /> Advance to Next Stage
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Active Orders List */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} color="var(--primary)" /> Active Orders
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeOrders.map(renderOrderCard)}
          {activeOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
              No active orders right now.
            </div>
          )}
        </div>
      </div>

      {/* Past Orders List */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={16} color="var(--accent-green)" /> Past Orders
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pastOrders.map(renderOrderCard)}
          {pastOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
              Your order history is empty.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
