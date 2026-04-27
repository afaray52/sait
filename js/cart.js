function renderCart() {
    const cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartLayout = document.querySelector('.cart-layout');
    const emptyCartDiv = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        if (cartLayout) cartLayout.style.display = 'none';
        if (emptyCartDiv) emptyCartDiv.style.display = 'block';
        return;
    }
    
    if (cartLayout) cartLayout.style.display = 'grid';
    if (emptyCartDiv) emptyCartDiv.style.display = 'none';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <div>
                        <h3><a href="product_page.html?id=${item.id}">${item.name}</a></h3>
                        <p class="cart-item-category">${getCategoryName(item.id)}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="cart-item-footer">
                    <div class="quantity-control">
                        <button class="decrease-qty" data-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                    <div class="item-price">
                        <div class="price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="unit-price">$${item.price.toFixed(2)} each</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    
    updateSummary();
}

function getCategoryName(productId) {
    const categories = {
        1: 'Audio',
        2: 'Audio',
        3: 'Photography',
        4: 'Computers',
        5: 'Wearables',
        6: 'Tablets'
    };
    return categories[productId] || '';
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
    }
    
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

let discount = 0;
let appliedPromo = false;

function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = appliedPromo ? subtotal * 0.1 : 0;
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * 0.08;
    const total = afterDiscount + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    const discountRow = document.getElementById('discountRow');
    const discountAmountEl = document.getElementById('discountAmount');
    
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    
    if (appliedPromo && discountAmountEl) {
        discountAmountEl.textContent = '-$' + discountAmount.toFixed(2);
        if (discountRow) discountRow.style.display = 'flex';
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
}

const applyPromoBtn = document.getElementById('applyPromoBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const promoInput = document.getElementById('promoCode');
const promoMessage = document.getElementById('promoMessage');
const promoHint = document.querySelector('.promo-hint');

if (applyPromoBtn) {
    applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        
        if (code === 'SAVE10' && !appliedPromo) {
            discount = 0.1;
            appliedPromo = true;
            promoMessage.textContent = 'Promo code applied successfully!';
            promoMessage.className = 'promo-message success';
            if (promoHint) promoHint.style.display = 'none';
            promoInput.disabled = true;
            applyPromoBtn.disabled = true;
            applyPromoBtn.style.background = '#9ca3af';
            applyPromoBtn.style.cursor = 'not-allowed';
        } else if (code === '') {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message error';
            return;
        } else if (appliedPromo) {
            promoMessage.textContent = 'Promo code already applied!';
            promoMessage.className = 'promo-message error';
            return;
        } else {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
        }
        
        updateSummary();
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality coming soon!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateSummary();
});