import React from 'react';
import { useApp } from '../../context/AppContext';
import { BellRing, LogOut, CheckCircle, Clock } from 'lucide-react';

export const CafeDashboard: React.FC = () => {
  const { orders, updateOrderStatus, logout, user } = useApp();

  // Cafe staff deals with READY orders to complete them
  const readyOrders = orders.filter(o => o.status === 'READY');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').slice(0, 5); // Show last 5 completed

  const handleCompleteOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'COMPLETED');
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-wrapper">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {/* Header */}
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 40px', borderBottom: '1px solid var(--border-color)',
          background: 'rgba(22, 22, 24, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #52B788 0%, #2a9d8f 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BellRing size={22} color="#121212" />
            </div>
            <div>
              <h1 className="serif-text" style={{ fontSize: '1.4rem' }}>Cafe Counter Dashboard</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Server: {user?.full_name || 'Cafe Counter Staff'}
              </span>
            </div>
          </div>

          <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </header>

        {/* Counter Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1.3fr', gap: '32px', padding: '32px 40px', flex: 1 }}>
          
          {/* LEFT: READY FOR PICKUP QUEUE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-green)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Ready for Pickup</h3>
              <span style={{ 
                background: 'rgba(82, 183, 136, 0.15)', color: 'var(--accent-green)', 
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
              }}>
                {readyOrders.length} Orders
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(100vh - 240px)' }}>
              {readyOrders.map(order => (
                <div 
                  key={order.id} 
                  className="glass" 
                  style={{ 
                    padding: '20px', 
                    background: 'rgba(22, 22, 24, 0.55)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Order #{order.id}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Customer: <strong style={{ color: 'var(--text-main)' }}>{order.profiles?.full_name || 'Walk-in Guest'}</strong>
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Ready: {formatDate(order.created_at)}
                    </span>
                  </div>

                  {/* Item List */}
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px' }}>
                    {order.order_items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                        <span>{item.menu_items?.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span></span>
                        <span>₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '8px' }}>
                      <span>Total Amount</span>
                      <span style={{ color: 'var(--accent-gold)' }}>₹{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Check & Verify Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Payment Method
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                        Card / Online • <span style={{ color: 'var(--accent-green)' }}>PAID</span>
                      </span>
                    </div>

                    <button 
                      onClick={() => handleCompleteOrder(order.id)}
                      className="btn btn-primary"
                      style={{ 
                        background: 'linear-gradient(135deg, #52B788 0%, #2a9d8f 100%)', 
                        boxShadow: '0 0 15px rgba(82, 183, 136, 0.25)',
                        padding: '10px 20px', fontSize: '0.85rem' 
                      }}
                    >
                      Verify & Complete Pickup
                    </button>
                  </div>

                </div>
              ))}

              {readyOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No orders waiting for pickup. Tell the kitchen to hurry up!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: RECENT PICKS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Handouts</h3>
              <Clock size={16} color="var(--text-muted)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedOrders.map(order => (
                <div 
                  key={order.id} 
                  className="glass" 
                  style={{ 
                    padding: '12px 16px', 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Order #{order.id}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Customer: {order.profiles?.full_name || 'Walk-in Guest'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                        ₹{Number(order.total_amount).toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={10} /> Completed
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {completedOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  No handouts recorded this session.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
