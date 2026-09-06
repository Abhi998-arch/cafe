import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { orders, getAnalytics } = useApp();
  const data = getAnalytics();

  const activeOrdersCount = orders.filter(o => o.status !== 'COMPLETED').length;
  const avgTicket = data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders) : 0;

  // Find max value in trends to scale SVG height
  const maxSalesVal = Math.max(...data.salesTrends.map(t => t.amount), 50);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        
        {/* Metric 1 */}
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'var(--primary-glow)', border: '1px solid var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
          }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Orders
            </span>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              {data.totalOrders}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'rgba(82, 183, 136, 0.15)', border: '1px solid var(--accent-green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-green)'
          }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Net Revenue
            </span>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              ₹{data.totalRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'rgba(78, 168, 222, 0.15)', border: '1px solid var(--accent-blue)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)'
          }}>
            <CreditCard size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Avg. Ticket
            </span>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              ₹{avgTicket.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'rgba(224, 122, 95, 0.15)', border: '1px solid var(--accent-orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-orange)'
          }}>
            <Users size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Queue
            </span>
            <span style={{ display: 'block', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
              {activeOrdersCount}
            </span>
          </div>
        </div>

      </div>

      {/* Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '24px' }}>
        
        {/* Sales Trend Chart */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Revenue Trend</h3>
          
          {/* Custom SVG Bar Chart */}
          <div style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            {data.salesTrends.map((trend) => {
              const heightPercent = `${(trend.amount / maxSalesVal) * 80 + 10}%`; // scale between 10% and 90%
              return (
                <div 
                  key={trend.date} 
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', 
                    height: '100%', justifyContent: 'flex-end', position: 'relative'
                  }}
                >
                  {/* Tooltip on hover */}
                  <span style={{
                    position: 'absolute', bottom: `calc(${heightPercent} + 12px)`, 
                    background: 'var(--bg-surface-solid)', padding: '4px 8px', borderRadius: '4px',
                    fontSize: '0.7rem', color: 'var(--text-main)', border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)', opacity: 0.9, transition: 'var(--transition-smooth)'
                  }}>
                    ${trend.amount.toFixed(0)}
                  </span>

                  {/* Visual Bar */}
                  <div style={{
                    width: '32px', height: heightPercent,
                    background: 'linear-gradient(180deg, var(--primary) 0%, rgba(212,163,115,0.1) 100%)',
                    borderRadius: '6px 6px 0 0',
                    border: '1px solid rgba(212,163,115,0.3)',
                    boxShadow: '0 0 10px rgba(212,163,115,0.05)',
                    transition: 'var(--transition-bounce)'
                  }} />

                  {/* Label */}
                  <span style={{
                    position: 'absolute', bottom: '-20px', fontSize: '0.75rem', color: 'var(--text-muted)'
                  }}>
                    {trend.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular items catalog */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Top Selling Items</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.popularItems.map((item, idx) => (
              <div 
                key={item.name} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px',
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)',
                  borderRadius: '12px'
                }}
              >
                {/* Ranking index circle */}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: idx === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: idx === 0 ? 'var(--text-dark)' : 'var(--text-muted)',
                  fontSize: '0.75rem', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {idx + 1}
                </div>
                
                <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>
                  {item.name}
                </span>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ordered: <strong style={{ color: 'var(--primary)' }}>{item.count} times</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
