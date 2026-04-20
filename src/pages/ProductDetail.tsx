import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { formatPrice } from '../lib/utils';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to bag`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h2 className="luxury-heading text-3xl uppercase">Fragrance Not Found</h2>
      <Link to="/shop" className="luxury-button">Back to Gallery</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 mb-12 transition-opacity">
        <ArrowLeft size={14} /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Product Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="luxury-card p-4 aspect-[4/5] bg-white group"
        >
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-brand-gold mb-4 block">{product.category}</span>
            <h1 className="luxury-heading text-4xl md:text-6xl uppercase leading-tight mb-6">{product.name}</h1>
            <p className="text-2xl font-light opacity-80">{formatPrice(product.price)}</p>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-light opacity-70 leading-loose">
              {product.description}
              <br/><br/>
              Our signature scent brings a unique olfactory experience that evolves throughout the day, leaving a memorable trails of mystery and elegance.
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                className="luxury-button flex-grow flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} />
                Add to Shopping Bag
              </button>
              <button className="p-4 border border-black/10 hover:border-brand-gold transition-colors text-brand-dark">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-black/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-full text-brand-gold">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Complimentary Delivery</h4>
                <p className="text-[10px] opacity-60">On all orders over $150</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-gold/10 rounded-full text-brand-gold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold mb-2">Signature Packaging</h4>
                <p className="text-[10px] opacity-60">Every bottle arrives in our luxury gift box</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-cream p-8 border border-brand-gold/20">
            <h4 className="luxury-heading text-lg uppercase mb-4 tracking-wider">The Scent Profile</h4>
            <div className="text-xs uppercase tracking-widest grid grid-cols-2 gap-y-4">
              <div className="opacity-40">Top Notes</div>
              <div className="text-right">Saffron, Jasmine</div>
              <div className="opacity-40">Heart Notes</div>
              <div className="text-right">Oud Wood, Amber</div>
              <div className="opacity-40">Base Notes</div>
              <div className="text-right">Musk, Sandalwood</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
