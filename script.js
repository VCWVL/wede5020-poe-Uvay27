// MAIN JAVASCRIPT FILE FOR CHECKPOINT GAMING
// This file contains general website functionality

// Welcome alert (only shows on Home page)
if (document.title.includes("Home")) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            alert("Welcome to Checkpoint Gaming - Your premier gaming destination!");
        }, 1000);
    });
}

// Show current date in footer
document.addEventListener("DOMContentLoaded", function() {
    let dateElement = document.getElementById("date");
    if (dateElement) {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerHTML = "Today's Date: " + today.toLocaleDateString('en-ZA', options);
    }
});

// Products page - Add to cart function
function addToCart(product, price) {
    alert(product + " has been added to your cart! Price: R" + price);
}

// Checkout function for cart page
function checkout() {
    alert("Proceeding to checkout...");
}

// Function to show random gaming tips
function showTip() {
    const tips = [
        "Remember to take breaks while gaming!",
        "Stay hydrated during long gaming sessions.",
        "Adjust your screen brightness to reduce eye strain.",
        "Use a comfortable chair to support your back.",
        "Keep your hands relaxed to avoid fatigue.",
        "Regularly update your gaming software for best performance!",
        "Clean your gaming equipment for longer lifespan!",
        "Use wired connection for stable online gaming!",
        "Adjust controller sensitivity for better accuracy!",
        "Join gaming communities to learn from others!"
    ];

    const randomIndex = Math.floor(Math.random() * tips.length);
    alert("🎮 Gaming Tip: " + tips[randomIndex]);
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});

// Update cart badge in navigation
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const existingBadge = document.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    if (totalItems > 0) {
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            badge.style.cssText = 'background: #ff6600; color: white; border-radius: 50%; padding: 2px 6px; margin-left: 5px; font-size: 0.8rem;';
            cartLink.appendChild(badge);
        }
    }
}