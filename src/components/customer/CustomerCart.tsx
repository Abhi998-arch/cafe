import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, DollarSign, Smartphone } from 'lucide-react';

interface CustomerCartProps {
  setCurrentTab: (tab: string) => void;
}

export const CustomerCart: React.FC<CustomerCartProps> = ({ setCurrentTab }) => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, checkout } = useApp();
  const [payMethod, setPayMethod] = useState<'card' | 'cash' | 'upi'>('card');
  const [placing, setPlacing] = useState<boolean>(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const subTotal = getCartTotal();
  const tax = subTotal * 0.08;
  const finalTotal = subTotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const orderId = await checkout(payMethod);
      if (orderId) {
        setSuccessOrderId(orderId);
      }
    } finally {
      setPlacing(false);
    }
  };

  // SUCCESS CHECKOUT VIEW
  if (successOrderId) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '20px', paddingTop: '40px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(82, 183, 136, 0.15)', border: '2px solid var(--accent-green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(82, 183, 136, 0.2)',
          color: 'var(--accent-green)'
        }}>
          <ShoppingBag size={34} />
        </div>
        <div>
          <h2 className="serif-text" style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Order Placed!</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Order #{successOrderId} has been sent to the kitchen.
          </p>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: '1.4' }}>
          Your payment was processed and the kitchen staff are preparing your fresh brew. Track status in real time.
        </p>
        <button 
          onClick={() => {
            setSuccessOrderId(null);
            setCurrentTab('orders');
          }}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px' }}
        >
          Track Live Status
        </button>
      </div>
    );
  }

  // EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: '16px', paddingTop: '80px' }}>
        <ShoppingBag size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Your Cart is Empty</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Browse our catalog to add coffee, desserts, or snacks!
          </p>
        </div>
        <button 
          onClick={() => setCurrentTab('menu')}
          className="btn btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      {/* Scrollable Cart Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
        {cart.map(item => (
          <div 
            key={item.menuItem.id} 
            className="glass" 
            style={{ 
              display: 'flex', padding: '10px', gap: '12px', alignItems: 'center',
              background: 'rgba(22, 22, 24, 0.45)', border: '1px solid var(--border-color)' 
            }}
          >
            <img 
              src={item.menuItem.image_url} 
              alt={item.menuItem.name} 
              style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }}
            />
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.menuItem.name}
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>
                ₹{Number(item.menuItem.price).toFixed(2)}
              </span>
            </div>

            {/* Adjusters */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <button 
                onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center' }}
              >
                <Minus size={10} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>
                {item.quantity}
              </span>
              <button 
                onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px 8px', display: 'flex', alignItems: 'center' }}
              >
                <Plus size={10} />
              </button>
            </div>

            {/* Trash button */}
            <button 
              onClick={() => removeFromCart(item.menuItem.id)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-orange)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Bill summary */}
      <div className="glass" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Payment Summary
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>₹{subTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
            <span>Service Tax & VAT (8%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--accent-gold)' }}>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Select Payment Method
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['card', 'cash', 'upi'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setPayMethod(mode)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: '0.75rem', fontWeight: 600,
                borderRadius: '8px', border: '1px solid',
                borderColor: payMethod === mode ? 'var(--primary)' : 'var(--border-color)',
                background: payMethod === mode ? 'var(--primary-glow)' : 'transparent',
                color: payMethod === mode ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                transition: 'var(--transition-smooth)'
              }}
            >
              {mode === 'card' && <CreditCard size={14} />}
              {mode === 'cash' && <DollarSign size={14} />}
              {mode === 'upi' && <Smartphone size={14} />}
              <span style={{ textTransform: 'uppercase' }}>{mode}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Place Order button */}
      <button 
        onClick={handleCheckout}
        disabled={placing}
        className="btn btn-primary"
        style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
      >
        {placing ? 'Placing Order...' : `Place Order • ₹${finalTotal.toFixed(2)}`}
      </button>

    </div>
  );
};
