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
                        <button class="decrease-qty" data-id="${item.id}">-</button>
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