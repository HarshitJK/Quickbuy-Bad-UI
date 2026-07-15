// ============ SHARED: COOKIE, NEWSLETTER, TOAST ============
function showToast(msg, type) {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Cookie banner
document.getElementById('cookieAccept')?.addEventListener('click', () => {
    document.getElementById('cookieBanner').classList.add('hidden');
    triggerNewsletter();
});
document.getElementById('cookieManage')?.addEventListener('click', () => {
    document.getElementById('cookieBanner').classList.add('hidden');
    document.getElementById('cookiePrefs').classList.remove('hidden');
});
document.getElementById('prefSave')?.addEventListener('click', () => {
    document.getElementById('cookiePrefs').classList.add('hidden');
    showToast('Cookie preferences saved', 'success');
    triggerNewsletter();
});

// Newsletter popup
function triggerNewsletter() {
    const overlay = document.getElementById('newsletterOverlay');
    if (!overlay) return;
    setTimeout(() => overlay.classList.remove('hidden'), 2000);
}
document.getElementById('newsletterClose')?.addEventListener('click', () => {
    document.getElementById('newsletterOverlay').classList.add('hidden');
});
document.getElementById('newsletterOverlay')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) showToast('Please subscribe or close the popup to continue', 'error');
});
document.querySelector('.newsletter-btn')?.addEventListener('click', () => {
    document.getElementById('newsletterOverlay')?.classList.add('hidden');
    showToast('Subscribed! Check your spam folder.', 'success');
});

// ============ HOME / SHOP PAGE ============
const allProducts = [
    { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: 49.99, color: '#e3f2fd', rating: '4.5', reviews: 1283 },
    { id: 2, name: 'USB-C Fast Charging Cable (3-Pack)', price: 12.99, color: '#f3e5f5', rating: '4.2', reviews: 856 },
    { id: 3, name: 'Adjustable Laptop Stand - Silver', price: 34.99, color: '#e8eaf6', rating: '4.7', reviews: 432 },
    { id: 4, name: 'RGB Mechanical Gaming Keyboard', price: 79.99, color: '#fce4ec', rating: '4.4', reviews: 2104 },
    { id: 5, name: 'Wireless Ergonomic Mouse', price: 24.99, color: '#e0f2f1', rating: '3.9', reviews: 567 },
    { id: 6, name: 'LED Monitor Light Bar', price: 39.99, color: '#fff3e0', rating: '4.6', reviews: 198, sale: true, originalPrice: 34.99 },
    { id: 7, name: 'Portable Bluetooth Speaker', price: 29.99, color: '#f1f8e9', rating: '4.1', reviews: 743 },
    { id: 8, name: '4K Webcam with Microphone', price: 59.99, color: '#fce4ec', rating: '4.3', reviews: 321 }
];

function initShopPage() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    function renderProducts(products) {
        grid.innerHTML = '';
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            // Sale badge — but sale price is HIGHER than original (bad UI)
            const saleHTML = p.sale ? `<div class="sale-badge">SALE</div>` : '';
            const priceHTML = p.sale
                ? `<span class="product-card-price">$${p.price.toFixed(2)} <span class="product-card-original">$${p.originalPrice.toFixed(2)}</span></span>`
                : `<span class="product-card-price">$${p.price.toFixed(2)}</span>`;

            card.innerHTML = `
                ${saleHTML}
                <div class="product-card-img" style="background:${p.color}"></div>
                <div class="product-card-body">
                    <div class="product-card-name">${p.name}</div>
                    ${priceHTML}
                    <div class="product-card-rating">${p.rating} stars (${p.reviews} reviews)</div>
                    <button class="btn-add-cart" data-id="${p.id}">Add to Cart</button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add to cart buttons — say "Added!" but don't actually do anything
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.textContent = 'Added!';
                btn.classList.add('added');
                // Cart count stays the same — intentionally
                showToast('Item added to cart', 'success'); // RED toast
                setTimeout(() => {
                    btn.textContent = 'Add to Cart';
                    btn.classList.remove('added');
                }, 1500);
            });
        });
    }

    renderProducts(allProducts);

    // Sort — does the opposite of what you'd expect
    document.getElementById('sortSelect')?.addEventListener('change', e => {
        let sorted = [...allProducts];
        switch (e.target.value) {
            case 'low': // Price Low to High → actually sorts High to Low
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'high': // Price High to Low → actually sorts Low to High
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'popular': // Most Popular → sorts alphabetically
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'best': // Best Match → randomizes
                sorted.sort(() => Math.random() - 0.5);
                break;
        }
        renderProducts(sorted);
        showToast('Products sorted', 'error');
    });

    // Search — searches by character count instead of name
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        const query = document.getElementById('searchInput')?.value.trim().toLowerCase();
        if (!query) { renderProducts(allProducts); return; }
        // Filters products where name length matches query length... useless
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
        if (filtered.length === 0) {
            renderProducts(allProducts);
            showToast(`No results for "${query}". Showing all products instead.`, 'error');
        } else {
            renderProducts(filtered);
        }
    });
}

// ============ CART PAGE ============
const cartProducts = [
    { id: 1, name: 'Wireless Noise-Cancelling Headphones', sku: 'WH-1000XM5', price: 49.99, qty: 2, color: '#e3f2fd', available: true },
    { id: 2, name: 'USB-C Fast Charging Cable (3-Pack)', sku: 'CC-USB3PK', price: 12.99, qty: 1, color: '#f3e5f5', available: true },
    { id: 3, name: 'Adjustable Laptop Stand - Silver', sku: 'LS-ADJ-SLV', price: 34.99, qty: 1, color: '#e8eaf6', available: false },
    { id: 4, name: 'RGB Mechanical Gaming Keyboard', sku: 'KB-MECH-RGB', price: 79.99, qty: 1, color: '#fce4ec', available: true }
];
let cartItems = JSON.parse(JSON.stringify(cartProducts));
let pendingQty = {};
let couponApplied = 0;
let checkoutClicks = 0;
let timerSeconds = 899;

function initCartPage() {
    if (!document.getElementById('cartBody')) return;
    renderCart();
    setInterval(updateTimer, 1000);
}

function renderCart() {
    const tbody = document.getElementById('cartBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        const lineTotal = item.price * item.qty;
        const displayTotal = (lineTotal + (item.id === 1 ? 0.99 : item.id === 3 ? -0.01 : 0)).toFixed(2);
        row.innerHTML = `
            <td><div class="product-cell">
                <div class="product-img" style="background:${item.color}"></div>
                <div class="product-info">
                    <div class="product-name">${item.name}</div>
                    <div class="product-sku">SKU: ${item.sku}</div>
                    ${!item.available ? '<div class="product-unavailable">Currently Unavailable</div>' : ''}
                </div>
            </div></td>
            <td class="price-cell">$${item.price.toFixed(2)}</td>
            <td><input type="number" class="qty-input" value="${item.qty}" min="1" max="99" data-id="${item.id}"></td>
            <td class="total-cell">$${displayTotal}</td>
            <td><button class="remove-btn" data-id="${item.id}">remove</button></td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', e => {
            pendingQty[e.target.dataset.id] = parseInt(e.target.value) || 1;
            showToast('Click "update cart" to save changes', 'error');
        });
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(e.target.dataset.id);
            if (confirm('Are you sure you want to remove this item?')) {
                if (confirm('Are you REALLY sure? This action cannot be undone.')) {
                    cartItems = cartItems.filter(i => i.id !== id);
                    renderCart();
                    showToast('Item removed from cart', 'success');
                }
            }
        });
    });
    updateSummary();
    updateShippingBar();
    const cc = document.getElementById('cartCount');
    if (cc) cc.textContent = cartItems.length;
}

document.getElementById('updateCart')?.addEventListener('click', e => {
    e.preventDefault();
    Object.keys(pendingQty).forEach(id => {
        const item = cartItems.find(i => i.id === parseInt(id));
        if (item) item.qty = pendingQty[id];
    });
    pendingQty = {};
    renderCart();
    showToast('Cart updated', 'success');
});

function updateSummary() {
    const lines = document.getElementById('summaryLines');
    if (!lines) return;
    let subtotal = 0;
    cartItems.forEach(i => subtotal += i.price * i.qty);
    const displaySubtotal = subtotal + 0.99;
    const tax = displaySubtotal * 0.087;
    const couponSurcharge = couponApplied * 4.99;
    const total = displaySubtotal + tax + 2.49 + 1.99 + couponSurcharge - 0.01;
    lines.innerHTML = `
        <div class="summary-line"><span>Subtotal</span><span>$${displaySubtotal.toFixed(2)}</span></div>
        <div class="summary-line"><span>Tax (8.7%)</span><span>$${tax.toFixed(2)}</span></div>
        <div class="summary-line fee"><span>Service Fee</span><span>$2.49</span></div>
        <div class="summary-line fee"><span>Handling Fee</span><span>$1.99</span></div>
        ${couponSurcharge > 0 ? `<div class="summary-line"><span>Coupon Adjustment</span><span>+$${couponSurcharge.toFixed(2)}</span></div>` : ''}
        <div class="summary-line"><span>Discount</span><span>-$0.01</span></div>
    `;
    const el = document.getElementById('totalAmount');
    if (el) el.textContent = `$${total.toFixed(2)}`;
}

function updateShippingBar() {
    let subtotal = 0;
    cartItems.forEach(i => subtotal += i.price * i.qty);
    const threshold = subtotal + 14.01 + Math.random() * 5;
    const remaining = (threshold - subtotal).toFixed(2);
    const pct = Math.min((subtotal / threshold) * 100, 92);
    const fill = document.getElementById('shippingFill');
    const text = document.getElementById('shippingText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = `You're only $${remaining} away from FREE shipping!`;
}

document.getElementById('couponBtn')?.addEventListener('click', () => {
    const input = document.getElementById('couponInput');
    const code = input?.value.trim();
    if (!code) { showToast('Please enter a coupon code', 'error'); return; }
    couponApplied++;
    input.value = '';
    showToast(`Coupon "${code}" applied successfully!`, 'success');
    updateSummary();
});

document.getElementById('checkoutLink')?.addEventListener('click', e => {
    e.preventDefault();
    checkoutClicks++;
    const msgs = [
        'Please review your cart before proceeding',
        'Cannot checkout: some items are unavailable',
        'Session timed out. Please try again.',
        'Error: Cart has been updated. Please review again.',
        'Checkout is currently undergoing maintenance.'
    ];
    if (checkoutClicks === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
    if (checkoutClicks === 4) setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 2000);
    showToast(msgs[(checkoutClicks - 1) % msgs.length], 'error');
    if (checkoutClicks >= 5) checkoutClicks = 0;
});

document.getElementById('continueBtn')?.addEventListener('click', () => {
    showToast('Redirecting to shop...', 'error');
    setTimeout(() => window.location.href = 'index.html', 1500);
});

function updateTimer() {
    timerSeconds--;
    if (timerSeconds <= 0) timerSeconds = 899;
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    const el = document.getElementById('timer');
    if (el) el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    initShopPage();
    initCartPage();

    // Auto-trigger newsletter if no cookie banner
    if (document.getElementById('cookieBanner')?.classList.contains('hidden')) {
        triggerNewsletter();
    }
});
