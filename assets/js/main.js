// My Coffee - Main JavaScript
// Vanilla JavaScript for interactive features

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Ensure mobile menu is closed on page load
    resetMobileMenuState();

    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormValidation();
    initCartDisplay();

    console.log('My Coffee website initialized');
});

// Handle page visibility changes (when user navigates back to page)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, ensure mobile menu is closed
        resetMobileMenuState();
    }
});

// Handle page focus (additional safety net)
window.addEventListener('focus', function() {
    resetMobileMenuState();
});

// Handle before page unload to reset menu state
window.addEventListener('beforeunload', function() {
    resetMobileMenuState();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.site-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = mobileMenu?.classList.contains('open') || !mobileMenu?.classList.contains('hidden');

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close menu immediately when navigation link is clicked
            closeMobileMenu();

            // Small delay to ensure menu closes before navigation
            setTimeout(() => {
                resetMobileMenuState();
            }, 100);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header?.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        console.log('Mobile menu opened');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && mobileMenuBtn) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';

        console.log('Mobile menu closed');
    }
}

// Reset mobile menu state on page load
function resetMobileMenuState() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu && mobileMenuBtn) {
        // Force close the menu by removing any open states
        mobileMenu.classList.remove('open');
        mobileMenu.classList.add('hidden');

        // Reset button state
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        // Reset body overflow (in case it was locked)
        document.body.style.overflow = '';

        // Additional safety: ensure the menu is not visible
        mobileMenu.style.display = '';

        console.log('Mobile menu state reset');
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Coffee-themed animations
function initAnimations() {
    // Steam animation for coffee cups
    const steamElements = document.querySelectorAll('.steam');
    steamElements.forEach((steam, index) => {
        steam.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Coffee pouring animation
    const pourElements = document.querySelectorAll('.pour-effect');
    pourElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.classList.add('pour-animation');
        });
        
        element.addEventListener('animationend', () => {
            element.classList.remove('pour-animation');
        });
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    let isValid = true;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (isValid) {
        // Process form submission
        submitForm(form, formData);
    } else {
        showFormError(form, 'Please correct the errors above.');
    }
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#dc2626';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFormError(form, message) {
    let errorElement = form.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        form.insertBefore(errorElement, form.firstChild);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = '#dc2626';
    errorElement.style.padding = '0.75rem';
    errorElement.style.backgroundColor = '#fef2f2';
    errorElement.style.border = '1px solid #fecaca';
    errorElement.style.borderRadius = '0.5rem';
    errorElement.style.marginBottom = '1rem';
}

function submitForm(form, formData) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showSuccessMessage(form, 'Thank you! Your message has been sent successfully.');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    }, 2000);
}

function showSuccessMessage(form, message) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.color = '#059669';
    successElement.style.padding = '0.75rem';
    successElement.style.backgroundColor = '#ecfdf5';
    successElement.style.border = '1px solid #a7f3d0';
    successElement.style.borderRadius = '0.5rem';
    successElement.style.marginBottom = '1rem';
    
    form.insertBefore(successElement, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cart display functionality for all pages
function initCartDisplay() {
    updateCartCount();

    // Listen for cart updates from localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'mycoffee_cart') {
            updateCartCount();
        }
    });

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', function() {
        updateCartCount();
    });
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const mobileCartCountElement = document.getElementById('mobile-cart-count');

    try {
        const cart = JSON.parse(localStorage.getItem('mycoffee_cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

        // Update main cart count
        if (cartCountElement) {
            if (totalItems > 0) {
                cartCountElement.textContent = totalItems;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }

        // Update mobile cart count
        if (mobileCartCountElement) {
            if (totalItems > 0) {
                mobileCartCountElement.textContent = totalItems;
                mobileCartCountElement.classList.remove('hidden');
            } else {
                mobileCartCountElement.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
        cartCountElement?.classList.add('hidden');
        mobileCartCountElement?.classList.add('hidden');
    }
}

// Export functions for use in other modules
window.MyCoffee = {
    openMobileMenu,
    closeMobileMenu,
    resetMobileMenuState,
    validateField,
    debounce,
    updateCartCount
};
