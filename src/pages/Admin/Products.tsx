import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Navigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: 'Our master perfumers travel the world to source organic jasmine from Grasse, rich sandalwood from Mysore, and rare oud from the depths of Cambodia.',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    category: 'The Oud Series',
    stock: 20
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setIsAdmin(user?.email === 'msaimkhan2233@gmail.com');
      setCheckingAdmin(false);
    });
    return unsub;
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct } as Product]);
      setShowForm(false);
      toast.success("New olfactory masterpiece added.");
    } catch (e) {
      toast.error("Failed to curate product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Discontinue this fragrance?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success("Product discontinued from boutique.");
    } catch (e) {
      toast.error("Failed to remove.");
    }
  };

  if (checkingAdmin) return <div className="p-20 text-center uppercase tracking-widest text-xs opacity-50 italic">Authorizing...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex justify-between items-end mb-16">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-gold mb-3 block">Boutique Management</span>
          <h1 className="luxury-heading text-4xl uppercase">Product <span className="italic">Catalog</span></h1>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="luxury-button flex items-center gap-2"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel Curation' : 'Curate New Scent'}
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-card p-10 mb-16 max-w-2xl mx-auto"
        >
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Fragrance Name</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. Imperial Silk"
                  className="w-full bg-transparent border-b border-black/10 py-2 focus:border-brand-gold outline-none text-sm"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Category</label>
                <select 
                  className="w-full bg-transparent border-b border-black/10 py-2 focus:border-brand-gold outline-none text-sm font-light mt-1"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="The Oud Series">The Oud Series</option>
                  <option value="Floral Essence">Floral Essence</option>
                  <option value="Mystic Night">Mystic Night</option>
                  <option value="Summer Bloom">Summer Bloom</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Product Description</label>
              <textarea 
                required
                rows={3}
                className="w-full bg-transparent border border-black/10 p-4 focus:border-brand-gold outline-none text-sm font-light leading-relaxed"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                 <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Unit Price ($)</label>
                 <input 
                  required
                  type="number"
                  className="w-full bg-transparent border-b border-black/10 py-2 focus:border-brand-gold outline-none text-sm"
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Imagery URL (Unsplash/CDN)</label>
                 <input 
                  required
                  type="text"
                  className="w-full bg-transparent border-b border-black/10 py-2 focus:border-brand-gold outline-none text-xs"
                  value={newProduct.imageUrl}
                  onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="luxury-button w-full py-4 mt-8">Add to Boutique Collection</button>
          </form>
        </motion.div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-black/5 p-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-black/5 text-left text-[9px] uppercase tracking-[0.3em] opacity-40">
              <th className="py-4">Visual</th>
              <th className="py-4">Information</th>
              <th className="py-4">Price</th>
              <th className="py-4">Vibe/Category</th>
              <th className="py-4 text-right">Settings</th>
            </tr>
          </thead>
          <tbody className="text-xs uppercase tracking-widest font-light">
            {loading ? (
              <tr><td colSpan={5} className="py-20 text-center opacity-30 italic">Cataloging fragrances...</td></tr>
            ) : products.map((prod) => (
              <tr key={prod.id} className="border-b border-black/5 group">
                <td className="py-6">
                  <div className="w-12 h-16 bg-brand-cream/50 overflow-hidden border border-black/5">
                    <img src={prod.imageUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                  </div>
                </td>
                <td className="py-6">
                  <span className="font-bold block tracking-widest">{prod.name}</span>
                  <span className="text-[9px] opacity-40 lowercase max-w-[200px] truncate block">{prod.description}</span>
                </td>
                <td className="py-6 font-medium">{formatPrice(prod.price)}</td>
                <td className="py-6">
                   <span className="px-3 py-1 bg-brand-gold/5 text-brand-gold text-[9px] border border-brand-gold/10">
                     {prod.category}
                   </span>
                </td>
                <td className="py-6 text-right">
                  <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(prod.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
