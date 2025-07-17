// Shopping cart functionality
let cart = [];
let cartTotal = 0;

document.addEventListener('DOMContentLoaded', function() {
    initShop();
    loadCart();
});

function initShop() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-coffee-600', 'text-white');
                btn.classList.add('bg-white', 'text-coffee-600');
            });
            
            button.classList.add('active', 'bg-coffee-600', 'text-white');
            button.classList.remove('bg-white', 'text-coffee-600');
            
            // Filter products
            filterProducts(filter);
        });
    });
    
    // Cart functionality
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const shouldShow = category === 'all' || productCategory === category;
        
        if (shouldShow) {
            product.style.display = 'block';
            product.classList.add('animate-in');
        } else {
            product.style.display = 'none';
            product.classList.remove('animate-in');
        }
    });
}

function addToCart(productId, price) {
    const product = {
        id: productId,
        name: getProductName(productId),
        price: price,
        quantity: 1
    };
    
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === productId);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    updateCartDisplay();
    saveCart();
    showCartNotification(product.name);
}

function getProductName(productId) {
    const productNames = {
        'ethiopian-yirgacheffe': 'Ethiopian Yirgacheffe',
        'colombian-supremo': 'Colombian Supremo',
        'guatemala-antigua': 'Guatemala Antigua',
        'house-blend': 'House Blend',
        'espresso-blend': 'Espresso Blend',
        'breakfast-blend': 'Breakfast Blend',
        'monthly-subscription': 'Monthly Subscription',
        'gift-set': 'Coffee Lover\'s Gift Set'
    };
    
    return productNames[productId] || 'Unknown Product';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            product.quantity = newQuantity;
            updateCartDisplay();
            saveCart();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Calculate totals
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart count
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-coffee-600 text-center">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between py-3 border-b border-coffee-100">
                <div class="flex-1">
                    <h4 class="font-medium text-coffee-900 text-sm">${item.name}</h4>
                    <p class="text-coffee-600 text-xs">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="w-6 h-6 bg-coffee-100 rounded text-coffee-600 hover:bg-coffee-200 text-sm">-</button>
                    <span class="text-sm font-medium w-8 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="w-6 h-6 bg-coffee-100 rounded text-coffee-600 hover:bg-coffee-200 text-sm">+</button>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="ml-2 text-red-500 hover:text-red-700 text-sm">×</button>
            </div>
        `).join('');
        
        checkoutBtn.disabled = false;
    }
    
    // Update total
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    
    // Update checkout button text
    if (cartTotal >= 50) {
        checkoutBtn.innerHTML = 'Checkout <span class="text-xs">(Free Shipping!)</span>';
    } else {
        checkoutBtn.innerHTML = `Checkout <span class="text-xs">($${(50 - cartTotal).toFixed(2)} for free shipping)</span>`;
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function showCartNotification(productName) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform';
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>✓</span>
            <span class="text-sm">${productName} added to cart</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function saveCart() {
    localStorage.setItem('mycoffee_cart', JSON.stringify(cart));
    // Trigger cart update event for other pages
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

function loadCart() {
    const savedCart = localStorage.getItem('mycoffee_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Checkout functionality (simplified)
document.getElementById('checkout-btn')?.addEventListener('click', function() {
    if (cart.length === 0) return;
    
    // Simple checkout simulation
    alert(`Thank you for your order! Total: $${cartTotal.toFixed(2)}\n\nThis is a demo - no actual payment will be processed.`);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    saveCart();
    closeCart();
});

// Export functions for global use
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
