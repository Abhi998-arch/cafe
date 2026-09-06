import React from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem } from '../../types';
import { Award, ShoppingCart, TrendingUp, Compass } from 'lucide-react';

interface CustomerHomeProps {
  setCurrentTab: (tab: string) => void;
}

export const CustomerHome: React.FC<CustomerHomeProps> = ({ setCurrentTab }) => {
  const { categories, menuItems, orders, addToCart } = useApp();

  // Find active orders (not completed yet)
  const activeOrders = orders.filter(o => o.status !== 'COMPLETED');
  const latestActiveOrder = activeOrders.length > 0 ? activeOrders[0] : null;

  // Get recommended items (mock simple selector: choose items that are available)
  const recommendedItems = menuItems.filter(item => item.available).slice(0, 3);
  const featuredItem = menuItems.find(item => item.name === 'Caramel Macchiato') || menuItems[0];

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Active Order Tracker Widget */}
      {latestActiveOrder && (
        <div 
          onClick={() => setCurrentTab('orders')}
          className="glass-premium"
          style={{
            padding: '16px 20px',
            border: '1px solid var(--primary)',
            boxShadow: '0 0 15px var(--primary-glow)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(212,163,115,0.12) 0%, rgba(22,22,24,0.7) 100%)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
              🔴 Live Order Tracking
            </span>
            <span className={`badge badge-${latestActiveOrder.status.toLowerCase()}`}>
              {latestActiveOrder.status}
            </span>
          </div>
          
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>
            Order ID: #{latestActiveOrder.id}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {latestActiveOrder.status === 'PLACED' && 'Waiting for kitchen approval...'}
            {latestActiveOrder.status === 'ACCEPTED' && 'Kitchen accepted your order.'}
            {latestActiveOrder.status === 'PREPARING' && 'Chef is brewing your selections.'}
            {latestActiveOrder.status === 'READY' && 'Your order is hot & ready for pickup!'}
          </p>

          {/* Mini progress line */}
          <div style={{ display: 'flex', gap: '4px', height: '4px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            {['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'].map((st, i) => {
              const statusSequence = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
              const activeIndex = statusSequence.indexOf(latestActiveOrder.status);
              const filled = i <= activeIndex;
              return (
                <div 
                  key={st}
                  style={{
                    flex: 1,
                    height: '100%',
                    background: filled 
                      ? latestActiveOrder.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)' 
                      : 'transparent',
                    boxShadow: filled && i === activeIndex 
                      ? `0 0 8px ${latestActiveOrder.status === 'READY' ? 'var(--accent-green)' : 'var(--primary)'}` 
                      : 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Hero Featured Card */}
      {featuredItem && (
        <div className="glass" style={{ position: 'relative', height: '170px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <img 
            src={featuredItem.image_url} 
            alt={featuredItem.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }}
          />
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Popular Item
                </span>
              </div>
              <h2 className="serif-text" style={{ fontSize: '1.4rem', color: 'var(--text-main)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {featuredItem.name}
              </h2>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                ₹{Number(featuredItem.price).toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={() => handleQuickAdd(featuredItem)}
              className="btn btn-primary btn-icon"
              style={{ borderRadius: '50%', width: '42px', height: '42px' }}
              title="Add to cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Categories Horizontal Selector */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={16} color="var(--primary)" /> Browse Categories
          </h3>
          <span 
            onClick={() => setCurrentTab('menu')}
            style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            See All
          </span>
        </div>

        <div className="category-slider">
          {categories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => setCurrentTab('menu')}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', 
                flexShrink: 0, cursor: 'pointer'
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px', overflow: 'hidden',
                border: '1px solid var(--border-color)', position: 'relative'
              }}>
                <img 
                  src={cat.image_url} 
                  alt={cat.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)'
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chef Recommendations List */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={16} color="var(--primary)" /> Specially Brewed For You
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendedItems.map(item => (
            <div 
              key={item.id} 
              className="glass" 
              style={{ 
                display: 'flex', padding: '10px', gap: '12px', alignItems: 'center',
                background: 'rgba(22, 22, 24, 0.45)', border: '1px solid var(--border-color)' 
              }}
            >
              <img 
                src={item.image_url} 
                alt={item.name} 
                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  ₹{Number(item.price).toFixed(2)}
                </span>
              </div>

              <button 
                onClick={() => handleQuickAdd(item)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
