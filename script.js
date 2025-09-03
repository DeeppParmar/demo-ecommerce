// Global variables
let products = [];
let cart = [];
let filteredProducts = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartBtn = document.getElementById('cartBtn');
const closeCartBtn = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalAmount = document.getElementById('totalAmount');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadCartFromStorage();
});

async function initializeApp() {
    try {
        showLoading();
        await loadProducts();
        renderProducts();
        updateCartUI();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to load products', 'error');
    }
}

function setupEventListeners() {
    // Navigation
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    hamburger.addEventListener('click', toggleMobileMenu);

    // Filters
    categoryFilter.addEventListener('change', filterProducts);
    sortFilter.addEventListener('change', sortProducts);
    searchInput.addEventListener('input', searchProducts);

    // Cart actions
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);

    // Modal
    closeModal.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeProductModal();
        }
    });

    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const category = this.dataset.category;
            categoryFilter.value = category;
            filterProducts();
            scrollToProducts();
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's an external page link
            if (href.includes('.html')) {
                // Let the browser handle normal page navigation
                return;
            }

            // Only prevent default and smooth scroll for hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        filteredProducts = [...products];
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to dummy data
        products = getDummyProducts();
        filteredProducts = [...products];
    }
}

function getDummyProducts() {
    return [
        {
            id: '1',
            name: 'Premium Wireless Headphones',
            price: 299,
            originalPrice: 399,
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'electronics',
            rating: 4.8,
            reviews: 247,
            description: 'Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort.',
            features: ['Active Noise Cancellation', '30-hour Battery', 'Premium Comfort', 'Hi-Res Audio'],
            inStock: true,
            badge: 'Best Seller'
        },
        {
            id: '2',
            name: 'Smart Fitness Watch',
            price: 249,
            image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'electronics',
            rating: 4.6,
            reviews: 189,
            description: 'Track your fitness goals with advanced health monitoring, GPS tracking, and smart notifications in a sleek, waterproof design.',
            features: ['Health Monitoring', 'GPS Tracking', 'Waterproof', 'Smart Notifications'],
            inStock: true,
            badge: 'New'
        },
        {
            id: '3',
            name: 'Luxury Leather Handbag',
            price: 449,
            originalPrice: 599,
            image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'fashion',
            rating: 4.9,
            reviews: 156,
            description: 'Handcrafted from premium Italian leather, this elegant handbag combines timeless style with modern functionality.',
            features: ['Premium Italian Leather', 'Handcrafted', 'Multiple Compartments', 'Dust Bag Included'],
            inStock: true
        },
        {
            id: '4',
            name: 'Professional Camera Lens',
            price: 899,
            image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'electronics',
            rating: 4.7,
            reviews: 98,
            description: 'Capture stunning professional-quality photos with this premium telephoto lens featuring advanced optical stabilization.',
            features: ['Optical Stabilization', 'Weather Sealed', 'Premium Glass', 'Professional Quality'],
            inStock: true
        },
        {
            id: '5',
            name: 'Minimalist Desk Setup',
            price: 599,
            image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'home',
            rating: 4.5,
            reviews: 234,
            description: 'Create the perfect workspace with this minimalist desk featuring sustainable bamboo construction and built-in cable management.',
            features: ['Sustainable Bamboo', 'Cable Management', 'Minimalist Design', 'Easy Assembly'],
            inStock: true
        },
        {
            id: '6',
            name: 'Premium Coffee Maker',
            price: 399,
            originalPrice: 499,
            image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'kitchen',
            rating: 4.8,
            reviews: 312,
            description: 'Brew the perfect cup every time with this premium coffee maker featuring precision temperature control and programmable settings.',
            features: ['Precision Temperature', 'Programmable', 'Premium Materials', 'Easy Maintenance'],
            inStock: true,
            badge: 'Staff Pick'
        },
        {
            id: '7',
            name: 'Designer Sunglasses',
            price: 199,
            image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=500',
            category: 'fashion',
            rating: 4.4,
            reviews: 167,
            description: 'Protect your eyes in style with these designer sunglasses featuring polarized lenses and titanium frames.',
            features: ['Polarized Lenses', 'Titanium Frame', 'UV Protection', 'Luxury Case'],
            inStock: true
        },
        {
            id: '8',
            name: 'Wireless Charging Station',
            price: 79,
            image: 'https://images.pexels.com/photos/4316/smartphone-phone-cell-phone-mobile-phone.jpg?auto=compress&cs=tinysrgb&w=500',
            category: 'electronics',
            rating: 4.3,
            reviews: 445,
            description: 'Charge all your devices wirelessly with this sleek 3-in-1 charging station compatible with all Qi-enabled devices.',
            features: ['3-in-1 Charging', 'Qi Compatible', 'LED Indicators', 'Non-slip Base'],
            inStock: true
        }
    ];
}

function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card fade-in" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="reviews-count">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Add click listeners for product details
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productId = this.dataset.productId;
                showProductModal(productId);
            }
        });
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }

    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star" style="color: #d1d5db;">★</span>';
    }

    return stars;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
    showToast('Item removed from cart', 'error');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = itemCount;
    totalAmount.textContent = `$${total.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateQuantity('${item.id}', parseInt(this.value))" min="1">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function filterProducts() {
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    sortProducts();
}

function sortProducts() {
    const sortValue = sortFilter.value;

    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            filteredProducts = [...products.filter(p => filteredProducts.find(fp => fp.id === p.id))];
    }

    renderProducts();
}

function searchProducts() {
    filterProducts();
}

function clearCart() {
    cart = [];
    updateCartUI();
    saveCartToStorage();
    showToast('Cart cleared');
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showToast(`Checkout completed! Total: $${total.toFixed(2)}`);
    cart = [];
    updateCartUI();
    saveCartToStorage();
    closeCart();
}

function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="reviews-count">(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
            </div>
            <p class="product-description">${product.description}</p>
            <div class="product-features">
                <h4>Key Features:</h4>
                <div class="features-list">
                    ${product.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                Add to Cart - $${product.price}
            </button>
        </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function saveCartToStorage() {
    localStorage.setItem('elitestore_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('elitestore_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const toastContainer = document.getElementById('toastContainer');
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toastContainer.removeChild(toast), 300);
    }, 3000);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.scrollToProducts = scrollToProducts;

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});