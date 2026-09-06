import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { MenuItem } from '../../types';
import { Plus, ToggleLeft, ToggleRight, Edit2, Trash2, X } from 'lucide-react';

export const AdminMenu: React.FC = () => {
  const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  
  // Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(3.99);
  const [categoryId, setCategoryId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500'); // default unsplash coffee

  // Initialize category
  React.useEffect(() => {
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !categoryId) return;

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name,
        description,
        price,
        category_id: categoryId,
        image_url: imageUrl
      };
      const ok = await updateMenuItem(updated);
      if (ok) {
        setEditingItem(null);
        setShowAddForm(false);
        clearForm();
      }
    } else {
      const ok = await addMenuItem({
        name,
        description,
        price,
        category_id: categoryId,
        image_url: imageUrl,
        available: true
      });
      if (ok) {
        setShowAddForm(false);
        clearForm();
      }
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setPrice(3.99);
    setImageUrl('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(Number(item.price));
    setCategoryId(item.category_id);
    setImageUrl(item.image_url);
    setShowAddForm(true);
  };

  const handleToggleAvailable = async (item: MenuItem) => {
    await updateMenuItem({
      ...item,
      available: !item.available
    });
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      await deleteMenuItem(itemId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!showAddForm && (
          <button 
            onClick={() => { setShowAddForm(true); setEditingItem(null); clearForm(); }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Add New Menu Item
          </button>
        )}
      </div>

      {/* Insert / Edit Form Modal-Overlay */}
      {showAddForm && (
        <div className="glass" style={{ padding: '24px', background: 'rgba(22, 22, 24, 0.95)', border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="serif-text" style={{ fontSize: '1.2rem' }}>
              {editingItem ? `Edit: ${editingItem.name}` : 'Add New Menu Item'}
            </h3>
            <button 
              onClick={() => { setShowAddForm(false); setEditingItem(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Item Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Vanilla Latte"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select 
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ background: 'var(--bg-surface-solid)', cursor: 'pointer' }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image URL (Unsplash or Assets)</label>
                <input 
                  type="url" 
                  className="form-control"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  placeholder="Brewed with freshly ground espresso beans..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'none', height: '100px' }}
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                type="button" 
                onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Catalog Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {menuItems.map(item => {
          const cat = categories.find(c => c.id === item.category_id);
          return (
            <div 
              key={item.id} 
              className="glass" 
              style={{ 
                overflow: 'hidden', 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-color)',
                opacity: item.available ? 1 : 0.65 
              }}
            >
              {/* Product Visual */}
              <div style={{ height: '140px', position: 'relative' }}>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Category badge */}
                <span style={{
                  position: 'absolute', top: '10px', left: '10px',
                  background: 'var(--bg-surface-solid)', color: 'var(--text-main)',
                  padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold'
                }}>
                  {cat?.name || 'Beverage'}
                </span>
              </div>

              {/* Product Body */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.name}</h4>
                  <span style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--accent-gold)', display: 'block', marginTop: '2px' }}>
                    ₹{Number(item.price).toFixed(2)}
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                  </p>
                </div>

                {/* Available switch & controls */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }} onClick={() => handleToggleAvailable(item)}>
                    {item.available ? (
                      <ToggleRight size={24} color="var(--accent-green)" />
                    ) : (
                      <ToggleLeft size={24} color="var(--text-muted)" />
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => handleStartEdit(item)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '6px'
                      }}
                      title="Edit Item"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer', padding: '6px'
                      }}
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
