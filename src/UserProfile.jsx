import React, { useContext, useState } from 'react';
import { StoreContext } from './StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
    User, Package, Heart, Bell, LogOut, Settings, 
    Calendar, ShieldAlert, ShieldCheck 
} from 'lucide-react';

const UserProfile = () => {
    const { 
        currentUser, logout, orders, products, favorites, 
        notifications, markNotificationRead, toggleFavorite, formatPrice 
    } = useContext(StoreContext);
    
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // --- 1. HANDLE UNAUTHORIZED ACCESS (Guard Clause) ---
    if (!currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
                <div className="glass-panel p-10 rounded-[2rem] text-center max-w-md w-full border-red-100 dark:border-red-900/30">
                    <ShieldAlert size={60} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-black mb-2 dark:text-white">Access Restricted</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        This area is for Administrators only.
                    </p>
                    <Link to="/auth" className="block w-full bg-gray-900 dark:bg-honey-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                        Admin Login
                    </Link>
                </div>
            </div>
        );
    }

    const allOrders = orders || []; // Safety fallback
    const myFavorites = products.filter(p => favorites?.includes(p.id)) || [];
    const unreadNotifs = notifications?.filter(n => !n.read).length || 0;

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to Home after logout
    };

    const TabButton = ({ id, icon: Icon, label, count }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-300 ${
                activeTab === id 
                ? 'bg-honey-500 text-white shadow-lg shadow-honey-500/30' 
                : 'hover:bg-white/50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
        >
            <Icon size={20} />
            <span className="font-bold flex-1 text-left">{label}</span>
            {count > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {count}
                </span>
            )}
        </button>
    );

    return (
        <div className="pt-32 px-4 max-w-7xl mx-auto pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* LEFT SIDEBAR */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-[2.5rem] sticky top-32">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black dark:from-honey-400 dark:to-honey-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-xl font-black dark:text-white">{currentUser.name}</h2>
                            <p className="text-xs bg-honey-100 text-honey-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-2">
                                {currentUser.role}
                            </p>
                        </div>

                        <nav className="space-y-2">
                            <TabButton id="overview" icon={User} label="Overview" />
                            <TabButton id="orders" icon={Package} label="Store Orders" count={allOrders.length} />
                            <TabButton id="favorites" icon={Heart} label="Pinned Items" count={myFavorites.length} />
                            <TabButton id="notifications" icon={Bell} label="System Alerts" count={unreadNotifs} />
                            
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-bold"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            
                            {/* --- OVERVIEW TAB --- */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-4 bg-orange-100/50 dark:bg-orange-900/20">
                                            <div className="p-3 bg-orange-500 text-white rounded-full"><Package /></div>
                                            <div><p className="text-2xl font-black dark:text-white">{allOrders.length}</p><p className="text-xs text-gray-500 uppercase font-bold">Total Orders</p></div>
                                        </div>
                                        <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-4 bg-pink-100/50 dark:bg-pink-900/20">
                                            <div className="p-3 bg-pink-500 text-white rounded-full"><Heart /></div>
                                            <div><p className="text-2xl font-black dark:text-white">{favorites?.length || 0}</p><p className="text-xs text-gray-500 uppercase font-bold">Favorites</p></div>
                                        </div>
                                        <div className="glass-panel p-6 rounded-[2rem] flex items-center gap-4 bg-blue-100/50 dark:bg-blue-900/20">
                                            <div className="p-3 bg-blue-500 text-white rounded-full"><Bell /></div>
                                            <div><p className="text-2xl font-black dark:text-white">{notifications?.length || 0}</p><p className="text-xs text-gray-500 uppercase font-bold">System Alerts</p></div>
                                        </div>
                                    </div>

                                    <div className="glass-panel p-8 rounded-[2.5rem]">
                                        <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2"><Settings size={20}/> Admin Profile</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Administrator Name</label>
                                                <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl font-bold dark:text-gray-200 border border-gray-100 dark:border-gray-800">{currentUser.name}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Contact Email</label>
                                                <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl font-bold dark:text-gray-200 border border-gray-100 dark:border-gray-800">{currentUser.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- ORDERS TAB --- */}
                            {activeTab === 'orders' && (
                                <div className="glass-panel p-8 rounded-[2.5rem]">
                                    <h3 className="text-xl font-bold mb-6 dark:text-white">Recent Customer Orders</h3>
                                    {allOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {allOrders.map((order) => (
                                                <div key={order.id} className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="font-black text-honey-600 dark:text-honey-400">#{order.id}</span>
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.status}</span>
                                                        </div>
                                                        <div className="flex gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
                                                            <span>Customer:</span>
                                                            <span className="text-honey-600">{order.customer}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.items}</p>
                                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={12}/> {order.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black dark:text-white">{formatPrice(order.total)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <Package size={48} className="mx-auto text-gray-300 mb-4"/>
                                            <p className="text-gray-500">No orders placed yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- FAVORITES TAB --- */}
                            {activeTab === 'favorites' && (
                                <div>
                                    <h3 className="text-xl font-bold mb-6 dark:text-white ml-2">Pinned Products</h3>
                                    {myFavorites.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {myFavorites.map(product => (
                                                <div key={product.id} className="glass-panel p-4 rounded-[2rem] flex gap-4 group">
                                                    <img src={product.image} className="w-24 h-24 object-cover rounded-2xl" alt={product.name} />
                                                    <div className="flex flex-col justify-center flex-1">
                                                        <h4 className="font-bold dark:text-white">{product.name}</h4>
                                                        <p className="text-honey-600 font-bold text-sm">{formatPrice(product.price)}</p>
                                                        <div className="mt-auto flex gap-2">
                                                            <button onClick={() => toggleFavorite(product.id)} className="text-xs bg-red-100 text-red-500 px-3 py-1 rounded-lg font-bold hover:bg-red-200">Unpin</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-panel p-10 rounded-[2.5rem] text-center">
                                            <Heart size={48} className="mx-auto text-gray-300 mb-4"/>
                                            <p className="text-gray-500">No items pinned.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* --- NOTIFICATIONS TAB --- */}
                             {activeTab === 'notifications' && (
                                <div className="glass-panel p-8 rounded-[2.5rem]">
                                    <h3 className="text-xl font-bold mb-6 dark:text-white">System Logs</h3>
                                    <div className="space-y-4">
                                        {notifications?.map(notif => (
                                            <div 
                                                key={notif.id} 
                                                onClick={() => markNotificationRead(notif.id)}
                                                className={`p-4 rounded-2xl flex gap-4 cursor-pointer transition ${notif.read ? 'bg-transparent opacity-60' : 'bg-white/60 dark:bg-gray-800 shadow-sm border-l-4 border-honey-500'}`}
                                            >
                                                <div className="bg-honey-100 dark:bg-honey-900/30 p-2 rounded-full h-fit text-honey-600">
                                                    <Bell size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold dark:text-white">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1">{notif.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;