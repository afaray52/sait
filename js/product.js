const productData = {
    1: {
        id: 1,
        name: "Portable Bluetooth Speaker",
        price: 129.99,
        rating: 3.5,
        category: "Audio",
        image: "img/speaker.jpg",
        images: ["img/speaker.jpg", "img/speaker.jpg", "img/speaker.jpg"],
        description: "Take your music anywhere with this powerful portable speaker. Delivers rich, immersive sound with deep bass. Waterproof design perfect for outdoor adventures and pool parties.",
        highlights: ["Output Power: 20W", "Battery Life: 15 hours", "Water Rating: IPX7"],
        specs: ["Model: SPK-2024", "Bluetooth Version: 5.3", "Charging Time: 3 hours", "Weight: 450g", "Warranty: 1 year"]
    },
    2: {
        id: 2,
        name: "Premium Wireless Headphones",
        price: 299.99,
        rating: 5,
        category: "Audio",
        image: "img/headphones.jpg",
        images: ["img/headphones.jpg", "img/headphones.jpg", "img/headphones.jpg"],
        description: "Experience crystal clear audio with our premium wireless headphones. Active noise cancellation, 40 hours of battery life, and ultra-comfortable design.",
        highlights: ["Active Noise Cancellation", "40 Hours Battery", "Bluetooth 5.2"],
        specs: ["Model: WH-1000X", "Driver Size: 40mm", "Frequency Response: 20Hz-20kHz", "Weight: 250g"]
    },
    3: {
        id: 3,
        name: "Professional DSLR Camera",
        price: 2499.99,
        rating: 5,
        category: "Photography",
        image: "img/camera.jpg",
        images: ["img/camera.jpg", "img/camera.jpg", "img/camera.jpg"],
        description: "Capture stunning photos and videos with this professional-grade DSLR camera. 24.2MP sensor, 4K video recording, and advanced autofocus system.",
        highlights: ["24.2MP Sensor", "4K Video", "Advanced Autofocus"],
        specs: ["Model: D850", "ISO Range: 64-25600", "Shutter Speed: 1/8000s", "Weight: 1005g"]
    },
    4: {
        id: 4,
        name: "Professional Laptop Pro",
        price: 1899.99,
        rating: 4.5,
        category: "Computers",
        image: "img/laptop.jpg",
        images: ["img/laptop.jpg", "img/laptop.jpg", "img/laptop.jpg"],
        description: "Powerful laptop for professionals. 16GB RAM, 1TB SSD, and stunning Retina display. Perfect for developers, designers, and content creators.",
        highlights: ["16GB RAM", "1TB SSD", "Retina Display"],
        specs: ["Model: Pro 16", "Processor: M2 Pro", "Battery: 20 hours", "Weight: 2.1kg"]
    },
    5: {
        id: 5,
        name: "Smart Fitness Watch Ultra",
        price: 449.99,
        rating: 4,
        category: "Wearables",
        image: "img/watch.jpg",
        images: ["img/watch.jpg", "img/watch.jpg", "img/watch.jpg"],
        description: "Track your fitness goals with this advanced smartwatch. Heart rate monitoring, GPS, sleep tracking, and 7 days battery life.",
        highlights: ["Heart Rate Monitor", "GPS Tracking", "7 Days Battery"],
        specs: ["Model: Watch Ultra", "Display: 1.9-inch AMOLED", "Water Resistance: 50m", "Weight: 52g"]
    },
    6: {
        id: 6,
        name: "Ultra-Thin Tablet Pro",
        price: 799.99,
        rating: 4.5,
        category: "Tablets",
        image: "img/tablet.jpg",
        images: ["img/tablet.jpg", "img/tablet.jpg", "img/tablet.jpg"],
        description: "Ultra-thin and lightweight tablet perfect for work and entertainment. 11-inch display, 256GB storage, and all-day battery life.",
        highlights: ["11-inch Display", "256GB Storage", "All-day Battery"],
        specs: ["Model: Tab Pro", "Processor: M1", "RAM: 8GB", "Weight: 460g"]
    }
};

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

const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));
const product = productData[productId];

if (product) {
    document.getElementById('breadcrumbCategory').textContent = product.category;
    document.getElementById('breadcrumbName').textContent = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productRating').innerHTML = renderStars(product.rating) + ` <span>(${product.rating})</span>`;
    document.getElementById('productPrice').textContent = '$' + product.price.toFixed(2);
    document.getElementById('productDescription').textContent = product.description;
    
    document.getElementById('highlightsList').innerHTML = product.highlights.map(h => 
        `<li><span class="highlight-dot"></span>${h}</li>`
    ).join('');
    
    document.getElementById('specsList').innerHTML = product.specs.map(s => 
        `<li>${s}</li>`
    ).join('');
    
    let currentImageIndex = 0;
    const mainImage = document.getElementById('mainImage');
    mainImage.src = product.images[0];
    
    const thumbnailList = document.getElementById('thumbnailList');
    product.images.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${img}" alt="Thumbnail">`;
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            mainImage.src = product.images[currentImageIndex];
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbnailList.appendChild(thumb);
    });
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    function updateActiveThumbnail() {
        const thumbs = document.querySelectorAll('.thumbnail');
        thumbs.forEach((thumb, idx) => {
            if (idx === currentImageIndex) thumb.classList.add('active');
            else thumb.classList.remove('active');
        });
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            mainImage.src = product.images[currentImageIndex];
            updateActiveThumbnail();
        });
        
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % product.images.length;
            mainImage.src = product.images[currentImageIndex];
            updateActiveThumbnail();
        });
    }
    
    let quantity = 1;
    const quantitySpan = document.getElementById('quantity');
    const decrementQty = document.getElementById('decrementQty');
    const incrementQty = document.getElementById('incrementQty');
    
    if (decrementQty && incrementQty && quantitySpan) {
        decrementQty.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });
        
        incrementQty.addEventListener('click', () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });
    }
    
    const accordionBtn = document.getElementById('accordionBtn');
    const accordionContent = document.getElementById('accordionContent');
    
    if (accordionBtn && accordionContent) {
        accordionBtn.addEventListener('click', () => {
            const isOpen = accordionContent.classList.contains('open');
            if (isOpen) {
                accordionContent.classList.remove('open');
                accordionBtn.classList.remove('open');
            } else {
                accordionContent.classList.add('open');
                accordionBtn.classList.add('open');
            }
        });
    }

    const addToCartBtn = document.getElementById('addToCartBtn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');
            const existing = cart.find(item => item.id === productId);
            
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity,
                    image: product.image
                });
            }
            
            localStorage.setItem('techstore_cart', JSON.stringify(cart));
            
            if (typeof updateCartBadge === 'function') updateCartBadge();
        });
    }
}