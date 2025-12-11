import React, { useContext, useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Sun, Moon, User, Globe, Search, Star, 
  ChevronDown, ChevronUp, Phone, Mail, HelpCircle, 
  Shield, FileText, Facebook, Instagram, Twitter, Edit 
} from 'lucide-react';
import { StoreContext } from './StoreContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lenis from 'lenis';

// Removed: import Snowfall from 'react-snowfall'; (Causing build errors)

// Import External Pages
import Cart from './Cart';
import AdminDashboard from './AdminDashboard';
import AuthPage from './AuthPage';
import UserProfile from './UserProfile';

// --- NEW COMPONENT: CSS SNOW OVERLAY (No Install Needed) ---
const SnowOverlay = () => {
  // Create 50 snowflakes with random positions and speeds
  const flakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}vw`,
    animationDuration: `${Math.random() * 3 + 2}s`, // Random speed 2s-5s
    animationDelay: `${Math.random() * 5}s`,
    fontSize: `${Math.random() * 1.5 + 1}rem`, // Random size
    opacity: Math.random() * 0.5 + 0.3
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {flakes.map((flake) => (
        <div 
          key={flake.id} 
          className="snowflake"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
            opacity: flake.opacity
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

// --- ANIMATION CONFIGURATION ---
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 }
};

const pageTransition = {
  type: "tween",
  ease: "circOut",
  duration: 0.5
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

// --- HELPER COMPONENT: ADMIN EDIT SHORTCUT ---
const AdminEditBtn = ({ label = "Edit Content" }) => {
  const { currentUser } = useContext(StoreContext);
  const navigate = useNavigate();

  if (currentUser?.role !== 'Administrator') return null;

  return (
    <button 
      onClick={() => navigate('/admin')}
      className="absolute top-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-honey-600 transition shadow-lg backdrop-blur-md"
    >
      <Edit size={12} /> {label}
    </button>
  );
};

// --- HOME ANIMATION HELPERS ---
const FloatingHexagon = ({ delay, x, y, size }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1], 
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0]
    }}
    transition={{ duration: 6, delay: delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute border-2 border-honey-400/30 rounded-3xl backdrop-blur-sm z-0 pointer-events-none`}
    style={{ left: x, top: y, width: size, height: size }}
  />
);

const StaggerText = ({ text, className }) => {
  const letters = text ? text.split("") : [];
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.04 * i } }),
  };
  const child = {
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } },
    hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 100 } },
  };
  return (
    <motion.div variants={container} initial="hidden" animate="visible" className={`flex flex-wrap justify-center overflow-hidden ${className}`}>
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>{letter === " " ? "\u00A0" : letter}</motion.span>
      ))}
    </motion.div>
  );
};

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const { theme, toggleTheme, currency, setCurrency, language, setLanguage, cart, t, currentUser } = useContext(StoreContext);
  const [showSettings, setShowSettings] = useState(false);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  
  // Auto-close logic
  const closeTimer = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setShowSettings(false);
    }, 1500); // Closes after 1.5s
  };

  return (
    <nav className="fixed top-4 left-0 right-0 mx-auto w-[95%] max-w-7xl z-50 glass-panel rounded-[2rem] px-6 py-3 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="text-2xl font-black text-honey-600 dark:text-honey-400 tracking-tighter flex items-center gap-2">
        🍯 HoneyZest
      </Link>
      <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300">
        <Link to="/" className="hover:text-honey-500 transition">{t('home')}</Link>
        <Link to="/catalog" className="hover:text-honey-500 transition">{t('shop')}</Link>
        <Link to="/blog" className="hover:text-honey-500 transition">{t('blog')}</Link>
        <Link to="/contact" className="hover:text-honey-500 transition">{t('contact')}</Link>
      </div>
      <div className="flex items-center gap-3 relative">
        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-1 bg-honey-100 dark:bg-gray-800 px-3 py-2 rounded-full text-xs font-bold hover:bg-honey-200 transition">
                <Globe size={14}/> {language.toUpperCase()} / {currency} <ChevronDown size={12}/>
            </button>
            <AnimatePresence>
                {showSettings && (
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}} className="absolute top-12 right-0 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-48 flex flex-col gap-4 z-50">
                        <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold">Language</p>
                            <div className="grid grid-cols-3 gap-2">
                                {['en', 'sw', 'fr'].map(l => (<button key={l} onClick={() => setLanguage(l)} className={`p-1 rounded text-xs font-bold ${language === l ? 'bg-honey-500 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'}`}>{l.toUpperCase()}</button>))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2 font-bold">Currency</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['KES', 'USD', 'EUR', 'GBP'].map(c => (<button key={c} onClick={() => setCurrency(c)} className={`p-1 rounded text-xs font-bold ${currency === c ? 'bg-honey-500 text-white' : 'bg-gray-100 dark:bg-gray-800 dark:text-white'}`}>{c}</button>))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition">{theme === 'light' ? <Moon size={20}/> : <Sun size={20} className="text-yellow-300"/>}</button>
        <Link to="/cart" className="relative p-2 bg-gradient-to-br from-honey-400 to-honey-600 text-white rounded-full shadow-lg hover:scale-110 transition">
          <ShoppingBag size={20}/>
          {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-black font-bold">{totalItems}</span>}
        </Link>
        <Link to={currentUser ? "/profile" : "/auth"} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition">
            <User size={20} className={currentUser ? "text-honey-600 dark:text-honey-400" : ""}/>
        </Link>
      </div>
    </nav>
  );
};

// --- PAGES (Home, Catalog, Contact, etc.) ---
// ... (Your page components remain exactly the same as before, I will skip them for brevity but keep them in your file) ...

// IMPORTANT: Re-paste your Home, Catalog, Contact, Blog, FAQ, Privacy, Terms, Footer components here if you delete them.
// For this copy-paste, I assume they are below or imported. If they are in this file, DO NOT DELETE THEM.

const Home = () => {
    const { t, aboutInfo } = useContext(StoreContext);
    return (
        <div className="relative pt-20 px-4 min-h-screen flex flex-col items-center justify-center overflow-hidden perspective-1000">
            <FloatingHexagon delay={0} x="10%" y="20%" size={80} />
            <FloatingHexagon delay={2} x="80%" y="15%" size={120} />
            <FloatingHexagon delay={4} x="70%" y="70%" size={60} />
            <FloatingHexagon delay={1} x="20%" y="60%" size={100} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="glass-panel p-8 md:p-16 rounded-[3rem] text-center max-w-4xl w-full relative z-10 border border-white/50 dark:border-white/10 shadow-2xl shadow-honey-500/10">
                <AdminEditBtn label="Edit Home" />
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="inline-block px-4 py-1 mb-6 rounded-full bg-honey-100 dark:bg-honey-900/50 text-honey-700 dark:text-honey-400 text-xs font-bold uppercase tracking-widest border border-honey-200 dark:border-honey-800">Premium Kenyan Honey</motion.div>
                <div className="flex justify-center mb-6"><StaggerText text={aboutInfo?.title || t('welcome')} className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-honey-600 via-honey-500 to-yellow-400 drop-shadow-sm" /></div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="text-lg md:text-2xl font-medium mb-10 max-w-2xl mx-auto text-gray-700 dark:text-gray-200 leading-relaxed">{aboutInfo?.content || t('subtitle')}</motion.p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Link to="/catalog"><motion.button whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(255, 191, 0, 0.4)" }} whileTap={{ scale: 0.95 }} className="bg-honey-500 text-white text-lg font-bold px-10 py-5 rounded-[2rem] shadow-xl relative overflow-hidden group"><span className="relative z-10 flex items-center gap-2">{t('shop')} Now <ChevronDown className="-rotate-90" size={20}/></span><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-[2rem]" /></motion.button></Link>
                    <Link to="/contact"><motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255, 0.8)" }} whileTap={{ scale: 0.95 }} className="bg-white/50 dark:bg-black/50 text-gray-800 dark:text-white text-lg font-bold px-10 py-5 rounded-[2rem] backdrop-blur-md border border-white/40 shadow-lg">Contact Us</motion.button></Link>
                </div>
            </motion.div>
        </div>
    );
};
// (Keep Catalog, Contact, Blog, FAQ, Privacy, Terms, Footer as they were...)
// I am including Catalog and Footer here to ensure the file is complete for you.
const Catalog = () => {
    const { products, addToCart, formatPrice, t, addProductReview } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("All");
    const [expandedProduct, setExpandedProduct] = useState(null); 
    const [newReview, setNewReview] = useState({ rating: 5, text: "" });
    const filteredProducts = products.filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleReviewSubmit = (e, id) => { e.preventDefault(); addProductReview(id, { user: "Guest User", ...newReview }); setNewReview({ rating: 5, text: "" }); };
    return (
      <div className="pt-32 px-4 max-w-7xl mx-auto pb-20 relative">
        <AdminEditBtn label="Manage Products" />
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between glass-panel p-4 rounded-[2rem]">
            <div className="relative w-full md:w-1/3"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" placeholder={t('search')} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none outline-none dark:text-white" onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">{["All", "Raw", "Creamed", "Infused"].map(cat => (<button key={cat} onClick={() => setCategory(cat)} className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${category === cat ? 'bg-honey-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{cat}</button>))}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map(product => {
              const avgRating = product.reviews.length ? (product.reviews.reduce((a,b)=>a+b.rating,0)/product.reviews.length).toFixed(1) : "New";
              return (
                <motion.div layout whileHover={{ y: -10 }} key={product.id} className="glass-card p-4 rounded-[2.5rem] flex flex-col h-full group">
                  <div className="relative overflow-hidden rounded-[2rem] mb-4"><img src={product.image} alt={product.name} className="w-full h-64 object-cover transition duration-700 group-hover:scale-110"/><span className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star size={12} className="text-orange-500 fill-orange-500"/> {avgRating}</span></div>
                  <div className="flex justify-between items-start mb-2"><div><h3 className="text-xl font-bold dark:text-white">{product.name}</h3><p className="text-xs text-gray-500 uppercase font-bold tracking-wide">{product.category}</p></div><span className="text-honey-600 dark:text-honey-400 font-black text-lg">{formatPrice(product.price)}</span></div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-2">{product.desc}</p>
                  <div className="flex gap-2 mt-auto"><button onClick={() => addToCart(product.id)} className="flex-1 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-80 transition shadow-lg">{t('addToCart')}</button><button onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)} className="p-3 bg-honey-100 dark:bg-gray-800 text-honey-600 rounded-xl font-bold">{expandedProduct === product.id ? "Close" : "Review"}</button></div>
                  <AnimatePresence>{expandedProduct === product.id && (<motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:"auto"}} exit={{opacity:0, height:0}} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"><form onSubmit={(e) => handleReviewSubmit(e, product.id)} className="mb-4"><div className="flex gap-2 mb-2">{[1,2,3,4,5].map(star => (<Star key={star} size={16} className={`cursor-pointer ${star <= newReview.rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`} onClick={() => setNewReview({...newReview, rating: star})}/>))}</div><input className="w-full text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-none outline-none mb-2" placeholder="Describe the taste..." value={newReview.text} onChange={e=>setNewReview({...newReview, text: e.target.value})} required/><button className="text-xs bg-honey-500 text-white px-3 py-1 rounded-lg font-bold">Submit</button></form><div className="max-h-32 overflow-y-auto space-y-2">{product.reviews.map((r, i) => (<div key={i} className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"><div className="flex justify-between items-center"><span className="text-xs font-bold dark:text-white">{r.user}</span><span className="text-[10px] flex items-center text-orange-400"><Star size={8} fill="currentColor"/> {r.rating}</span></div><p className="text-xs text-gray-600 dark:text-gray-300">{r.text}</p></div>))}</div></motion.div>)}</AnimatePresence>
                </motion.div>
              );
          })}
        </div>
      </div>
    );
};
const Contact = () => {
    const { contactInfo } = useContext(StoreContext);
    return (
      <div className="pt-32 px-4 max-w-4xl mx-auto pb-20 relative">
        <div className="glass-panel p-10 rounded-[3rem] relative">
          <AdminEditBtn label="Edit Contact" />
          <h2 className="text-4xl font-bold text-center mb-8 dark:text-white">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
               <h3 className="text-2xl font-bold mb-4 dark:text-white">Visit Us</h3>
               <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">{contactInfo.address}</p>
               <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" className="flex items-center gap-3 bg-green-500 text-white p-4 rounded-2xl font-bold mb-4 shadow-lg hover:scale-105 transition cursor-pointer"><Phone /> WhatsApp Us</a>
               <div className="flex items-center gap-3 bg-honey-500 text-white p-4 rounded-2xl font-bold shadow-lg"><Mail /> {contactInfo.email}</div>
               <div className="mt-4 font-bold text-honey-700 dark:text-honey-400">Call: {contactInfo.phone}</div>
            </div>
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="p-4 rounded-2xl bg-white/50 dark:bg-black/50 border-none outline-none focus:ring-2 ring-honey-500 dark:text-white"/>
              <textarea placeholder="Message" rows="4" className="p-4 rounded-2xl bg-white/50 dark:bg-black/50 border-none outline-none focus:ring-2 ring-honey-500 dark:text-white"></textarea>
              <button className="bg-honey-700 text-white font-bold py-4 rounded-2xl hover:bg-honey-800 transition">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    );
};
const Blog = () => {
    const { blogs, addComment } = useContext(StoreContext);
    const [commentInputs, setCommentInputs] = useState({});
    const handleCommentSubmit = (blogId, e) => { e.preventDefault(); if(commentInputs[blogId]) { addComment(blogId, commentInputs[blogId]); setCommentInputs({...commentInputs, [blogId]: ""}); } };
    return (
        <div className="pt-32 px-4 max-w-5xl mx-auto pb-20 relative">
            <AdminEditBtn label="Manage Blogs" />
            <h2 className="text-4xl font-bold text-center mb-10 dark:text-white">Honey Tales 🍯</h2>
            <div className="space-y-12">
                {blogs.map(blog => (
                    <div key={blog.id} className="glass-panel p-8 rounded-[3rem]">
                        {blog.image && <img src={blog.image} className="w-full h-64 object-cover rounded-[2rem] mb-6" alt="blog" />}
                        <div className="flex justify-between text-sm text-gray-500 mb-2"><span>{blog.date}</span></div>
                        <h3 className="text-3xl font-bold mb-4 dark:text-honey-400">{blog.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">{blog.content}</p>
                        <div className="bg-white/50 dark:bg-black/40 p-6 rounded-2xl">
                            <h4 className="font-bold mb-4 dark:text-white">Comments ({blog.comments.length})</h4>
                            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">{blog.comments.map((c, i) => <p key={i} className="text-sm bg-white dark:bg-gray-800 p-2 rounded-lg dark:text-gray-300">{c}</p>)}</div>
                            <form onSubmit={(e) => handleCommentSubmit(blog.id, e)} className="flex gap-2"><input type="text" placeholder="Write a comment..." className="flex-1 p-3 rounded-xl border-none outline-none dark:bg-gray-800 dark:text-white" value={commentInputs[blog.id] || ""} onChange={(e) => setCommentInputs({...commentInputs, [blog.id]: e.target.value})}/><button className="bg-honey-500 text-white px-4 rounded-xl font-bold">Post</button></form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
const FAQ = () => {
  const { legalInfo } = useContext(StoreContext);
  const [activeIndex, setActiveIndex] = useState(null);
  const faqs = legalInfo?.faqs || [];
  return (
    <div className="pt-32 px-4 max-w-3xl mx-auto pb-20 relative">
      <div className="glass-panel p-6 rounded-[2rem] mb-6 relative">
          <AdminEditBtn label="Edit FAQs" />
          <div className="text-center">
            <div className="w-16 h-16 bg-honey-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-honey-600"><HelpCircle size={32} /></div>
            <h1 className="text-4xl font-black dark:text-white">Freq. Asked Questions</h1>
          </div>
      </div>
      <div className="space-y-4">
        {faqs.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel overflow-hidden rounded-[2rem]">
            <button onClick={() => setActiveIndex(activeIndex === i ? null : i)} className="w-full flex justify-between items-center p-6 text-left font-bold text-lg dark:text-white hover:bg-white/30 dark:hover:bg-white/10 transition">{item.q}{activeIndex === i ? <ChevronUp className="text-honey-500"/> : <ChevronDown className="text-gray-400"/>}</button>
            <AnimatePresence>{activeIndex === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white/40 dark:bg-black/20"><p className="p-6 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed">{item.a}</p></motion.div>)}</AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
const Privacy = () => {
    const { legalInfo } = useContext(StoreContext);
    return (
      <div className="pt-32 px-4 max-w-4xl mx-auto pb-20 relative">
        <div className="glass-panel p-8 md:p-12 rounded-[3rem] relative">
          <AdminEditBtn label="Edit Privacy Policy" />
          <div className="flex items-center gap-4 mb-8"><Shield size={40} className="text-honey-600"/><h1 className="text-3xl md:text-4xl font-black dark:text-white">Privacy Notice</h1></div>
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{legalInfo?.privacy || "Content loading..."}</div>
        </div>
      </div>
    );
};
const Terms = () => {
    const { legalInfo } = useContext(StoreContext);
    return (
      <div className="pt-32 px-4 max-w-4xl mx-auto pb-20 relative">
        <div className="glass-panel p-8 md:p-12 rounded-[3rem] relative">
          <AdminEditBtn label="Edit Terms" />
          <div className="flex items-center gap-4 mb-8"><FileText size={40} className="text-honey-600"/><h1 className="text-3xl md:text-4xl font-black dark:text-white">Terms of Service</h1></div>
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{legalInfo?.terms || "Content loading..."}</div>
        </div>
      </div>
    );
};
const Footer = () => (
  <footer className="mt-auto pt-10 pb-6 px-4">
    <div className="glass-panel rounded-[2.5rem] p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2"><h2 className="text-2xl font-black text-honey-600 dark:text-honey-400 mb-4">🍯 HoneyZest</h2><p className="text-gray-600 dark:text-gray-400 max-w-xs">Premium organic honey from Eldoret to the world.</p></div>
        <div><h4 className="font-bold mb-4 dark:text-white">Explore</h4><ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400"><li><Link to="/catalog" className="hover:text-honey-500">Shop</Link></li><li><Link to="/blog" className="hover:text-honey-500">Blog</Link></li><li><Link to="/about" className="hover:text-honey-500">About Us</Link></li></ul></div>
        <div><h4 className="font-bold mb-4 dark:text-white">Help & Legal</h4><ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400"><li><Link to="/faq" className="hover:text-honey-500">FAQs</Link></li><li><Link to="/privacy" className="hover:text-honey-500">Privacy Policy</Link></li><li><Link to="/terms" className="hover:text-honey-500">Terms & Conditions</Link></li></ul></div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"><p className="text-xs text-gray-500">© 2025 HoneyZest Kenya.</p><div className="flex gap-4"><Facebook size={20} className="text-gray-400 hover:text-honey-600 cursor-pointer"/><Instagram size={20} className="text-gray-400 hover:text-honey-600 cursor-pointer"/><Twitter size={20} className="text-gray-400 hover:text-honey-600 cursor-pointer"/></div></div>
    </div>
  </footer>
);

// --- MAIN APP ---

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, mouseMultiplier: 1, smoothTouch: false });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col">
       <ToastContainer toastStyle={{ borderRadius: "1rem", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }} />
       
       {/* --- NEW CSS SNOW OVERLAY (No Install Needed) --- */}
       <SnowOverlay />
       
       <div className="fixed inset-0 z-[-1] overflow-hidden">
            <iframe
                className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
                src="https://www.youtube.com/embed/J7gqF691kSQ?autoplay=1&mute=1&loop=1&playlist=J7gqF691kSQ&controls=0&showinfo=0&rel=0"
                title="Honey Background"
                allow="autoplay; encrypted-media" 
            ></iframe>
            <div className="absolute inset-0 bg-white/40 dark:bg-black/70 backdrop-blur-[2px]"></div>
       </div>
       <Navbar />
       <div className="flex-grow">
         <AnimatePresence mode="wait">
           <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/catalog" element={<PageWrapper><Catalog /></PageWrapper>} />
              <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
              <Route path="/auth" element={<PageWrapper><AuthPage /></PageWrapper>} />
              <Route path="/profile" element={<PageWrapper><UserProfile /></PageWrapper>} />
              <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
           </Routes>
         </AnimatePresence>
       </div>
       <Footer />
    </div>
  );
};

export default App;