import React, { useState, useContext } from 'react';
import { StoreContext } from './StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Hexagon } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const { login, register } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isLogin) {
            // --- LOGIN LOGIC ---
            const success = login(formData.email, formData.password);
            if (success) {
                // Check if it is the Admin
                if (formData.email === "admin@honeyzest.com") {
                    navigate('/admin'); // Go to Admin Panel
                } else {
                    navigate('/profile'); // Go to User Dashboard
                }
            }
        } else {
            // --- REGISTER LOGIC ---
            const success = register(formData.name, formData.email, formData.password);
            if (success) {
                navigate('/profile'); // New users go to profile
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden pt-20">
            {/* Background Floating Elements */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 left-10 text-honey-300/20">
                <Hexagon size={120} strokeWidth={1} />
            </motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-20 right-10 text-honey-300/20">
                <Hexagon size={180} strokeWidth={1} />
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="glass-panel p-8 md:p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/30">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-honey-600 dark:text-honey-400 mb-2">
                            {isLogin ? "Welcome Back" : "Join the Hive"}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-300">
                            {isLogin ? "Access your dashboard" : "Experience premium honey"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {!isLogin && (
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-honey-500 transition" size={20} />
                                <input 
                                    name="name" type="text" placeholder="Full Name" required
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-black/40 border-none outline-none focus:ring-2 ring-honey-400 transition placeholder-gray-400 dark:text-white"
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-honey-500 transition" size={20} />
                            <input 
                                name="email" type="email" placeholder="Email Address" required
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-black/40 border-none outline-none focus:ring-2 ring-honey-400 transition placeholder-gray-400 dark:text-white"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-honey-500 transition" size={20} />
                            <input 
                                name="password" type="password" placeholder="Password" required
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/50 dark:bg-black/40 border-none outline-none focus:ring-2 ring-honey-400 transition placeholder-gray-400 dark:text-white"
                                onChange={handleChange}
                            />
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-honey-500 to-yellow-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-honey-500/40 transition flex items-center justify-center gap-2 mt-4"
                        >
                            {isLogin ? "Login" : "Create Account"} <ArrowRight size={20} />
                        </motion.button>
                    </form>

                    {/* Toggle */}
                    <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
                        {isLogin ? "New to HoneyZest?" : "Already a member?"} 
                        <button onClick={() => setIsLogin(!isLogin)} className="text-honey-600 font-bold ml-2 hover:underline">
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;