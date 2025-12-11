import React, { useContext } from 'react';
import { StoreContext } from './StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash, Plus, Minus, ArrowRight, ShoppingBag, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { 
        cart, 
        products, 
        addToCart, 
        removeFromCart, 
        formatPrice, 
        currency,
        contactInfo
    } = useContext(StoreContext);
    
    const navigate = useNavigate();

    // 1. Filter products that are actually in the cart
    const cartItems = products.filter(item => cart[item.id] > 0);

    // 2. Calculate Totals
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * cart[item.id]), 0);
    const shipping = subtotal > 5000 ? 0 : 300; // Free shipping if over 5000 KES (Logic example)
    const total = subtotal + shipping;

    // 3. Generate WhatsApp Order Message
    const handleWhatsAppCheckout = () => {
        let message = `*🐝 New HoneyZest Order!* \n\n`;
        cartItems.forEach(item => {
            message += `▫️ ${item.name} x ${cart[item.id]} - ${formatPrice(item.price * cart[item.id])}\n`;
        });
        message += `\n*Total: ${formatPrice(total)}*\n`;
        message += `\nPlease provide payment details.`;
        
        const url = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-40 px-4 flex flex-col items-center justify-center text-center min-h-[60vh]">
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    className="w-32 h-32 bg-honey-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6"
                >
                    <ShoppingBag size={48} className="text-honey-500" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Your Hive is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any sweetness yet.</p>
                <button onClick={() => navigate('/catalog')} className="bg-honey-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition">
                    Go to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="pt-32 px-4 max-w-6xl mx-auto pb-20">
            <h1 className="text-4xl font-bold mb-8 pl-4 dark:text-white">Your Basket</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* --- LEFT: CART ITEMS --- */}
                <div className="flex-1 space-y-4">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div 
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="glass-panel p-4 rounded-[2rem] flex items-center gap-4 relative overflow-hidden"
                            >
                                {/* Image */}
                                <div className="w-24 h-24 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg dark:text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                    <p className="text-honey-600 font-bold">{formatPrice(item.price)}</p>
                                </div>

                                {/* Controls */}
                                <div className="flex flex-col items-center gap-2 bg-honey-50 dark:bg-gray-800 p-2 rounded-2xl">
                                    <button onClick={() => addToCart(item.id)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-sm hover:text-honey-600">
                                        <Plus size={16} />
                                    </button>
                                    <span className="font-bold text-sm dark:text-white">{cart[item.id]}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-sm hover:text-red-500">
                                        {cart[item.id] === 1 ? <Trash size={14} /> : <Minus size={16} />}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* --- RIGHT: SUMMARY --- */}
                <div className="lg:w-96">
                    <div className="glass-panel p-8 rounded-[2.5rem] sticky top-32">
                        <h2 className="text-2xl font-bold mb-6 dark:text-white">Summary</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Delivery Fee</span>
                                <span>{shipping === 0 ? <span className="text-green-500 font-bold">Free</span> : formatPrice(shipping)}</span>
                            </div>
                            <div className="h-px bg-gray-300 dark:bg-gray-700 my-4"></div>
                            <div className="flex justify-between text-xl font-black dark:text-white">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Buttons */}
                        <div className="space-y-3">
                            <button className="w-full bg-honey-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">
                                Checkout Now <ArrowRight size={20} />
                            </button>
                            
                            {/* WhatsApp Option (Very popular in Kenya) */}
                            <button onClick={handleWhatsAppCheckout} className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 transition flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Order via WhatsApp
                            </button>
                        </div>
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            Secure encrypted payments.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;