import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-8">
        <div className="p-10 rounded-full bg-brand-gold/10 text-brand-gold">
          <ShoppingBag size={48} />
        </div>
        <div className="text-center">
          <h2 className="luxury-heading text-3xl uppercase mb-4">Your Bag is Empty</h2>
          <p className="text-sm font-light opacity-60 mb-8">Begin your olfactory journey today.</p>
          <Link to="/shop" className="luxury-button">Browse Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h1 className="luxury-heading text-4xl uppercase mb-16 text-center">Your <span className="italic">Selection</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-8 luxury-card p-6 items-center"
            >
              <div className="w-24 h-32 bg-brand-cream/50 flex-shrink-0">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold">{item.category}</span>
                    <h3 className="luxury-heading text-xl uppercase">{item.name}</h3>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center border border-black/10">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-black/5"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-black/5"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary side board */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-black/5 p-8">
            <h4 className="luxury-heading text-xl uppercase mb-8 tracking-wider">Order Summary</h4>
            <div className="space-y-6 text-xs uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="opacity-40">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Delivery</span>
                <span className="text-brand-gold">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Tax</span>
                <span>Calculated at Checkout</span>
              </div>
              <div className="h-px bg-black/5 my-6"></div>
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              className="luxury-button w-full mt-10 flex items-center justify-center gap-3"
            >
              Proceed to Billing
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="p-6 bg-brand-gold/5 border border-brand-gold/20 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold flex-shrink-0">
               <ShoppingBag size={20} />
            </div>
            <p className="text-[10px] uppercase tracking-widest leading-relaxed opacity-70">
              Each order includes 2 complimentary samples of your choice from our latest collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
