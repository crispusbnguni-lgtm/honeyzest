import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    // --- SETTINGS ---
    const [theme, setTheme] = useState("light");
    const [currency, setCurrency] = useState("KES"); 
    const [language, setLanguage] = useState("en"); 
    const [cart, setCart] = useState({});

    // --- AUTHENTICATION ---
    // In a real app, check localStorage here to persist login
    const [currentUser, setCurrentUser] = useState(null); 

    const [users, setUsers] = useState([
        { id: 1, name: "Admin User", email: "admin@honeyzest.com", password: "123", role: "admin" },
        { id: 2, name: "John Doe", email: "john@gmail.com", password: "123", role: "member" },
        { id: 3, name: "Sarah Smith", email: "sarah@gmail.com", password: "123", role: "member" }
    ]);

    // --- USER FEATURES ---
    const [favorites, setFavorites] = useState([]); // Array of Product IDs
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Welcome to HoneyZest! 🐝", date: new Date().toLocaleDateString(), read: false }
    ]);

    // --- TRANSLATIONS ---
    const translations = {
        en: { home: "Home", shop: "Shop", blog: "Blog", contact: "Contact", welcome: "Pure. Natural. Golden.", subtitle: "Premium organic honey from the heart of Eldoret.", addToCart: "Add to Cart", search: "Search products...", login: "Login", signup: "Sign Up", admin: "Admin" },
        sw: { home: "Nyumbani", shop: "Duka", blog: "Blogu", contact: "Wasiliana", welcome: "Safi. Asilia. Dhahabu.", subtitle: "Asali bora ya kienyeji kutoka nyanda za juu za Eldoret.", addToCart: "Weka Kikapuni", search: "Tafuta bidhaa...", login: "Ingia", signup: "Jisajili", admin: "Admin" },
        fr: { home: "Accueil", shop: "Boutique", blog: "Blog", contact: "Contact", welcome: "Pur. Naturel. Doré.", subtitle: "Miel biologique premium du cœur d'Eldoret.", addToCart: "Ajouter au panier", search: "Rechercher...", login: "Connexion", signup: "S'inscrire", admin: "Admin" }
    };

    const t = (key) => {
        if (translations[language] && translations[language][key]) {
            return translations[language][key];
        }
        return key; // Fallback to key if translation missing
    };

    // --- REALTIME RATES ---
    const exchangeRates = { KES: 1, USD: 0.0076, EUR: 0.0070, GBP: 0.0060 };
    const currencySymbols = { KES: 'KSh', USD: '$', EUR: '€', GBP: '£' };

    const formatPrice = (amountInKES) => {
        const rate = exchangeRates[currency];
        const value = (amountInKES * rate).toFixed(2);
        return `${currencySymbols[currency]} ${Number(value).toLocaleString()}`;
    };

    // --- DYNAMIC DATA (Admin Editable) ---
    
    // 1. Products
    const [products, setProducts] = useState([
        { id: 1, name: "Acacia Gold", price: 800, category: "Raw", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=80", desc: "Pure Acacia honey from Baringo.", reviews: [{ user: "Jane D.", rating: 5, text: "Best honey I've ever tasted!" }] },
        { id: 2, name: "Highland Cream", price: 1200, category: "Creamed", image: "https://images.unsplash.com/photo-1587049352851-8d4e8918dcf1?auto=format&fit=crop&w=500&q=80", desc: "Creamed honey from Eldoret highlands.", reviews: [] },
        { id: 3, name: "Comb Chunk", price: 1500, category: "Raw", image: "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=500&q=80", desc: "Raw honey with comb inside.", reviews: [] },
    ]);

    // 2. Blogs
    const [blogs, setBlogs] = useState([
        { id: 1, title: "Health Benefits", date: "2023-10-15", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62", content: "Raw honey is amazing...", comments: ["Great read!"] }
    ]);

    // 3. Site Information (Editable)
    const [contactInfo, setContactInfo] = useState({ 
        phone: "+254 716 490 014", 
        email: "honeyzest@gmail.com", 
        address: "Barng'etuny Plaza, Room 25, Eldoret", 
        whatsapp: "254716490014" 
    });
    
    const [aboutInfo, setAboutInfo] = useState({ 
        title: "Pure. Natural. Golden.", 
        content: "HoneyZest is dedicated to bringing you the finest organic honey." 
    });
    
    // 4. Legal Info (Combined for easier export)
    const [legalInfo, setLegalInfo] = useState({
        faqs: [
            { q: "Where is HoneyZest located?", a: "We are based in Eldoret, Kenya at Barng'etuny Plaza, Room 25." },
            { q: "Do you offer delivery?", a: "We arrange direct deliveries or parcel services upon payment." },
            { q: "Is the honey 100% organic?", a: "Yes! Our honey is sourced directly from local farmers in the Rift Valley." }
        ],
        privacy: `At HoneyZest, we value your privacy. We collect basic info for order processing only.`,
        terms: `By accessing HoneyZest, you agree to our terms. Honey is a natural product and may crystallize.`
    });

    // --- ORDER HISTORY ---
    const [orders, setOrders] = useState([
        { id: "ORD-001", customer: "John Doe", email: "john@gmail.com", total: 2400, status: "Pending", items: "Acacia Gold x 3", date: "2023-11-20" },
        { id: "ORD-002", customer: "Sarah Smith", email: "sarah@gmail.com", total: 1200, status: "Delivered", items: "Highland Cream x 1", date: "2023-11-18" }
    ]);

    // --- ACTIONS ---

    // Auth Logic
    const login = (email, password) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setCurrentUser(foundUser);
            toast.success(`Welcome back, ${foundUser.name}!`);
            addNotification(`Logged in successfully at ${new Date().toLocaleTimeString()}`);
            return true;
        } else {
            toast.error("Invalid email or password.");
            return false;
        }
    };

    const register = (name, email, password) => {
        if (users.find(u => u.email === email)) {
            toast.error("Email already registered.");
            return false;
        }
        const newUser = { id: Date.now(), name, email, password, role: "member" };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        addNotification("Welcome to the family! Complete your profile.");
        toast.success("Welcome to the Hive! 🐝");
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        setCart({});
        setFavorites([]);
        toast.info("Logged out successfully.");
    };

    // Cart Logic
    const addToCart = (itemId) => {
        setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        toast.success("Added to Hive! 🐝", { position: "bottom-right", theme: theme });
    };

    const removeFromCart = (itemId) => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) newCart[itemId] -= 1;
            else delete newCart[itemId];
            return newCart;
        });
    };

    // Checkout Logic
    const placeOrder = () => {
        if (!currentUser) {
            toast.error("Please login to checkout.");
            return false;
        }

        let totalAmount = 0;
        let itemDescription = [];
        for (const itemId in cart) {
            const item = products.find(p => p.id === Number(itemId));
            if (item) {
                totalAmount += item.price * cart[itemId];
                itemDescription.push(`${item.name} x ${cart[itemId]}`);
            }
        }

        if (totalAmount === 0) {
            toast.error("Your cart is empty.");
            return false;
        }

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            customer: currentUser.name,
            email: currentUser.email,
            total: totalAmount,
            status: "Pending",
            items: itemDescription.join(", "),
            date: new Date().toLocaleDateString()
        };

        setOrders([newOrder, ...orders]); 
        setCart({}); 
        addNotification(`Order #${newOrder.id} placed successfully!`);
        toast.success("Order Placed Successfully!");
        return true;
    };

    // Feature Logic
    const toggleFavorite = (productId) => {
        if (favorites.includes(productId)) {
            setFavorites(prev => prev.filter(id => id !== productId));
            toast.info("Removed from favorites");
        } else {
            setFavorites(prev => [...prev, productId]);
            toast.success("Added to favorites ❤️");
        }
    };

    const addNotification = (message) => {
        const newNotif = { id: Date.now(), message, date: new Date().toLocaleDateString(), read: false };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
    };

    // Misc Actions
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
        document.documentElement.classList.toggle('dark');
    };

    const addProductReview = (productId, review) => {
        setProducts(products.map(p => p.id === productId ? { ...p, reviews: [...p.reviews, review] } : p));
        toast.success("Review Submitted!");
    };

    const deleteReview = (productId, reviewIndex) => {
        setProducts(products.map(p => p.id === productId ? { ...p, reviews: p.reviews.filter((_, i) => i !== reviewIndex) } : p));
        toast.info("Review Deleted");
    };

    const addComment = (blogId, comment) => {
        setBlogs(prev => prev.map(b => b.id === blogId ? { ...b, comments: [...b.comments, comment] } : b));
        toast.success("Comment Posted!");
    };

    const contextValue = {
        // Auth
        currentUser, login, register, logout, users, setUsers,
        
        // Data
        products, setProducts, blogs, setBlogs, 
        contactInfo, setContactInfo, aboutInfo, setAboutInfo,
        legalInfo, setLegalInfo, // Updated to use one object
        orders, setOrders,
        
        // Functional
        cart, setCart, addToCart, removeFromCart, placeOrder,
        theme, toggleTheme, currency, setCurrency, formatPrice, language, setLanguage, t,
        addProductReview, deleteReview, addComment,
        favorites, toggleFavorite,
        notifications, addNotification, markNotificationRead
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;