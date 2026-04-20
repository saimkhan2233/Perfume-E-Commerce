import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Order } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Package, Trash2, CheckCircle, Clock, Truck, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.email === 'msaimkhan2233@gmail.com');
      setCheckingAdmin(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const ordersList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recently'
        } as unknown as Order));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAdmin]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order records?")) return;
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast.success("Order deleted from logs");
    } catch (e) {
      toast.error("Failed to delete");
    }
  };

  const seedStore = async () => {
    const confirm = window.confirm("Populate boutique with sample collection?");
    if (!confirm) return;
    
    const seedProducts = [
      {
        name: "Golden Oud",
        description: "A rich, deep base of Cambodian oud with top notes of saffron and honey.",
        price: 185.00,
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
        category: "The Oud Series",
        stock: 50
      },
      {
        name: "Midnight Rose",
        description: "Damask rose entwined with dark patchouli and a hint of vanilla bean.",
        price: 145.00,
        imageUrl: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800",
        category: "Floral Essence",
        stock: 30
      },
      {
        name: "Desert Silk",
        description: "Light white musk and soft cashmere with a breath of desert wind.",
        price: 120.00,
        imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
        category: "Mystic Night",
        stock: 25
      }
    ];

    try {
      const { addDoc, collection } = await import('firebase/firestore');
      for (const prod of seedProducts) {
        await addDoc(collection(db, 'products'), prod);
      }
      toast.success("Boutique collection curated successfully.");
      window.location.reload();
    } catch (e) {
      toast.error("Failed to seed boutique.");
    }
  };

  if (checkingAdmin) return <div className="p-20 text-center uppercase tracking-widest text-xs opacity-50">Authorizing...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex justify-between items-end">
         <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-sand mb-3 block">Boutique Management</span>
          <h1 className="luxury-heading text-4xl">Admin <span className="not-italic">Panel</span></h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={seedStore}
            className="text-[10px] uppercase tracking-widest px-4 py-2 text-brand-sand hover:text-brand-olive transition-colors"
          >
            Seed Collection
          </button>
          <Link to="/admin/products" className="text-[10px] uppercase tracking-widest px-6 py-3 bg-brand-olive text-white rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
            <Package size={14} /> Manage Products
          </Link>
        </div>
      </div>

      {/* Admin Insights Section */}
      <section className="h-40 bg-brand-muted rounded-3xl border border-brand-border flex items-center px-12 justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-sand mb-1 font-bold">Total Sales Today</p>
          <p className="text-3xl luxury-heading not-italic text-brand-olive">{formatPrice(orders.reduce((s, o) => s + o.total, 0))}</p>
        </div>
        <div className="h-12 w-px bg-brand-border"></div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-sand mb-1 font-bold">Active Orders</p>
          <p className="text-3xl luxury-heading not-italic text-brand-olive">{orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}</p>
        </div>
        <div className="h-12 w-px bg-brand-border"></div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-brand-sand mb-1 font-bold">Total Logs</p>
          <p className="text-3xl luxury-heading not-italic text-brand-olive">{orders.length}</p>
        </div>
        <button className="bg-brand-olive text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:opacity-90">
          Export Report
        </button>
      </section>

      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden">
        <div className="p-5 bg-brand-paper/50 border-b border-brand-border flex justify-between items-center px-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">Recent Order Activity</span>
          <span className="text-[10px] text-brand-sand cursor-pointer hover:text-brand-olive font-bold">View Archive →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase text-brand-sand border-b border-brand-muted font-bold">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Items</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Amount</th>
                <th className="px-8 py-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {loading ? (
                <tr><td colSpan={6} className="py-20 text-center opacity-30 italic">Retrieving boutique archives...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center opacity-30 italic">No activity recorded.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-muted hover:bg-brand-muted/30 transition-colors">
                    <td className="px-8 py-5 font-mono text-[10px] text-brand-sand">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-brand-olive">{order.customerName}</p>
                      <p className="text-[10px] text-brand-sand lowercase">{order.customerEmail}</p>
                    </td>
                    <td className="px-8 py-5 text-brand-sand italic">{order.items.length} Item(s)</td>
                    <td className="px-8 py-5 text-center">
                       <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border bg-white ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                          order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-brand-olive">{formatPrice(order.total)}</td>
                    <td className="px-8 py-5 text-center">
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="text-brand-sand hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
