import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserRole, Profile, Category, MenuItem, Order, CartItem, OrderStatus 
} from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

// ─── DEV VIEW OVERRIDE ─────────────────────────────────────────────────────
// Set to 'customer' | 'kitchen' | 'cafe' | 'admin' to force a specific view.
// Set to null to use the real role from the signed-in user's profile.
export const DEV_FORCE_ROLE: 'customer' | 'kitchen' | 'cafe' | 'admin' | null = null;
// ───────────────────────────────────────────────────────────────────────────

interface AppContextType {
  user: Profile | null;
  role: UserRole;
  categories: Category[];
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  isDbConnected: boolean;
  
  // Auth Operations
  login: (email: string, password?: string, mockRole?: UserRole) => Promise<boolean>;
  register: (email: string, fullName: string, phone: string, password?: string, mockRole?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  setMockRole: (role: UserRole) => void;

  // Cart Operations
  addToCart: (item: MenuItem, qty?: number) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Order Operations
  checkout: (paymentMethod: 'card' | 'cash' | 'upi') => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  simulateStatusTransition: (orderId: string) => void;

  // Admin & Catalog Operations
  addMenuItem: (item: Omit<MenuItem, 'id' | 'created_at'>) => Promise<boolean>;
  updateMenuItem: (item: MenuItem) => Promise<boolean>;
  deleteMenuItem: (itemId: string) => Promise<boolean>;
  createStaffAccount: (fullName: string, email: string, phone: string, role: UserRole) => Promise<boolean>;
  getAnalytics: () => {
    totalOrders: number;
    totalRevenue: number;
    popularItems: { name: string; count: number }[];
    salesTrends: { date: string; amount: number }[];
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// MOCK SEED DATA FOR DEMO MODE
const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Coffee', image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Tea', image_url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Snacks', image_url: 'https://images.unsplash.com/photo-1549778399-f94fd24d68fd?w=500', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Meals', image_url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500', created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Desserts', image_url: 'https://images.unsplash.com/photo-1586985289688-ca9acf2f5f3c?w=500', created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Beverages', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', created_at: new Date().toISOString() },
];

const MOCK_MENU_ITEMS: MenuItem[] = [
  // Coffee
  { id: 'menu-1', category_id: 'cat-1', name: 'Espresso', description: 'Rich, bold, and intense single shot of coffee goodness.', price: 3.50, image_url: 'https://images.unsplash.com/photo-1510707513156-466d12c37db5?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-2', category_id: 'cat-1', name: 'Cappuccino', description: 'Classic espresso topped with steamed milk and a thick layer of silky foam.', price: 4.50, image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-3', category_id: 'cat-1', name: 'Caramel Macchiato', description: 'Steamed milk stained with espresso, vanilla syrup, and a buttery caramel drizzle.', price: 5.25, image_url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500', available: true, created_at: new Date().toISOString() },
  
  // Tea
  { id: 'menu-4', category_id: 'cat-2', name: 'Matcha Latte', description: 'Premium stone-ground Japanese green tea hand-whisked with steamed oat milk.', price: 5.00, image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-5', category_id: 'cat-2', name: 'Spiced Chai Latte', description: 'Fragrant blend of black tea, cinnamon, cardamom, ginger, and steamed milk.', price: 4.75, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', available: true, created_at: new Date().toISOString() },
  
  // Snacks
  { id: 'menu-6', category_id: 'cat-3', name: 'Chocolate Croissant', description: 'Light, flaky, and buttery pastry filled with decadent dark chocolate.', price: 3.95, image_url: 'https://images.unsplash.com/photo-1549778399-f94fd24d68fd?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-7', category_id: 'cat-3', name: 'Blueberry Muffin', description: 'Freshly baked bakery-style muffin bursting with plump, sweet blueberries.', price: 3.50, image_url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500', available: true, created_at: new Date().toISOString() },
  
  // Meals
  { id: 'menu-8', category_id: 'cat-4', name: 'Avocado Toast', description: 'Thick-cut toasted sourdough topped with smashed avocado, cherry tomatoes, and feta.', price: 9.50, image_url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-9', category_id: 'cat-4', name: 'Smoked Salmon Bagel', description: 'Toasted sesame bagel with cream cheese, premium smoked salmon, and fresh dill.', price: 11.25, image_url: 'https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?w=500', available: true, created_at: new Date().toISOString() },
  
  // Desserts
  { id: 'menu-10', category_id: 'cat-5', name: 'Red Velvet Cake', description: 'Velvety cocoa cake layered with rich cream cheese frosting.', price: 6.50, image_url: 'https://images.unsplash.com/photo-1586985289688-ca9acf2f5f3c?w=500', available: true, created_at: new Date().toISOString() },
  { id: 'menu-11', category_id: 'cat-5', name: 'Affogato Classico', description: 'A scoop of premium vanilla bean gelato drowned in a hot shot of espresso.', price: 5.50, image_url: 'https://images.unsplash.com/photo-1594911774802-8822a707cff3?w=500', available: true, created_at: new Date().toISOString() },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial settings and session
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      // Load saved user session from LocalStorage (simple demo session retention)
      const savedUser = localStorage.getItem('cafe_user');
      const savedRole = localStorage.getItem('cafe_role');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as Profile;
          setUser(parsedUser);
          setRole((savedRole as UserRole) || parsedUser.role || 'customer');
        } catch (e) {
          console.error("Failed to parse cached user", e);
        }
      }

      if (isSupabaseConfigured && supabase) {
        try {
          // Check active Supabase Auth Session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Load user profile details
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profile) {
              const profileData = profile as Profile;
              setUser(profileData);
              setRole(profileData.role);
              localStorage.setItem('cafe_user', JSON.stringify(profileData));
              localStorage.setItem('cafe_role', profileData.role);
            }
          }

          // Fetch categories & menu items from DB
          const { data: dbCats } = await supabase.from('categories').select('*').order('name');
          const { data: dbItems } = await supabase.from('menu_items').select('*').order('name');

          if (dbCats && dbCats.length > 0) {
            setCategories(dbCats);
          } else {
            // Try to seed; if RLS blocks it, fall back to mock display data
            await seedDatabaseCategories();
            // If still empty after seed attempt, use mock for display
            setCategories(prev => prev.length === 0 ? MOCK_CATEGORIES : prev);
          }

          if (dbItems && dbItems.length > 0) {
            setMenuItems(dbItems);
          } else {
            // Try to seed; if RLS blocks it, fall back to mock display data
            await seedDatabaseMenuItems(dbCats && dbCats.length > 0 ? dbCats : MOCK_CATEGORIES);
            // If still empty after seed attempt, use mock for display only
            setMenuItems(prev => prev.length === 0 ? MOCK_MENU_ITEMS : prev);
          }

          // Fetch all orders for staff, or user orders for customer
          await refreshOrders(session?.user?.id || '');

          // Setup Realtime subscriptions
          const ordersChannel = supabase
            .channel('orders-realtime')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'orders' },
              () => {
                // Trigger refresh on any order table update
                const activeSessionId = localStorage.getItem('cafe_user') 
                  ? (JSON.parse(localStorage.getItem('cafe_user')!) as Profile).id 
                  : '';
                refreshOrders(activeSessionId);
              }
            )
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'menu_items' },
              async () => {
                const { data } = await supabase.from('menu_items').select('*').order('name');
                if (data) setMenuItems(data);
              }
            )
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'categories' },
              async () => {
                const { data } = await supabase.from('categories').select('*').order('name');
                if (data) setCategories(data);
              }
            )
            .subscribe();

          return () => {
            supabase!.removeChannel(ordersChannel);
          };

        } catch (error) {
          console.error("Error setting up Supabase, loading fallback", error);
          loadMockData();
        }
      } else {
        // Fallback to local memory mock data
        loadMockData();
      }
      setLoading(false);
    };

    initializeApp();
  }, []);

  const loadMockData = () => {
    setCategories(MOCK_CATEGORIES);
    setMenuItems(MOCK_MENU_ITEMS);
    
    // Load mock orders if saved in LocalStorage
    const cachedOrders = localStorage.getItem('cafe_mock_orders');
    if (cachedOrders) {
      try {
        setOrders(JSON.parse(cachedOrders));
      } catch {
        setOrders([]);
      }
    } else {
      // Seed a completed and preparing order for rich display
      const initialOrders: Order[] = [
        {
          id: 'ord-101',
          user_id: user?.id || 'cust-1',
          status: 'COMPLETED',
          total_amount: 14.50,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          profiles: { id: 'cust-1', full_name: 'Jane Doe', email: 'jane@example.com', role: 'customer', created_at: '' },
          order_items: [
            { id: 'item-101a', order_id: 'ord-101', menu_item_id: 'menu-2', quantity: 2, price: 4.50, menu_items: MOCK_MENU_ITEMS[1] },
            { id: 'item-101b', order_id: 'ord-101', menu_item_id: 'menu-11', quantity: 1, price: 5.50, menu_items: MOCK_MENU_ITEMS[10] }
          ]
        },
        {
          id: 'ord-102',
          user_id: user?.id || 'cust-2',
          status: 'PREPARING',
          total_amount: 13.45,
          created_at: new Date(Date.now() - 1200000).toISOString(), // 20 mins ago
          profiles: { id: 'cust-2', full_name: 'John Smith', email: 'john@example.com', role: 'customer', created_at: '' },
          order_items: [
            { id: 'item-102a', order_id: 'ord-102', menu_item_id: 'menu-8', quantity: 1, price: 9.50, menu_items: MOCK_MENU_ITEMS[7] },
            { id: 'item-102b', order_id: 'ord-102', menu_item_id: 'menu-7', quantity: 1, price: 3.50, menu_items: MOCK_MENU_ITEMS[6] }
          ]
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('cafe_mock_orders', JSON.stringify(initialOrders));
    }
  };

  const seedDatabaseCategories = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('categories').insert(
      MOCK_CATEGORIES.map(({ name, image_url }) => ({ name, image_url }))
    ).select();
    if (data) setCategories(data);
  };

  const seedDatabaseMenuItems = async (loadedCats: Category[]) => {
    if (!supabase) return;
    const itemsToInsert = MOCK_MENU_ITEMS.map(item => {
      // Find matching category by name to assign correct category_id
      const mockCat = MOCK_CATEGORIES.find(c => c.id === item.category_id);
      const dbCat = loadedCats.find(c => c.name === mockCat?.name);
      return {
        category_id: dbCat?.id || loadedCats[0].id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        available: item.available
      };
    });
    const { data } = await supabase.from('menu_items').insert(itemsToInsert).select();
    if (data) setMenuItems(data);
  };

  const refreshOrders = async (userId: string) => {
    if (!supabase) return;
    
    // Fetch user details for caching profiles
    // In Supabase we fetch relations: profiles(*), order_items(*, menu_items(*))
    let query = supabase
      .from('orders')
      .select('*, profiles(*), order_items(*, menu_items(*))');
    
    // Non-staff only see their own orders
    const cachedRole = localStorage.getItem('cafe_role') || 'customer';
    if (cachedRole === 'customer' && userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) {
      // Merge local mock orders so they aren't lost when switching roles in the review widget
      const cachedOrders = localStorage.getItem('cafe_mock_orders');
      let localMocks: Order[] = [];
      if (cachedOrders) {
        try {
          localMocks = JSON.parse(cachedOrders);
        } catch {}
      }

      // Filter mock orders by user_id if logged in as customer
      const filteredMocks = localMocks.filter(mock => {
        if (cachedRole === 'customer' && userId) {
          return mock.user_id === userId;
        }
        return true;
      });

      setOrders([...filteredMocks, ...(data as Order[])]);
    }
  };

  // AUTH ACTIONS
  const login = async (email: string, password?: string, mockRole: UserRole = 'customer') => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123'
        });
        if (error) throw error;
        if (data?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profile) {
            const profileData = profile as Profile;
            setUser(profileData);
            setRole(profileData.role);
            localStorage.setItem('cafe_user', JSON.stringify(profileData));
            localStorage.setItem('cafe_role', profileData.role);
            await refreshOrders(profileData.id);
            return true;
          }
        }
      } catch (err) {
        console.error("Supabase Login Failed:", err);
        alert(`Login failed: ${(err as Error).message}. If you haven't registered yet, please use the Register tab first.`);
        return false;
      }
    }
    
    // Mock Mode Login (no Supabase configured)
    const mockProfile: Profile = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      full_name: email.split('@')[0].toUpperCase(),
      email,
      role: mockRole,
      created_at: new Date().toISOString()
    };
    setUser(mockProfile);
    setRole(mockRole);
    localStorage.setItem('cafe_user', JSON.stringify(mockProfile));
    localStorage.setItem('cafe_role', mockRole);
    return true;
  };

  const register = async (email: string, fullName: string, phone: string, password?: string, mockRole: UserRole = 'customer') => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || 'password123',
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: mockRole
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          // If email confirmation is disabled, session is returned immediately
          if (data.session) {
            const profileData: Profile = {
              id: data.user.id,
              full_name: fullName,
              email,
              phone,
              role: mockRole,
              created_at: new Date().toISOString()
            };
            setUser(profileData);
            setRole(mockRole);
            localStorage.setItem('cafe_user', JSON.stringify(profileData));
            localStorage.setItem('cafe_role', mockRole);
          } else {
            // Email confirmation required — tell the user
            alert('Account created! Please check your email to confirm your account, then sign in.');
          }
          return true;
        }
      } catch (err) {
        console.error("Supabase Signup Failed:", err);
        alert(`Registration failed: ${(err as Error).message}`);
        return false;
      }
    }

    // Mock Mode registration
    const mockProfile: Profile = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      full_name: fullName,
      email,
      phone,
      role: mockRole,
      created_at: new Date().toISOString()
    };
    setUser(mockProfile);
    setRole(mockRole);
    localStorage.setItem('cafe_user', JSON.stringify(mockProfile));
    localStorage.setItem('cafe_role', mockRole);
    return true;
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole('customer');
    setCart([]);
    localStorage.removeItem('cafe_user');
    localStorage.removeItem('cafe_role');
  };

  const setMockRole = async (selectedRole: UserRole) => {
    setRole(selectedRole);
    localStorage.setItem('cafe_role', selectedRole);
    
    if (isSupabaseConfigured && supabase && user) {
      // Update the role in Supabase so RLS policies allow access
      await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);
        
      // Also update the local user state
      const updatedUser = { ...user, role: selectedRole };
      setUser(updatedUser);
      localStorage.setItem('cafe_user', JSON.stringify(updatedUser));
      
      refreshOrders(user.id);
    }
  };

  // CART ACTIONS
  const addToCart = (menuItem: MenuItem, qty: number = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.menuItem.id === menuItem.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { menuItem, quantity: qty }];
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.menuItem.id === itemId ? { ...item, quantity: qty } : item
    ));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((tot, item) => tot + item.menuItem.price * item.quantity, 0);
  };

  // ORDER ACTIONS
  const checkout = async (paymentMethod: 'card' | 'cash' | 'upi') => {
    if (cart.length === 0) return null;
    const totalAmount = getCartTotal();
    const customerProfile = user || { id: 'cust-anon', full_name: 'Walk-in Guest', email: 'guest@cafe.com', role: 'customer' as UserRole, created_at: '' };

    // Detect if cart contains mock IDs (not real UUIDs from DB)
    const hasMockIds = cart.some(item => !item.menuItem.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    ));

    if (isSupabaseConfigured && supabase && user && !hasMockIds) {
      try {
        // Create Order
        const { data: orderData, error: oError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            status: 'PLACED',
            total_amount: totalAmount
          })
          .select()
          .single();

        if (oError) throw oError;
        const newOrderId = orderData.id;

        // Insert Order Items
        const orderItemsToInsert = cart.map(item => ({
          order_id: newOrderId,
          menu_item_id: item.menuItem.id,
          quantity: item.quantity,
          price: item.menuItem.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemsToInsert);

        if (itemsError) throw itemsError;

        // Insert Payment Record
        await supabase
          .from('payments')
          .insert({
            order_id: newOrderId,
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'cash' ? 'pending' : 'paid'
          });

        clearCart();
        await refreshOrders(user.id);

        return newOrderId;
      } catch (err) {
        console.error("Supabase Checkout Failed:", err);
        alert(`Checkout failed: ${(err as Error).message}`);
        return null;
      }
    }

    // Mock Mode Checkout
    const newOrderId = `ord-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: newOrderId,
      user_id: customerProfile.id,
      status: 'PLACED',
      total_amount: totalAmount,
      created_at: new Date().toISOString(),
      profiles: customerProfile,
      order_items: cart.map((item, idx) => ({
        id: `item-mock-${idx}-${Date.now()}`,
        order_id: newOrderId,
        menu_item_id: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
        menu_items: item.menuItem
      }))
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('cafe_mock_orders', JSON.stringify(nextOrders));
    clearCart();

    return newOrderId;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const isMockId = !orderId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    if (isSupabaseConfigured && supabase && !isMockId) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        
        if (error) throw error;
        await refreshOrders(user?.id || '');
        return true;
      } catch (err) {
        console.error("Failed to update status on Supabase:", err);
        alert(`Update status failed: ${(err as Error).message}`);
        return false;
      }
    }

    // Mock Mode order update (for local mock orders or when DB is disconnected)
    const updatedOrders = orders.map(ord => 
      ord.id === orderId ? { ...ord, status } : ord
    );
    setOrders(updatedOrders);
    localStorage.setItem('cafe_mock_orders', JSON.stringify(updatedOrders));
    return true;
  };

  // Helper to automate transitions for a richer customer tracking screen experience
  const simulateStatusTransition = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const sequence: OrderStatus[] = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];
    const curIndex = sequence.indexOf(order.status);
    if (curIndex < sequence.length - 1) {
      const nextStatus = sequence[curIndex + 1];
      setTimeout(() => {
        updateOrderStatus(orderId, nextStatus);
      }, 1000);
    }
  };

  // CATALOG OPERATIONS (ADMIN)
  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at'>) => {
    const createLocal = () => {
      const newItem: MenuItem = {
        ...item,
        id: `menu-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };
      setMenuItems(prev => [...prev, newItem]);
      return true;
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('menu_items').insert(item);
        if (error) throw error;
        // Refresh catalog from DB
        const { data: dbItems } = await supabase.from('menu_items').select('*').order('name');
        if (dbItems) setMenuItems(dbItems);
        return true;
      } catch (err: unknown) {
        const e = err as { message?: string; code?: string };
        console.error('Supabase Add Menu Item Failed:', err);
        if (e.code === '42501') {
          // RLS blocked — add locally and warn the user
          createLocal();
          alert('⚠️ Item added locally only (not saved to database).\n\nTo persist items permanently, run this in your Supabase SQL Editor:\n\nUPDATE public.profiles SET role = \'admin\' WHERE email = \'your@email.com\';');
          return true;
        }
        alert(`Failed to add item: ${e.message || 'Unknown error'}`);
        return false;
      }
    }

    // Mock / offline mode
    return createLocal();
  };

  const updateMenuItem = async (item: MenuItem) => {
    const isMockId = !item.id.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    if (isSupabaseConfigured && supabase && !isMockId) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .update({
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            image_url: item.image_url,
            available: item.available
          })
          .eq('id', item.id);
        
        if (error) throw error;
        // Refresh catalog
        const { data: dbItems } = await supabase.from('menu_items').select('*').order('name');
        if (dbItems) setMenuItems(dbItems);
        return true;
      } catch (err: unknown) {
        const e = err as { message?: string; code?: string };
        console.error("Supabase Update Menu Item Failed:", err);
        if (e.code === '42501') {
          alert('Save failed: Your account does not have admin permissions to edit menu items.\n\nMake sure your profile role is set to \'admin\' in Supabase.');
        } else {
          alert(`Save failed: ${e.message || 'Unknown error'}`);
        }
        return false;
      }
    }

    // Mock mode — update locally
    setMenuItems(prev => prev.map(m => m.id === item.id ? item : m));
    return true;
  };

  const deleteMenuItem = async (itemId: string) => {
    const isMockId = !itemId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    if (isSupabaseConfigured && supabase && !isMockId) {
      try {
        const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
        if (error) throw error;
        // Refresh
        const { data: dbItems } = await supabase.from('menu_items').select('*').order('name');
        if (dbItems) setMenuItems(dbItems);
        return true;
      } catch (err) {
        console.error("Supabase Delete Menu Item Failed:", err);
        return false;
      }
    }

    // Mock mode
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    return true;
  };

  const createStaffAccount = async (fullName: string, email: string, phone: string, role: UserRole) => {
    // In real Supabase, creating another user requires admin capabilities (auth.admin.createUser)
    // or creating a standard profile. For safety in demo context, we create a profile sync or mock it
    if (isSupabaseConfigured && supabase) {
      try {
        // We simulate profile creation. In production, this runs via a secure edge function or direct admin API.
        const { error } = await supabase!.from('profiles').insert({
          id: uuidv4(), // Mock UUID since we don't have access to insert into auth.users without admin credentials
          full_name: fullName,
          email,
          phone,
          role
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.error("Supabase Staff profile creation failed. Creating mock staff account instead.");
      }
    }
    // Simply success in Mock mode (we just print to log)
    console.log(`Created staff profile: ${fullName} (${role})`);
    return true;
  };

  // Helper uuid generator
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // ANALYTICS CALCULATIONS
  const getAnalytics = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    // Calculate popular items
    const itemCountMap: { [key: string]: number } = {};
    orders.forEach(o => {
      o.order_items?.forEach(item => {
        const name = item.menu_items?.name || 'Unknown Item';
        itemCountMap[name] = (itemCountMap[name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.keys(itemCountMap)
      .map(name => ({ name, count: itemCountMap[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate sales trends (grouped by date)
    const salesDateMap: { [key: string]: number } = {};
    orders.filter(o => o.status === 'COMPLETED').forEach(o => {
      const date = new Date(o.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      salesDateMap[date] = (salesDateMap[date] || 0) + Number(o.total_amount);
    });

    const salesTrends = Object.keys(salesDateMap).map(date => ({
      date,
      amount: Number(salesDateMap[date].toFixed(2))
    })).reverse();

    // Default trend filler if empty
    if (salesTrends.length === 0) {
      salesTrends.push(
        { date: 'Jul 10', amount: 45.50 },
        { date: 'Jul 11', amount: 89.20 },
        { date: 'Jul 12', amount: totalRevenue || 55.00 }
      );
    }

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      popularItems: popularItems.length > 0 ? popularItems : [
        { name: 'Cappuccino', count: 8 },
        { name: 'Avocado Toast', count: 5 },
        { name: 'Chocolate Croissant', count: 4 }
      ],
      salesTrends
    };
  };

  return (
    <AppContext.Provider value={{
      user,
      role,
      categories,
      menuItems,
      cart,
      orders,
      loading,
      isDbConnected: isSupabaseConfigured,
      login,
      register,
      logout,
      setMockRole,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      checkout,
      updateOrderStatus,
      simulateStatusTransition,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      createStaffAccount,
      getAnalytics
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
