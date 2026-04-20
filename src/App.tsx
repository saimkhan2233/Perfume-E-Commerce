/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, User, Settings, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { CartProvider, useCart } from './context/CartContext';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';

const Navigation = () => {
  const { itemCount } = useCart();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        setIsAdmin(user.email === 'msaimkhan2233@gmail.com');
      } else {
        setIsAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  return (
    <>
      {/* Mobile Top Nav */}
      <nav className="md:hidden sticky top-0 z-50 bg-brand-paper shadow-sm border-b border-brand-border">
        <div className="px-4 h-16 flex justify-between items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-olive">
            <Menu size={20} />
          </button>
          <Link to="/" className="luxury-heading text-xl">Zay</Link>
          <Link to="/cart" className="relative text-brand-olive">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-olive text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
        {isMenuOpen && (
          <div className="bg-white p-6 space-y-6 border-b border-brand-border animate-in slide-in-from-top duration-300">
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-brand-sand">Marketplace</p>
              <Link to="/" className="block text-sm text-brand-olive font-medium" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
              <Link to="/shop" className="block text-sm text-brand-sand" onClick={() => setIsMenuOpen(false)}>Collections</Link>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-brand-sand">Dashboard</p>
              <button 
                onClick={() => { login(); setIsMenuOpen(false); }} 
                className="block text-sm text-brand-sand text-left w-full"
              >
                {user ? user.displayName : 'Login'}
              </button>
              {isAdmin && (
                <Link to="/admin" className="block text-sm text-brand-sand" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
              )}
            </div>
            {user && (
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }} 
                className="text-[10px] uppercase tracking-widest text-red-500 font-bold"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Sidebar Nav */}
      <nav className="hidden md:flex w-64 bg-white border-r border-brand-border flex-col p-8 h-screen sticky top-0 flex-shrink-0">
        <div className="mb-12">
          <Link to="/" className="text-3xl luxury-heading">Zay</Link>
          <p className="text-[10px] uppercase tracking-widest text-brand-sand mt-1">By Zainab</p>
        </div>
        
        <div className="space-y-10 flex-grow">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-sand mb-5 tracking-widest">Marketplace</p>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="flex items-center text-brand-olive font-medium text-sm group">
                  <span className="w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="flex items-center text-brand-sand hover:text-brand-olive cursor-pointer transition-colors text-sm group">
                  <span className="w-1.5 h-1.5 bg-brand-olive rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Shop All
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-sand mb-5 tracking-widest">Account</p>
            <ul className="space-y-4">
              <li className="text-brand-sand hover:text-brand-olive cursor-pointer text-sm" onClick={user ? undefined : login}>
                 {user ? 'My Profile' : 'Login / Register'}
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-brand-sand hover:text-brand-olive cursor-pointer text-sm">Admin Panel</Link>
                </li>
              )}
               <li>
                <Link to="/cart" className="flex items-center justify-between text-brand-sand hover:text-brand-olive cursor-pointer text-sm">
                  Bag
                  <span className="bg-brand-olive text-white text-[10px] px-1.5 py-0.5 rounded-full">{itemCount}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-border">
          {user ? (
            <div className="flex items-center space-x-3">
              <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-brand-border" />
              <div className="flex-grow overflow-hidden">
                <p className="text-xs font-bold truncate">{user.displayName}</p>
                <button onClick={logout} className="text-[9px] text-red-500 uppercase font-bold tracking-widest hover:underline">Sign Out</button>
              </div>
            </div>
          ) : (
            <button onClick={login} className="luxury-button w-full">Sign In</button>
          )}
        </div>
      </nav>
    </>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col md:flex-row min-h-screen bg-brand-paper font-sans text-brand-ink">
          <Navigation />
          <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
            <header className="hidden md:flex h-20 px-10 items-center justify-between border-b border-brand-border bg-white/50 backdrop-blur-sm sticky top-0 z-40">
              <div className="relative flex items-center">
                <Search size={16} className="text-brand-sand absolute left-0" />
                <input 
                  type="text" 
                  placeholder="Search fragrances..." 
                  className="bg-transparent pl-8 text-xs font-light focus:outline-none w-64"
                />
              </div>
              <div className="flex items-center space-x-8">
                 <Link to="/cart" className="flex items-center space-x-2 group">
                   <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-brand-olive transition-colors">Bag</span>
                   <ShoppingBag size={18} className="text-brand-sand group-hover:text-brand-olive transition-all" />
                 </Link>
              </div>
            </header>

            <main className="flex-1 p-4 md:p-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
              </Routes>
            </main>
            
            <footer className="bg-white border-t border-brand-border py-12 px-10">
              <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                   <h1 className="text-2xl luxury-heading mb-4">Zay</h1>
                   <p className="text-xs text-brand-sand leading-relaxed">
                     By Zainab. Exploring the intersection of nature and emotion through artisanal scents.
                   </p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest">Connect</p>
                  <div className="flex space-x-4">
                     <span className="text-brand-sand hover:text-brand-olive transition-colors cursor-pointer text-xs">Instagram</span>
                     <span className="text-brand-sand hover:text-brand-olive transition-colors cursor-pointer text-xs">Twitter</span>
                  </div>
                </div>
                <div className="text-[10px] text-brand-sand uppercase tracking-widest pt-1">
                   © 2026 Zay by Zainab.
                </div>
              </div>
            </footer>
          </div>
          <Toaster position="top-center" expand={false} richColors />
        </div>
      </Router>
    </CartProvider>
  );
}
