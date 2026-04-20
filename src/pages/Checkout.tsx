import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { CheckCircle, CreditCard, Truck } from 'lucide-react';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: auth.currentUser?.email || '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '**** **** **** 1234', // Simulated
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please login to place an order");
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        address: formData.address,
        city: formData.city,
        items: cart,
        total: cartTotal,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'orders'), orderData);
      toast.success("Order placed successfully! Thank you for choosing Zay.");
      clearCart();
      navigate('/');
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="luxury-heading text-3xl uppercase mb-12">Billing & <span className="italic">Shipping</span></h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold">Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  required
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm font-light"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  required
                  type="email" 
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm font-light"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold flex items-center gap-2">
                <Truck size={14} /> Destination
              </h3>
              <input 
                required
                type="text" 
                placeholder="Shipping Address"
                className="w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm font-light"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-6">
                 <input 
                  required
                  type="text" 
                  placeholder="City"
                  className="w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm font-light"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <input 
                  required
                  type="text" 
                  placeholder="Postal Code"
                  className="w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-brand-gold transition-colors text-sm font-light"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-gold flex items-center gap-2">
                <CreditCard size={14} /> Payment Method
              </h3>
              <div className="p-6 border border-brand-gold/30 bg-brand-gold/5 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-6 bg-brand-dark rounded flex items-center justify-center">
                      <div className="w-6 h-4 border border-white/20"></div>
                   </div>
                   <span className="text-xs uppercase tracking-widest font-medium">Card ending in 1234</span>
                 </div>
                 <CheckCircle size={18} className="text-brand-gold" />
              </div>
              <p className="text-[10px] opacity-40 uppercase tracking-widest text-center italic">
                Simulated payment. No charges will be made.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="luxury-button w-full py-5 text-sm"
            >
              {loading ? 'Processing Transaction...' : `Finalize Purchase - ${formatPrice(cartTotal)}`}
            </button>
          </form>
        </motion.div>

        <aside className="lg:pl-20 border-l border-black/5">
          <h3 className="luxury-heading text-xl uppercase mb-12 tracking-widest">Order Review</h3>
          <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-20 bg-brand-cream/50 flex-shrink-0 border border-black/5">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs uppercase font-bold tracking-widest">{item.name}</h4>
                  <p className="text-[10px] opacity-60">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-12 border-t border-black/10 space-y-4 text-xs uppercase tracking-[0.2em]">
            <div className="flex justify-between opacity-60">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between opacity-60">
              <span>Standard Express</span>
              <span className="text-brand-gold">Complimentary</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4">
              <span>Final Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </aside>
       </div>
    </div>
  );
}
