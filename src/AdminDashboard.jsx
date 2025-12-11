import React, { useContext, useState } from 'react';
import { StoreContext } from './StoreContext';
import { 
    Plus, Trash, Edit, Save, Settings, BookOpen, Package, 
    X, HelpCircle, Shield, FileText, BarChart, CheckCircle, 
    MessageSquare, LogOut, Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// --- FIREBASE IMPORTS ---
import { db } from './firebase'; 
import { doc, deleteDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

const AdminDashboard = () => {
    const { 
        products, saveProduct, deleteProduct, 
        saveContent, 
        blogs, users, orders,
        contactInfo, setContactInfo,
        aboutInfo, setAboutInfo,
        legalInfo, setLegalInfo,
        currentUser, logout, formatPrice 
    } = useContext(StoreContext);
    
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Form States
    const [prodForm, setProdForm] = useState({ id: null, name: "", price: "", desc: "", image: "", category: "Raw" });
    const [blogForm, setBlogForm] = useState({ id: null, title: "", content: "", image: "" });
    const [newFaq, setNewFaq] = useState({ q: "", a: "" });
    const [isEditing, setIsEditing] = useState(false);

    // Security Check
    if (!currentUser || (currentUser.role !== 'Administrator' && currentUser.role !== 'admin')) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20">
                <h1 className="text-3xl font-black text-red-500 mb-4">Access Denied 🛑</h1>
                <p className="text-gray-600 mb-6">You do not have administrator privileges.</p>
                <button onClick={() => navigate('/auth')} className="bg-honey-500 text-white px-6 py-3 rounded-xl font-bold">Login as Admin</button>
            </div>
        );
    }

    // --- ACTIONS ---

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // 1. USERS
    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to remove this member permanently?")) {
            try {
                await deleteDoc(doc(db, "users", id));
                toast.success("User deleted");
            } catch (error) {
                toast.error("Error deleting user: " + error.message);
            }
        }
    };

    // 2. PRODUCTS
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: prodForm.name,
            price: Number(prodForm.price),
            desc: prodForm.desc,
            image: prodForm.image,
            category: prodForm.category,
            reviews: prodForm.reviews || [] 
        };

        if (isEditing && prodForm.id) {
            productData.id = prodForm.id;
        }

        await saveProduct(productData);
        setProdForm({ id: null, name: "", price: "", desc: "", image: "", category: "Raw" });
        setIsEditing(false);
    };

    const handleDeleteProduct = async (id) => {
        if(window.confirm("Delete this product permanently?")) {
            await deleteProduct(id);
        }
    };

    const handleDeleteReview = async (product, reviewIndex) => {
        if(window.confirm("Delete this review?")) {
            const updatedReviews = product.reviews.filter((_, i) => i !== reviewIndex);
            await updateDoc(doc(db, "products", product.id), { reviews: updatedReviews });
            toast.success("Review deleted");
        }
    };

    // 3. BLOGS
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        const blogData = {
            title: blogForm.title,
            content: blogForm.content,
            image: blogForm.image,
            date: blogForm.date || new Date().toISOString().split('T')[0],
            comments: blogForm.comments || []
        };

        try {
            if (isEditing && blogForm.id) {
                await updateDoc(doc(db, "blogs", blogForm.id), blogData);
                toast.success("Blog Updated");
            } else {
                await addDoc(collection(db, "blogs"), blogData);
                toast.success("Blog Published");
            }
            setBlogForm({ id: null, title: "", content: "", image: "" });
            setIsEditing(false);
        } catch (error) {
            toast.error("Error saving blog");
        }
    };

    const handleDeleteBlog = async (id) => {
        if(window.confirm("Delete this post?")) {
            await deleteDoc(doc(db, "blogs", id));
            toast.success("Blog deleted");
        }
    };

    // 4. LEGAL & INFO
    const handleAddFaq = async (e) => {
        e.preventDefault();
        const currentFaqs = legalInfo?.faqs || [];
        const updatedFaqs = [...currentFaqs, { ...newFaq, id: Date.now() }];
        await saveContent("legal", { ...legalInfo, faqs: updatedFaqs });
        setNewFaq({ q: "", a: "" });
    };

    const handleDeleteFaq = async (faqId) => {
        const currentFaqs = legalInfo?.faqs || [];
        const updatedFaqs = currentFaqs.filter(f => f.id !== faqId);
        await saveContent("legal", { ...legalInfo, faqs: updatedFaqs });
    };

    const handleUpdateInfo = async (type, data) => {
        await saveContent(type, data);
    };

    // 5. ORDERS
    const toggleOrderStatus = async (order) => {
        const newStatus = order.status === "Pending" ? "Delivered" : "Pending";
        await updateDoc(doc(db, "orders", order.id), { status: newStatus });
        toast.success(`Order marked as ${newStatus}`);
    };

    // Styles
    const inputStyle = "w-full p-4 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 ring-honey-500 transition-colors mb-4";
    const labelStyle = "block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300";
    const tabStyle = (tab) => `px-6 py-3 rounded-full font-bold capitalize transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-honey-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800'}`;

    return (
        <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
            <div className="glass-panel p-6 md:p-8 rounded-[3rem] min-h-[80vh]">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-honey-700 dark:text-honey-400 flex items-center gap-2">🐝 Admin <span className="text-gray-800 dark:text-white">Panel</span></h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-500 hidden md:block">Hi, {currentUser.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-200 transition"><LogOut size={16}/> Logout</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                    <button onClick={() => setActiveTab('overview')} className={tabStyle('overview')}><BarChart size={18}/> Overview</button>
                    <button onClick={() => setActiveTab('shop')} className={tabStyle('shop')}><Package size={18}/> Shop</button>
                    <button onClick={() => setActiveTab('blog')} className={tabStyle('blog')}><BookOpen size={18}/> Blog</button>
                    <button onClick={() => setActiveTab('users')} className={tabStyle('users')}><Users size={18}/> Members</button>
                    <button onClick={() => setActiveTab('orders')} className={tabStyle('orders')}><CheckCircle size={18}/> Orders</button>
                    <button onClick={() => setActiveTab('info')} className={tabStyle('info')}><Settings size={18}/> Site Info</button>
                    <button onClick={() => setActiveTab('legal')} className={tabStyle('legal')}><Shield size={18}/> Legal & Help</button>
                </div>

                <AnimatePresence mode='wait'>
                    
                    {/* 1. OVERVIEW */}
                    {activeTab === 'overview' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="overview" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-honey-100 dark:bg-gray-800 p-8 rounded-[2.5rem]">
                                <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2">Total Members</h3>
                                <p className="text-5xl font-black text-honey-600">{users.length}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-gray-800 p-8 rounded-[2.5rem]">
                                <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2">Total Products</h3>
                                <p className="text-5xl font-black text-blue-600">{products.length}</p>
                            </div>
                            <div className="bg-green-100 dark:bg-gray-800 p-8 rounded-[2.5rem]">
                                <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2">Active Orders</h3>
                                <p className="text-5xl font-black text-green-600">{orders.length}</p>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. SHOP */}
                    {activeTab === 'shop' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="shop">
                            <form onSubmit={handleProductSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] mb-8">
                                <h3 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? "Edit Product" : "Add New Honey"}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input required placeholder="Name" className={inputStyle} value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                                    <input required type="number" placeholder="Price" className={inputStyle} value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                                    <select className={inputStyle} value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                                        <option value="Raw">Raw Honey</option>
                                        <option value="Creamed">Creamed Honey</option>
                                        <option value="Infused">Infused Honey</option>
                                    </select>
                                    <input placeholder="Image URL" className={inputStyle} value={prodForm.image} onChange={e => setProdForm({...prodForm, image: e.target.value})} />
                                    <textarea placeholder="Description" className={`${inputStyle} md:col-span-2`} rows="3" value={prodForm.desc} onChange={e => setProdForm({...prodForm, desc: e.target.value})} />
                                </div>
                                <div className="mt-6 flex gap-4">
                                    <button type="submit" className="flex-1 bg-honey-600 text-white py-3 rounded-xl font-bold hover:bg-honey-700 transition flex justify-center gap-2">{isEditing ? <Save /> : <Plus />} {isEditing ? "Update" : "Add Product"}</button>
                                    {isEditing && <button type="button" onClick={() => {setIsEditing(false); setProdForm({id:null, name:"", price:"", desc:"", image:"", category:"Raw"})}} className="px-6 bg-red-500 text-white rounded-xl font-bold"><X /></button>}
                                </div>
                            </form>
                            
                            <div className="space-y-6">
                                {products.map(p => (
                                    <div key={p.id} className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex gap-4 items-center">
                                                <img src={p.image} className="w-16 h-16 rounded-2xl object-cover" alt=""/>
                                                <div><h4 className="font-bold text-lg dark:text-white">{p.name}</h4><p className="text-xs text-honey-600">{formatPrice(p.price)}</p></div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => {setIsEditing(true); setProdForm(p); window.scrollTo(0,0);}} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit size={16}/></button>
                                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash size={16}/></button>
                                            </div>
                                        </div>
                                        {p.reviews && p.reviews.length > 0 && (
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mt-2">
                                                <h5 className="text-xs font-bold uppercase text-gray-400 mb-2 flex items-center gap-2"><MessageSquare size={12}/> Reviews ({p.reviews.length})</h5>
                                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                                    {p.reviews.map((r, i) => (
                                                        <div key={i} className="flex justify-between text-xs border-b border-gray-200 dark:border-gray-700 pb-1 last:border-0">
                                                            <span className="dark:text-gray-300">"{r.text}" - <span className="font-bold">{r.user}</span></span>
                                                            <button onClick={() => handleDeleteReview(p, i)} className="text-red-500 hover:underline">Delete</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 3. BLOG */}
                    {activeTab === 'blog' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="blog">
                            <form onSubmit={handleBlogSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] mb-8">
                                <h3 className="text-xl font-bold mb-4 dark:text-white">{isEditing ? "Edit Blog" : "New Post"}</h3>
                                <div className="grid gap-4">
                                    <input required placeholder="Title" className={inputStyle} value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                                    <textarea required placeholder="Content" className={inputStyle} rows="6" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                                    <input placeholder="Cover Image URL" className={inputStyle} value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                                </div>
                                <button type="submit" className="mt-6 w-full bg-honey-600 text-white py-3 rounded-xl font-bold hover:bg-honey-700 transition">{isEditing ? "Update Post" : "Publish Post"}</button>
                            </form>
                            <div className="space-y-4">
                                {blogs.map(b => (
                                    <div key={b.id} className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <span className="font-bold dark:text-white">{b.title}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => {setBlogForm(b); setIsEditing(true); window.scrollTo(0,0);}} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit size={16}/></button>
                                            <button onClick={() => handleDeleteBlog(b.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. USERS */}
                    {activeTab === 'users' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="users">
                            <h3 className="text-2xl font-bold mb-6 dark:text-white">Registered Members</h3>
                            <div className="bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800">
                                {users.map(u => (
                                    <div key={u.id} className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${u.role === 'Administrator' ? 'bg-honey-500' : 'bg-gray-400'}`}>
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold dark:text-white">{u.name} {u.role === 'Administrator' && <span className="text-xs bg-honey-100 text-honey-600 px-2 py-0.5 rounded-full ml-2">Admin</span>}</h4>
                                                <p className="text-sm text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                        {u.role !== 'Administrator' && (
                                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash size={18}/></button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 5. ORDERS */}
                    {activeTab === 'orders' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="orders">
                            <h3 className="text-2xl font-bold mb-6 dark:text-white">Customer Orders</h3>
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center border border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h4 className="font-bold text-lg dark:text-white">{order.customer}</h4>
                                            <p className="text-sm text-gray-500">{order.items}</p>
                                            <p className="font-bold text-honey-600">{formatPrice(order.total)}</p>
                                        </div>
                                        <button 
                                            onClick={() => toggleOrderStatus(order)}
                                            className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                        >
                                            {order.status}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 6. INFO */}
                    {activeTab === 'info' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="info" className="space-y-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><Settings size={20}/> Contact Info</h3>
                                    <button onClick={() => handleUpdateInfo("contact", contactInfo)} className="bg-honey-500 text-white px-4 py-2 rounded-lg font-bold text-xs"><Save size={14}/> Save Changes</button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><label className={labelStyle}>Phone</label><input className={inputStyle} value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} /></div>
                                    <div><label className={labelStyle}>WhatsApp</label><input className={inputStyle} value={contactInfo.whatsapp} onChange={e => setContactInfo({...contactInfo, whatsapp: e.target.value})} /></div>
                                    <div><label className={labelStyle}>Email</label><input className={inputStyle} value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} /></div>
                                    <div><label className={labelStyle}>Address</label><input className={inputStyle} value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} /></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><BookOpen size={20}/> About Content</h3>
                                    <button onClick={() => handleUpdateInfo("about", aboutInfo)} className="bg-honey-500 text-white px-4 py-2 rounded-lg font-bold text-xs"><Save size={14}/> Save Changes</button>
                                </div>
                                <div><label className={labelStyle}>Title</label><input className={`${inputStyle} mb-4`} value={aboutInfo.title} onChange={e => setAboutInfo({...aboutInfo, title: e.target.value})} /></div>
                                <div><label className={labelStyle}>Story</label><textarea className={inputStyle} rows="5" value={aboutInfo.content} onChange={e => setAboutInfo({...aboutInfo, content: e.target.value})} /></div>
                            </div>
                        </motion.div>
                    )}

                    {/* 7. LEGAL (FIXED & COMPLETED) */}
                    {activeTab === 'legal' && (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} key="legal" className="space-y-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem]">
                                <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2"><HelpCircle size={20}/> FAQs</h3>
                                <form onSubmit={handleAddFaq} className="flex flex-col md:flex-row gap-4 mb-6">
                                    <input placeholder="Question" required className={inputStyle} value={newFaq.q} onChange={e => setNewFaq({...newFaq, q: e.target.value})} />
                                    <input placeholder="Answer" required className={inputStyle} value={newFaq.a} onChange={e => setNewFaq({...newFaq, a: e.target.value})} />
                                    <button className="bg-green-500 text-white px-6 rounded-xl font-bold"><Plus/></button>
                                </form>
                                <div className="space-y-2">
                                    {legalInfo?.faqs && legalInfo.faqs.map((f, i) => (
                                        <div key={i} className="bg-white dark:bg-gray-900 p-3 rounded-xl flex justify-between items-center">
                                            <div><p className="font-bold text-sm dark:text-white">{f.q}</p><p className="text-xs text-gray-500">{f.a}</p></div>
                                            <button onClick={() => handleDeleteFaq(f.id)} className="text-red-500"><Trash size={16}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Privacy Policy */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><Shield size={20}/> Privacy Policy</h3>
                                    <button onClick={() => handleUpdateInfo("legal", legalInfo)} className="bg-honey-500 text-white px-4 py-2 rounded-lg font-bold text-xs"><Save size={14}/> Save</button>
                                </div>
                                <textarea className={inputStyle} rows="6" value={legalInfo?.privacy || ""} onChange={e => setLegalInfo({...legalInfo, privacy: e.target.value})} />
                            </div>

                            {/* Terms */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-2"><FileText size={20}/> Terms & Conditions</h3>
                                    <button onClick={() => handleUpdateInfo("legal", legalInfo)} className="bg-honey-500 text-white px-4 py-2 rounded-lg font-bold text-xs"><Save size={14}/> Save</button>
                                </div>
                                <textarea className={inputStyle} rows="6" value={legalInfo?.terms || ""} onChange={e => setLegalInfo({...legalInfo, terms: e.target.value})} />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;