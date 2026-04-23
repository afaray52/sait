const products = [
    { id: 1, name: "Portable Bluetooth Speaker", price: 129.99, rating: 3.5, image: "img/speaker.jpg" },
    { id: 2, name: "Premium Wireless Headphones", price: 299.99, rating: 5, image: "img/headphones.jpg" },
    { id: 3, name: "Professional DSLR Camera", price: 2499.99, rating: 5, image: "img/camera.jpg" },
    { id: 4, name: "Professional Laptop Pro", price: 1899.99, rating: 4.5, image: "img/laptop.jpg" },
    { id: 5, name: "Smart Fitness Watch Ultra", price: 449.99, rating: 4, image: "img/watch.jpg" },
    { id: 6, name: "Ultra-Thin Tablet Pro", price: 799.99, rating: 4.5, image: "img/tablet.jpg" }
];
let currentProducts = [...products];
let ratingFilters = [];


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
                    <button class="add-to-cart" data-id="${p.id}">Add to cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    let filtered = products.filter(p => {
        if (ratingFilters.length === 0) return true;
        return ratingFilters.some(r => p.rating >= parseInt(r));
    });
    currentProducts = filtered;
    renderProducts(currentProducts);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
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
});