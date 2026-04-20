import { useState, useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), limit(3));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-[#f4f1ec] rounded-[40px] overflow-hidden m-4 md:m-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1920" 
            alt="Perfume Bottle"
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 px-10 md:px-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-[10px] uppercase font-bold text-brand-sand mb-6 block tracking-[0.3em]">Spring Collection 2026</span>
            <h1 className="luxury-heading text-6xl md:text-8xl mb-8 leading-[0.9]">
              Scented <br /> Eternity
            </h1>
            <p className="text-sm font-light text-brand-ink/70 mb-12 leading-loose max-w-md">
              Discover a collection where every fragrance is a journey. Crafted with the world's rarest botanical ingredients and hand-poured in small batches.
            </p>
            <Link to="/shop" className="luxury-button inline-flex items-center gap-3">
              Browse Boutique
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-10">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-sand mb-3 tracking-widest">Marketplace</p>
            <h2 className="luxury-heading text-4xl italic">Shop <span className="not-italic">All</span></h2>
          </div>
          <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-brand-ink pb-1">Explore Full Gallery →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-gray-200"></div>
                <div className="h-4 bg-gray-200 w-1/2"></div>
                <div className="h-4 bg-gray-200 w-1/4"></div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group luxury-card p-6"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[3/4] overflow-hidden mb-8 bg-brand-cream/50 relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-dark/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold mb-2 block">{product.category}</span>
                    <h3 className="luxury-heading text-xl uppercase mb-2">{product.name}</h3>
                    <p className="text-sm font-medium opacity-60">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 opacity-40">No products found.</div>
          )}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white py-24 border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-brand-cream relative z-10 overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1616948055599-91759080f5c7?auto=format&fit=crop&q=80&w=1000" 
                alt="Perfume Creation"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 border border-brand-gold/20 -z-0"></div>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-brand-gold mb-4 block">Our Philosophy</span>
            <h2 className="luxury-heading text-4xl md:text-5xl uppercase leading-tight mb-8">Crafting Memories <br /> <span className="italic">In Every Drop</span></h2>
            <p className="text-sm font-light opacity-70 leading-loose mb-12">
              At Zay by Zainab, we believe a fragrance is more than a scent—it's an identity. Our master perfumers travel the world to source organic jasmine from Grasse, rich sandalwood from Mysore, and rare oud from the depths of Cambodia.
              <br /><br />
              Every bottle is individually inspected and packaged by hand to ensure that the moment you open it, you experience nothing but perfection.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-black/5 pt-12">
              <div>
                <span className="text-2xl luxury-heading block mb-2 underline decoration-brand-gold underline-offset-8">100%</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60">Pure Essences</span>
              </div>
               <div>
                <span className="text-2xl luxury-heading block mb-2 underline decoration-brand-gold underline-offset-8">Hand</span>
                <span className="text-[10px] uppercase tracking-widest opacity-60">Poured Bottles</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
