const products = [
    { id: 1, name: "Portable Bluetooth Speaker", price: 129.99, rating: 3.5, category: "Audio", image: "img/speaker.jpg" },
    { id: 2, name: "Premium Wireless Headphones", price: 299.99, rating: 5, category: "Audio", image: "img/headphones.jpg" },
    { id: 3, name: "Professional DSLR Camera", price: 2499.99, rating: 5, category: "Photography", image: "img/camera.jpg" },
    { id: 4, name: "Professional Laptop Pro", price: 1899.99, rating: 4.5, category: "Computers", image: "img/laptop.jpg" },
    { id: 5, name: "Smart Fitness Watch Ultra", price: 449.99, rating: 4, category: "Wearables", image: "img/watch.jpg" },
    { id: 6, name: "Ultra-Thin Tablet Pro", price: 799.99, rating: 4.5, category: "Tablets", image: "img/tablet.jpg" }
];

let currentProducts = [...products];
let ratingFilters = [];
let minPrice = 0, maxPrice = 3000;
let currentSort = "name-asc";

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    let stars = '';
    for (let i = 0; i < full; i++) stars += '<i class="fa-solid fa-star"></i>';
    if (half) stars += '<i class="fa-solid fa-star-half-alt"></i>';
    let empty = 5 - Math.ceil(rating);
    for (let i = 0; i < empty; i++) stars += '<i class="fa-regular fa-star"></i>';
    return stars;
}

function renderProducts(productArray) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = productArray.map(p => `
        <a href="product_page.html?id=${p.id}" class="product-card-link">
            <div class="product-card">
                <div class="product-img">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="rating">
                        ${renderStars(p.rating)} <span>(${p.rating})</span>
                    </div>
                    <div class="price-row">
                        <span class="price">$${p.price.toFixed(2)}</span>
                        <span class="product-category">${p.category}</span>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

function applyFilters() {
    let filtered = products.filter(p => {
        if (p.price < minPrice || p.price > maxPrice) return false;
        if (ratingFilters.length > 0 && !ratingFilters.some(r => p.rating >= parseInt(r))) return false;
        return true;
    });

    if (currentSort === "name-asc") filtered.sort((a,b) => a.name.localeCompare(b.name));
    if (currentSort === "name-desc") filtered.sort((a,b) => b.name.localeCompare(a.name));
    if (currentSort === "price-asc") filtered.sort((a,b) => a.price - b.price);
    if (currentSort === "price-desc") filtered.sort((a,b) => b.price - a.price);
    
    currentProducts = filtered;
    renderProducts(currentProducts);
    
    const productCount = document.querySelector('.product-count');
    if (productCount) productCount.textContent = `${filtered.length} products`;
}

function updateSlider() {
    const minSlider = document.getElementById('minPriceSlider');
    const maxSlider = document.getElementById('maxPriceSlider');
    const sliderRange = document.getElementById('sliderRange');
    const minSpan = document.getElementById('minPriceValue');
    const maxSpan = document.getElementById('maxPriceValue');
    const maxLimit = 3000;
    
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);
    
    if (min > max - 10) {
        max = Math.min(max + 10, maxLimit);
        minSlider.value = max;
    }
    if (max < min + 10) {
        min = Math.max(min - 10, 0);
        maxSlider.value = min;
    }
    
    minPrice = min;
    maxPrice = max;
    
    minSpan.textContent = '$' + min;
    maxSpan.textContent = '$' + max;
    
    const leftPercent = (min / maxLimit) * 100;
    const rightPercent = 100 - (max / maxLimit) * 100;
    
    sliderRange.style.left = leftPercent + '%';
    sliderRange.style.right = rightPercent + '%';
    
    applyFilters();
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = total;       
        if (total === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'inline-flex';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartBadge();
    
    document.querySelectorAll('.rating-filter').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const val = e.target.value;
            if (e.target.checked) {
                ratingFilters.push(val);
            } else {
                ratingFilters = ratingFilters.filter(v => v !== val);
            }
            applyFilters();
        });
    });
    
    const minSlider = document.getElementById('minPriceSlider');
    const maxSlider = document.getElementById('maxPriceSlider');
    
    if (minSlider && maxSlider) {
        minSlider.addEventListener('input', updateSlider);
        maxSlider.addEventListener('input', updateSlider);
        updateSlider();
    }
    
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFilters();
    });


    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
        document.querySelectorAll('.rating-filter').forEach(cb => cb.checked = false);
        ratingFilters = [];
        
        const minSlider = document.getElementById('minPriceSlider');
        const maxSlider = document.getElementById('maxPriceSlider');
        if (minSlider && maxSlider) {
            minSlider.value = 0;
            maxSlider.value = 3000;
            updateSlider();
        }
        
        document.getElementById('sortSelect').value = 'name-asc';
        currentSort = 'name-asc';
        applyFilters();
    });
});