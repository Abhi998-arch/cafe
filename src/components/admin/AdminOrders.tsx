import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { OrderStatus } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleStatusOverride = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Master table container */}
      <div className="glass" style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Date & Time</th>
              <th style={{ padding: '12px' }}>Total Amount</th>
              <th style={{ padding: '12px' }}>Payment</th>
              <th style={{ padding: '12px' }}>Preparation Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              return (
                <React.Fragment key={order.id}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>#{order.id}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{order.profiles?.full_name || 'Walk-in Guest'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.profiles?.email || 'guest@example.com'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                      ₹{Number(order.total_amount).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        Online • <span style={{ color: 'var(--accent-green)' }}>PAID</span>
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusOverride(order.id, e.target.value as OrderStatus)}
                        className="form-control"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          width: '130px',
                          height: '28px',
                          fontWeight: 'bold',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          borderColor: 'var(--border-color)',
                          color: order.status === 'READY' ? 'var(--accent-green)' : 'var(--text-main)'
                        }}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button
                        onClick={() => toggleExpand(order.id)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--text-muted)',
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '0.8rem'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      >
                        <span>Items</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Items Drawer Row */}
                  {isExpanded && (
                    <tr style={{ background: 'rgba(255,255,255,0.01)' }}>
                      <td colSpan={7} style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5 style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                            Order Ticket Summary
                          </h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                            {order.order_items?.map(item => (
                              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-main)' }}>
                                  {item.menu_items?.name} <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>x {item.quantity}</span>
                                </span>
                                <span style={{ color: 'var(--accent-gold)' }}>
                                  ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '4px' }}>
                              <span>Grand Total</span>
                              <span style={{ color: 'var(--accent-gold)' }}>₹{Number(order.total_amount).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No orders found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
