import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem } from '../../types';
import { Search, Plus, Minus, Info } from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const { menuItems, categories, cart, addToCart, updateCartQuantity } = useApp();
  const [search, setSearch] = useState<string>('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [selectedItemInfo, setSelectedItemInfo] = useState<MenuItem | null>(null);

  // Filter items based on selected category and search input
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategoryId === 'all' || item.category_id === activeCategoryId;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartQty = (itemId: string) => {
    const found = cart.find(item => item.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleAdjustQty = (item: MenuItem, change: number) => {
    const currentQty = getCartQty(item.id);
    if (currentQty === 0 && change > 0) {
      addToCart(item, 1);
    } else {
      updateCartQuantity(item.id, currentQty + change);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          className="form-control"
          placeholder="Search hot brews or snacks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '40px' }}
        />
        <Search 
          size={16} 
          color="var(--text-muted)" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
        />
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="category-slider">
        <div 
          onClick={() => setActiveCategoryId('all')}
          className={`category-pill ${activeCategoryId === 'all' ? 'active' : ''}`}
        >
          All Menu
        </div>
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => setActiveCategoryId(cat.id)}
            className={`category-pill ${activeCategoryId === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="product-grid">
        {filteredItems.map(item => {
          const qty = getCartQty(item.id);
          return (
            <div 
              key={item.id} 
              className="glass animate-fade-in"
              style={{ 
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                background: 'rgba(22, 22, 24, 0.45)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)', opacity: item.available ? 1 : 0.6
              }}
            >
              {/* Product Image */}
              <div style={{ height: '110px', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.1)' }}>
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Info Button Overlay */}
                <button
                  onClick={() => setSelectedItemInfo(item)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-main)'
                  }}
                  title="View description"
                >
                  <Info size={12} />
                </button>

                {!item.available && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-orange)', fontSize: '0.75rem', fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    Sold Out
                  </div>
                )}
              </div>

              {/* Product Body */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                </div>

                {/* Adjustments & Add Controls */}
                {qty > 0 ? (
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifySelf: 'flex-end',
                    background: 'var(--primary-glow)', border: '1px solid var(--primary)', 
                    borderRadius: '8px', width: '100%', height: '34px', overflow: 'hidden' 
                  }}>
                    <button 
                      onClick={() => handleAdjustQty(item, -1)}
                      style={{ flex: 1, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      {qty}
                    </span>
                    <button 
                      onClick={() => handleAdjustQty(item, 1)}
                      style={{ flex: 1, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAdjustQty(item, 1)}
                    disabled={!item.available}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '6px 0', fontSize: '0.75rem', height: '34px', borderRadius: '8px' }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          No items found matching your filter.
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedItemInfo && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 200
        }}>
          <div className="glass-premium animate-fade-in" style={{ padding: '20px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <img 
              src={selectedItemInfo.image_url} 
              alt={selectedItemInfo.name} 
              style={{ width: '100%', height: '180px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{selectedItemInfo.name}</h3>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-gold)', display: 'block', marginTop: '4px' }}>
                ₹{Number(selectedItemInfo.price).toFixed(2)}
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                {selectedItemInfo.description}
              </p>
            </div>
            <button 
              onClick={() => setSelectedItemInfo(null)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
