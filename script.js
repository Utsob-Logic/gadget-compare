document.addEventListener('DOMContentLoaded', () => {
    let allProducts = [];
    let currentCategory = 'all';

    async function loadProducts() {
        try {
            const response = await fetch('products_2.json');
            allProducts = await response.json();
            filterAndRender();
        } catch (error) {
            console.error('Error loading products:', error);
            const countElem = document.getElementById('productCount');
            if (countElem) countElem.innerText = 'প্রোডাক্ট লোড করতে সমস্যা হয়েছে!';
        }
    }

    function filterAndRender() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        const filtered = allProducts.filter(p => {
            const matchesCat = (currentCategory === 'all') || 
                               (p.cat && p.cat.toLowerCase() === currentCategory.toLowerCase());
            
            const matchesSearch = !query || 
                                  p.title.toLowerCase().includes(query) || 
                                  (p.cat && p.cat.toLowerCase().includes(query)) ||
                                  (p.brand && p.brand.toLowerCase().includes(query));

            return matchesCat && matchesSearch;
        });

        renderProducts(filtered);
    }

    function renderProducts(products) {
        const grid = document.getElementById('productGrid');
        const countElem = document.getElementById('productCount');
        
        if (countElem) {
            countElem.innerText = `মোট প্রডাক্ট: ${products.length} টি`;
        }

        if (!grid) return;
        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">কোনো প্রোডাক্ট পাওয়া যায়নি!</div>';
            return;
        }

        products.forEach(product => {
            let minPrice = Infinity;
            if (product.prices && product.prices.length > 0) {
                product.prices.forEach(p => {
                    if (p.raw_price && p.raw_price < minPrice) {
                        minPrice = p.raw_price;
                    }
                });
            }

            let shopsHtml = '';
            if (product.prices && product.prices.length > 0) {
                shopsHtml = product.prices.map(p => {
                    const isLowest = (p.raw_price === minPrice);
                    const priceFormatted = p.raw_price ? `৳ ${p.raw_price.toLocaleString()}` : 'N/A';
                    
                    return `
                        <div class="shop-row ${isLowest ? 'lowest-price-row' : ''}">
                            <span class="shop-name">${p.shop}</span>
                            <span class="shop-price ${isLowest ? 'lowest-badge' : ''}">
                                ${priceFormatted} ${isLowest ? '<span class="best-deal-tag">সেরা ডিল</span>' : ''}
                            </span>
                        </div>
                    `;
                }).join('');
            }

            const displayPrice = minPrice !== Infinity ? `৳ ${minPrice.toLocaleString()}` : 'N/A';

            const card = document.createElement('div');
            card.className = 'product-card';
            
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${product.img}" alt="${product.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'">
                </div>
                <div class="card-content">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="primary-price">${displayPrice} <small style="font-size:11px; color:#888;">(সর্বনিম্ন)</small></div>
                    <div class="shop-prices-container">
                        ${shopsHtml}
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // সার্চ ইভেন্ট
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    // ক্যাটাগরি বাটন ফিল্টার ইভেন্ট
    const catButtons = document.querySelectorAll('.cat-btn');
    catButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            catButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-cat');
            filterAndRender();
        });
    });

    loadProducts();
});