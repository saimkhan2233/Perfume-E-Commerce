import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '../lib/utils';
import { Filter, Search } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, 'products');
        // Simple client-side filtering for search and cat for better responsiveness in this demo
        const querySnapshot = await getDocs(q);
        let productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (categoryFilter) {
          productsList = productsList.filter(p => p.category.toLowerCase().includes(categoryFilter.toLowerCase()));
        }
        
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <header className="mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-sand mb-3 block">Discover our ranges</span>
        <h1 className="luxury-heading text-6xl italic leading-tight">The <span className="not-italic">Gallery</span></h1>
        
        <div className="max-w-md relative mt-8">
          <input 
            type="text"
            placeholder="Search our selection..."
            className="w-full bg-white border border-brand-border rounded-full py-4 px-12 text-xs focus:outline-none focus:border-brand-olive transition-colors font-light shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-sand" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 border-r border-brand-border pr-8 hidden lg:block">
          <h3 className="text-[10px] uppercase tracking-widest font-bold mb-8 text-brand-sand">Collections</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link to="/shop" className={!categoryFilter ? "text-brand-olive flex items-center" : "text-brand-sand hover:text-brand-olive transition-colors flex items-center"}>
              <span className={`w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 ${!categoryFilter ? 'opacity-100' : 'opacity-0'}`}></span>
              All Products
            </Link></li>
            <li><Link to="/shop?cat=floral" className={categoryFilter === 'floral' ? "text-brand-olive flex items-center" : "text-brand-sand hover:text-brand-olive transition-colors flex items-center"}>
              <span className={`w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 ${categoryFilter === 'floral' ? 'opacity-100' : 'opacity-0'}`}></span>
              Floral Essence
            </Link></li>
            <li><Link to="/shop?cat=oud" className={categoryFilter === 'oud' ? "text-brand-olive flex items-center" : "text-brand-sand hover:text-brand-olive transition-colors flex items-center"}>
              <span className={`w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 ${categoryFilter === 'oud' ? 'opacity-100' : 'opacity-0'}`}></span>
              The Oud Series
            </Link></li>
            <li><Link to="/shop?cat=mystic" className={categoryFilter === 'mystic' ? "text-brand-olive flex items-center" : "text-brand-sand hover:text-brand-olive transition-colors flex items-center"}>
              <span className={`w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 ${categoryFilter === 'mystic' ? 'opacity-100' : 'opacity-0'}`}></span>
              Mystic Night
            </Link></li>
          </ul>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                 Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[3/4] bg-gray-200"></div>
                    <div className="h-4 bg-gray-200"></div>
                  </div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group"
                  >
                    <Link to={`/product/${product.id}`} className="luxury-card p-4 block">
                      <div className="aspect-[3/4] overflow-hidden mb-6 bg-brand-cream/30">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-[9px] uppercase tracking-widest text-brand-gold mb-1 block">{product.category}</span>
                        <h3 className="luxury-heading text-lg uppercase mb-1">{product.name}</h3>
                        <p className="text-sm font-medium opacity-50">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center opacity-40 italic">
                  No scents matching your search were found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
