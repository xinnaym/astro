// ASTRO WEB APPLICATION LOGIC (Vanilla JS)

let currentProduct = null;
let selectedSize = 'M';
let selectedColor = '';
let currentFilterCategory = 'Все';
let currentFilterSize = 'Все';
let currentFilterStyle = 'Все';
let currentFilterColor = 'Все';
let currentFilterMaxPrice = 30000;
let currentSearchQuery = '';
let currentSortBy = 'newest';
let selectedShippingCost = 490;
let selectedDeliveryTitle = 'Курьер до двери';
let selectedPaymentTitle = 'СБП (Система быстрых платежей)';
let osmMapInstance = null;

// ==========================================
// 1. ROUTING & PAGE SYSTEM
// ==========================================
function showPage(pageId, params = {}) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Activate target
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  } else {
    document.getElementById('page-home').classList.add('active');
    pageId = 'home';
  }

  // Update nav active link states
  document.querySelectorAll('.nav-links-desktop a').forEach(a => {
    a.classList.remove('active');
  });
  const navItem = document.getElementById(`nav-link-${pageId}`);
  if (navItem) navItem.classList.add('active');

  // Page-specific renders
  if (pageId === 'home') {
    renderHomePopular();
  } else if (pageId === 'catalog') {
    if (params.category) {
      currentFilterCategory = params.category;
      syncCategoryTabsUI();
    }
    renderCatalog();
  } else if (pageId === 'product') {
    const prodId = params.id || (AstroStore.getProducts()[0]?.id);
    loadProductDetail(prodId);
  } else if (pageId === 'cart') {
    renderCart();
  } else if (pageId === 'profile') {
    const user = AstroStore.getCurrentUser();
    if (!user) {
      showToast('Сначала войдите в систему');
      showPage('login');
      return;
    }
    renderProfile(params.tab || 'info');
  } else if (pageId === 'contacts') {
    setTimeout(initOpenStreetMap, 150);
  }

  // Update hash
  let hashStr = `#${pageId}`;
  if (params && Object.keys(params).length > 0) {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    hashStr += `?${query}`;
  }
  window.location.hash = hashStr;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Read hash on load & popstate
window.addEventListener('DOMContentLoaded', () => {
  updateCartCounters();
  updateWishlistCounters();
  updateAuthNavButton();

  // Parse initial route
  parseHashAndNavigate();
});

window.addEventListener('hashchange', () => {
  parseHashAndNavigate();
});

function parseHashAndNavigate() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw) {
    showPage('home');
    return;
  }
  const [page, query] = raw.split('?');
  const params = {};
  if (query) {
    query.split('&').forEach(part => {
      const [k, v] = part.split('=');
      if (k) params[k] = decodeURIComponent(v || '');
    });
  }
  showPage(page || 'home', params);
}

// Mobile menu toggle
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  drawer.classList.toggle('open');
}

// Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Auth nav button updater
function updateAuthNavButton() {
  const user = AstroStore.getCurrentUser();
  const btn = document.getElementById('nav-auth-btn');
  const mobLink = document.getElementById('mobile-auth-link');
  if (user) {
    btn.innerHTML = `<span>Кабинет (${user.firstName})</span>`;
    if (mobLink) mobLink.textContent = `Кабинет (${user.firstName})`;
  } else {
    btn.innerHTML = `<span>Вход</span>`;
    if (mobLink) mobLink.textContent = `Вход / Регистрация`;
  }
}

function handleAuthNav() {
  const user = AstroStore.getCurrentUser();
  if (user) {
    showPage('profile');
  } else {
    showPage('login');
  }
}

// ==========================================
// 2. PRODUCT CARDS & HOME POPULAR
// ==========================================
function createProductCardHTML(p) {
  const isWished = AstroStore.isInWishlist(p.id);
  return `
    <div class="product-card" onclick="showPage('product', { id: '${p.id}' })">
      <div class="product-img-wrap">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.pexels.com/photos/9645058/pexels-photo-9645058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600'">
        ${p.badge ? `<span class="product-tag">${p.badge}</span>` : ''}
        <button class="product-wish-btn ${isWished ? 'active' : ''}" onclick="handleCardWishToggle(event, '${p.id}')">
          ♥
        </button>
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category} · ${p.style}</span>
        <h4 class="product-name">${p.name}</h4>
        <div class="product-price-row">
          <div>
            <span class="product-price">${p.price}</span>
            ${p.oldPrice ? `<span class="product-old-price">${p.oldPrice}</span>` : ''}
          </div>
          <button class="btn-primary" style="padding:6px 12px;font-size:11px" onclick="handleCardQuickAdd(event, '${p.id}')">
            В корзину
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderHomePopular() {
  const container = document.getElementById('home-popular-grid');
  if (!container) return;
  const products = AstroStore.getProducts().slice(0, 4);
  container.innerHTML = products.map(p => createProductCardHTML(p)).join('');
}

function handleCardWishToggle(e, id) {
  e.stopPropagation();
  const list = AstroStore.toggleWishlist(id);
  updateWishlistCounters();
  const added = list.includes(id);
  showToast(added ? 'Добавлено в список желаний' : 'Удалено из списка желаний');

  // Re-render target card heart
  const btn = e.currentTarget;
  btn.classList.toggle('active', added);
}

function handleCardQuickAdd(e, id) {
  e.stopPropagation();
  const p = AstroStore.getProductById(id);
  AstroStore.addToCart(p, p.sizes[0], p.colorName, 1);
  updateCartCounters();
  showToast(`«${p.name}» добавлен в корзину`);
}

// ==========================================
// 3. CATALOG & FILTERS
// ==========================================
function renderCatalog() {
  const grid = document.getElementById('catalog-products-grid');
  const countText = document.getElementById('catalog-count-text');
  if (!grid) return;

  let list = AstroStore.getProducts();

  // 1. Category Filter
  if (currentFilterCategory !== 'Все') {
    list = list.filter(p => p.category === currentFilterCategory);
  }

  // 2. Size Filter
  if (currentFilterSize !== 'Все') {
    list = list.filter(p => p.sizes.some(s => s.includes(currentFilterSize)));
  }

  // 3. Style Filter
  if (currentFilterStyle !== 'Все') {
    list = list.filter(p => p.style === currentFilterStyle);
  }

  // 4. Color Filter
  if (currentFilterColor !== 'Все') {
    list = list.filter(p => p.colorName.toLowerCase().includes(currentFilterColor.toLowerCase()));
  }

  // 5. Price Filter
  list = list.filter(p => p.priceNum <= currentFilterMaxPrice);

  // 6. Search Query
  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.details.toLowerCase().includes(q)
    );
  }

  // 7. Sort
  if (currentSortBy === 'price-asc') {
    list.sort((a, b) => a.priceNum - b.priceNum);
  } else if (currentSortBy === 'price-desc') {
    list.sort((a, b) => b.priceNum - a.priceNum);
  } else if (currentSortBy === 'popular') {
    list.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
  } else {
    // Newest / Default
    list.sort((a, b) => (b.badge === 'Новинка' ? 1 : 0) - (a.badge === 'Новинка' ? 1 : 0));
  }

  countText.textContent = `Показано моделей: ${list.length}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--gray)">
        <h3>По вашему запросу ничего не найдено</h3>
        <p style="margin-top:8px;font-size:13px">Попробуйте сбросить фильтры или изменить параметры поиска</p>
        <button class="btn-primary" style="margin-top:16px" onclick="resetCatalogFilters()">Сбросить фильтры</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(p => createProductCardHTML(p)).join('');
}

function setCatalogCategory(cat, btn) {
  currentFilterCategory = cat;
  document.querySelectorAll('#catalog-category-tabs .filter-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function filterCatalogCategory(cat) {
  currentFilterCategory = cat;
  showPage('catalog', { category: cat });
}

function syncCategoryTabsUI() {
  document.querySelectorAll('#catalog-category-tabs .filter-tab').forEach(b => {
    b.classList.toggle('active', b.textContent.includes(currentFilterCategory));
  });
}

function setCatalogSize(size, btn) {
  currentFilterSize = size;
  document.querySelectorAll('#size-filter-options .sidebar-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function setCatalogStyle(style, btn) {
  currentFilterStyle = style;
  document.querySelectorAll('#style-filter-options .sidebar-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function setCatalogColor(color, btn) {
  currentFilterColor = color;
  document.querySelectorAll('#color-filter-options .sidebar-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function setCatalogMaxPrice(val) {
  currentFilterMaxPrice = Number(val);
  document.getElementById('price-slider-val').textContent = `${Number(val).toLocaleString('ru-RU')} ₽`;
  renderCatalog();
}

function setCatalogSort(val) {
  currentSortBy = val;
  renderCatalog();
}

function handleLiveSearch(query) {
  currentSearchQuery = query;
  if (!document.getElementById('page-catalog').classList.contains('active')) {
    showPage('catalog');
  } else {
    renderCatalog();
  }
}

function resetCatalogFilters() {
  currentFilterCategory = 'Все';
  currentFilterSize = 'Все';
  currentFilterStyle = 'Все';
  currentFilterColor = 'Все';
  currentFilterMaxPrice = 30000;
  currentSearchQuery = '';
  currentSortBy = 'newest';

  document.getElementById('catalog-price-slider').value = 30000;
  document.getElementById('price-slider-val').textContent = '30 000 ₽';
  document.getElementById('global-search-input').value = '';
  document.getElementById('catalog-sort').value = 'newest';

  syncCategoryTabsUI();
  document.querySelectorAll('.sidebar-pill').forEach(b => {
    if (b.textContent === 'Все') b.classList.add('active');
    else b.classList.remove('active');
  });

  renderCatalog();
}

// ==========================================
// 4. PRODUCT DETAIL (PDP)
// ==========================================
function loadProductDetail(id) {
  currentProduct = AstroStore.getProductById(id);
  if (!currentProduct) return;

  selectedSize = currentProduct.sizes[0] || 'M';
  selectedColor = currentProduct.colorName || 'Стандарт';

  // Breadcrumb
  document.getElementById('pdp-breadcrumb').innerHTML = `
    <a onclick="showPage('catalog')">Каталог</a> / ${currentProduct.category} / <span>${currentProduct.name}</span>
  `;

  // Gallery
  const mainImg = document.getElementById('pdp-main-image');
  mainImg.src = currentProduct.images[0];
  mainImg.alt = currentProduct.name;

  const thumbsWrap = document.getElementById('pdp-thumbs-container');
  thumbsWrap.innerHTML = currentProduct.images.map((img, i) => `
    <div class="pdp-thumb ${i === 0 ? 'active' : ''}" onclick="selectPDPImage('${img}', this)">
      <img src="${img}" alt="">
    </div>
  `).join('');

  // Info
  document.getElementById('pdp-category-badge').textContent = `${currentProduct.category} · ${currentProduct.subCategory}`;
  document.getElementById('pdp-title').textContent = currentProduct.name;
  document.getElementById('pdp-price').textContent = currentProduct.price;
  document.getElementById('pdp-description').textContent = currentProduct.desc;
  document.getElementById('pdp-selected-color-name').textContent = currentProduct.colorName;

  // Colors
  const colorsWrap = document.getElementById('pdp-colors-container');
  colorsWrap.innerHTML = currentProduct.colors.map((hex, i) => `
    <div
      class="color-swatch ${i === 0 ? 'active' : ''}"
      style="background:${hex}"
      title="${hex}"
      onclick="selectPDPColor('${hex}', this)"
    ></div>
  `).join('');

  // Sizes
  const sizesWrap = document.getElementById('pdp-sizes-container');
  sizesWrap.innerHTML = currentProduct.sizes.map((sz, i) => `
    <button class="size-box ${i === 0 ? 'active' : ''}" onclick="selectPDPSize('${sz}', this)">
      ${sz}
    </button>
  `).join('');

  // Wish button state
  const isWished = AstroStore.isInWishlist(currentProduct.id);
  const wishBtn = document.getElementById('pdp-wish-toggle-btn');
  wishBtn.style.color = isWished ? 'var(--coral)' : 'var(--black)';

  // Specs & Care
  const detailsBox = document.getElementById('pdp-details-box');
  detailsBox.innerHTML = currentProduct.details.split('\n').map(line => `<div>• ${line}</div>`).join('');

  // Reviews list
  renderPDPReviews();
}

function selectPDPImage(src, thumb) {
  document.getElementById('pdp-main-image').src = src;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function selectPDPColor(hex, swatch) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
}

function selectPDPSize(sz, btn) {
  selectedSize = sz;
  document.querySelectorAll('.size-box').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function handleAddToCartFromPDP() {
  if (!currentProduct) return;
  AstroStore.addToCart(currentProduct, selectedSize, selectedColor, 1);
  updateCartCounters();
  showToast(`«${currentProduct.name}» (${selectedSize}) добавлен в корзину`);
}

function handleToggleWishFromPDP() {
  if (!currentProduct) return;
  const list = AstroStore.toggleWishlist(currentProduct.id);
  updateWishlistCounters();
  const added = list.includes(currentProduct.id);
  document.getElementById('pdp-wish-toggle-btn').style.color = added ? 'var(--coral)' : 'var(--black)';
  showToast(added ? 'Добавлено в список желаний' : 'Удалено из списка желаний');
}

function renderPDPReviews() {
  const container = document.getElementById('pdp-reviews-grid');
  if (!container || !currentProduct) return;

  const reviews = currentProduct.reviews || [];
  if (reviews.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;color:var(--gray)">Пока нет отзывов. Будьте первым!</div>`;
    return;
  }

  container.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div style="color:#f59e0b;margin-bottom:6px">
        ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
      </div>
      <p style="font-size:13px;line-height:1.5;margin-bottom:10px">«${r.text}»</p>
      <div style="font-size:11px;color:var(--gray);display:flex;justify-content:space-between">
        <strong>${r.author}</strong>
        <span>${r.date}</span>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 5. CART & CHECKOUT
// ==========================================
function updateCartCounters() {
  const cart = AstroStore.getCart();
  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);
  document.getElementById('cart-count-badge').textContent = totalQty;
  document.getElementById('cart-count-mobile').textContent = totalQty;
}

function updateWishlistCounters() {
  const list = AstroStore.getWishlist();
  document.getElementById('wishlist-count-badge').textContent = list.length;
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const cart = AstroStore.getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="padding:60px 0;text-align:center;color:var(--gray)">
        <h3>Ваша корзина пуста</h3>
        <p style="font-size:13px;margin:8px 0 20px">Добавьте понравившиеся вещи из каталога Astro</p>
        <button class="btn-primary" onclick="showPage('catalog')">Перейти в каталог</button>
      </div>
    `;
    updateCartSummary(0);
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <img src="${item.image}" alt="">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Размер: ${item.size} · Цвет: ${item.color}</div>
        <span class="cart-item-remove" onclick="handleRemoveCartItem('${item.itemKey}')">Удалить</span>
      </div>
      <div class="cart-item-right">
        <div class="qty-stepper">
          <button onclick="handleUpdateCartQty('${item.itemKey}', -1)">–</button>
          <span>${item.qty}</span>
          <button onclick="handleUpdateCartQty('${item.itemKey}', 1)">+</button>
        </div>
        <div style="font-family:var(--font-mono);font-weight:700">
          ${(item.priceNum * item.qty).toLocaleString('ru-RU')} ₽
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((acc, i) => acc + (i.priceNum * i.qty), 0);
  updateCartSummary(subtotal);

  // Pre-fill recipient if logged in
  const user = AstroStore.getCurrentUser();
  if (user) {
    const recField = document.getElementById('checkout-recipient');
    if (recField && !recField.value) {
      recField.value = `${user.firstName} ${user.lastName || ''}`.trim();
    }
  }
}

function handleUpdateCartQty(itemKey, delta) {
  AstroStore.updateCartQty(itemKey, delta);
  updateCartCounters();
  renderCart();
}

function handleRemoveCartItem(itemKey) {
  AstroStore.removeFromCart(itemKey);
  updateCartCounters();
  renderCart();
  showToast('Товар удален из корзины');
}

function selectDeliveryMethod(title, cost, el) {
  selectedDeliveryTitle = title;
  selectedShippingCost = cost;
  document.querySelectorAll('#delivery-radio-group .radio-item').forEach(r => r.classList.remove('active'));
  el.classList.add('active');

  const cart = AstroStore.getCart();
  const subtotal = cart.reduce((acc, i) => acc + (i.priceNum * i.qty), 0);
  updateCartSummary(subtotal);
}

function selectPaymentMethod(title, el) {
  selectedPaymentTitle = title;
  document.querySelectorAll('#payment-radio-group .radio-item').forEach(r => r.classList.remove('active'));
  el.classList.add('active');
}

function updateCartSummary(subtotal) {
  const total = subtotal > 0 ? (subtotal + selectedShippingCost) : 0;
  document.getElementById('cart-summary-subtotal').textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
  document.getElementById('cart-summary-shipping').textContent = selectedShippingCost === 0 ? 'Бесплатно' : `${selectedShippingCost} ₽`;
  document.getElementById('cart-summary-total').textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

function handlePlaceOrder() {
  const cart = AstroStore.getCart();
  if (cart.length === 0) {
    showToast('Ваша корзина пуста');
    return;
  }

  const address = document.getElementById('checkout-address').value.trim();
  const recipient = document.getElementById('checkout-recipient').value.trim();

  if (!address || !recipient) {
    showToast('Пожалуйста, укажите адрес и данные получателя');
    return;
  }

  const subtotal = cart.reduce((acc, i) => acc + (i.priceNum * i.qty), 0);
  const total = subtotal + selectedShippingCost;

  const order = AstroStore.createOrder({
    total: total,
    delivery: selectedDeliveryTitle,
    payment: selectedPaymentTitle,
    address: `${address} (Получатель: ${recipient})`,
    items: cart.map(i => ({
      name: i.name,
      size: i.size,
      color: i.color,
      qty: i.qty,
      price: i.price
    }))
  });

  updateCartCounters();
  showToast(`Заказ № ${order.id} успешно оформлен!`);

  // Redirect to profile orders tab
  showPage('profile', { tab: 'orders' });
}

// ==========================================
// 6. PROFILE LOGIC
// ==========================================
function renderProfile(tab = 'info') {
  const user = AstroStore.getCurrentUser();
  if (!user) return;

  document.getElementById('profile-greeting').textContent = `ЛИЧНЫЙ КАБИНЕТ · ${user.firstName.toUpperCase()}`;

  // Fill form
  document.getElementById('prof-firstname').value = user.firstName || '';
  document.getElementById('prof-lastname').value = user.lastName || '';
  document.getElementById('prof-email').value = user.email || '';
  document.getElementById('prof-birthdate').value = user.birthDate || '';
  document.getElementById('prof-size').value = user.preferredSize || 'M';
  document.getElementById('prof-preference').value = user.clothingPreference || '';
  document.getElementById('prof-newsletter-checkbox').checked = user.isSubscribed ?? true;

  // Render orders
  const orders = AstroStore.getOrders();
  const ordersList = document.getElementById('profile-orders-list');
  if (orders.length === 0) {
    ordersList.innerHTML = `<p style="color:var(--gray)">У вас пока нет заказов</p>`;
  } else {
    ordersList.innerHTML = orders.map(ord => `
      <div style="border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <strong>№ ${ord.id}</strong>
          <span style="font-size:11px;padding:2px 8px;border-radius:4px;background:#e8f5e9;color:#2e7d32;font-weight:700">
            ${ord.status}
          </span>
        </div>
        <div style="font-size:12px;color:var(--gray);margin-bottom:8px">
          Дата: ${ord.date} · Доставка: ${ord.delivery} · Оплата: ${ord.payment}
        </div>
        <div style="font-size:13px;border-top:1px solid var(--border);padding-top:8px">
          ${ord.items.map(i => `<div>${i.name} (${i.size}, ${i.color}) x${i.qty}</div>`).join('')}
        </div>
        <div style="text-align:right;font-family:var(--font-mono);font-weight:700;margin-top:8px">
          Итого: ${ord.total.toLocaleString('ru-RU')} ₽
        </div>
      </div>
    `).join('');
  }

  // Render Wishlist in profile
  const wishIds = AstroStore.getWishlist();
  const wishProducts = AstroStore.getProducts().filter(p => wishIds.includes(p.id));
  const wishGrid = document.getElementById('profile-wishlist-grid');
  if (wishProducts.length === 0) {
    wishGrid.innerHTML = `<div style="grid-column:1/-1;color:var(--gray)">Список желаний пуст</div>`;
  } else {
    wishGrid.innerHTML = wishProducts.map(p => createProductCardHTML(p)).join('');
  }

  // Switch to requested tab
  switchProfileTab(tab);
}

function switchProfileTab(tabName, linkEl) {
  document.querySelectorAll('.profile-nav-link').forEach(l => l.classList.remove('active'));
  if (linkEl) {
    linkEl.classList.add('active');
  } else {
    document.querySelectorAll('.profile-nav-link').forEach(l => {
      if (l.getAttribute('onclick')?.includes(tabName)) l.classList.add('active');
    });
  }

  document.querySelectorAll('.profile-tab-content').forEach(c => c.style.display = 'none');
  const target = document.getElementById(`prof-tab-${tabName}`);
  if (target) target.style.display = 'block';
}

function handleUpdateProfileSubmit(e) {
  e.preventDefault();
  const updated = AstroStore.updateUserProfile({
    firstName: document.getElementById('prof-firstname').value.trim(),
    lastName: document.getElementById('prof-lastname').value.trim(),
    birthDate: document.getElementById('prof-birthdate').value,
    preferredSize: document.getElementById('prof-size').value,
    clothingPreference: document.getElementById('prof-preference').value.trim()
  });
  updateAuthNavButton();
  showToast('Данные профиля сохранены в локальное хранилище!');
}

function handleToggleNewsletter(checked) {
  AstroStore.updateUserProfile({ isSubscribed: checked });
  showToast(checked ? 'Подписка на рассылку активирована' : 'Подписка отключена');
}

function handleLogoutUser() {
  AstroStore.logoutUser();
  updateAuthNavButton();
  showToast('Вы вышли из системы');
  showPage('home');
}

// ==========================================
// 7. AUTH (LOGIN & REGISTER - NO DEMO BUTTON!)
// ==========================================
function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;

  try {
    const user = AstroStore.loginUser(email, pass);
    updateAuthNavButton();
    showToast(`Добро пожаловать, ${user.firstName}!`);
    showPage('profile');
  } catch (err) {
    showToast(err.message);
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();
  const firstName = document.getElementById('reg-firstname').value.trim();
  const lastName = document.getElementById('reg-lastname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const passwordConfirm = document.getElementById('reg-password-confirm').value;
  const birthDate = document.getElementById('reg-birthdate').value;
  const preferredSize = document.getElementById('reg-size').value;
  const clothingPreference = document.getElementById('reg-preference').value;

  if (password !== passwordConfirm) {
    showToast('Пароли не совпадают');
    return;
  }

  if (password.length < 6) {
    showToast('Пароль должен содержать минимум 6 знаков');
    return;
  }

  try {
    const newUser = AstroStore.registerUser({
      firstName,
      lastName,
      email,
      password,
      birthDate,
      preferredSize,
      clothingPreference
    });
    updateAuthNavButton();
    showToast(`Аккаунт ${newUser.firstName} успешно создан!`);
    showPage('profile');
  } catch (err) {
    showToast(err.message);
  }
}

// ==========================================
// 8. OPENSTREETMAP LEAFLET INTEGRATION
// ==========================================
function initOpenStreetMap() {
  const mapElement = document.getElementById('osm-map');
  if (!mapElement) return;

  // Check Leaflet loaded
  if (typeof L === 'undefined') {
    mapElement.innerHTML = `
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=55.9100%2C53.6200%2C55.9500%2C53.6400&amp;layer=mapnik&amp;marker=53.6302%2C55.9311"
      ></iframe>
    `;
    return;
  }

  const lat = 53.6302;
  const lon = 55.9311;

  if (osmMapInstance) {
    osmMapInstance.invalidateSize();
    return;
  }

  try {
    osmMapInstance = L.map('osm-map').setView([lat, lon], 15);

    // OpenStreetMap standard tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }).addTo(osmMapInstance);

    // Custom marker
    const marker = L.marker([lat, lon]).addTo(osmMapInstance);
    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;line-height:1.4">
        <strong style="font-size:13px;color:#111215">ASTRO Concept Store ✦</strong><br>
        г. Стерлитамак, пр-кт Октября, 46<br>
        <span style="color:#717684">Часы работы: 10:00 – 22:00</span>
      </div>
    `).openPopup();

    setTimeout(() => {
      osmMapInstance.invalidateSize();
    }, 200);
  } catch (err) {
    console.warn('Leaflet init warning:', err);
  }
}

// ==========================================
// 9. FEEDBACK & MODALS
// ==========================================
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value.trim();

  AstroStore.saveMessage({ name, email, subject, message });
  showToast('Спасибо! Ваше сообщение сохранено и отправлено в Astro.');

  document.getElementById('contact-form').reset();
}

// Size guide modal
function openSizeGuideModal() {
  document.getElementById('modal-size-guide').classList.add('open');
}
function closeSizeGuideModal() {
  document.getElementById('modal-size-guide').classList.remove('open');
}

// Add review modal
function openAddReviewModal() {
  document.getElementById('modal-add-review').classList.add('open');
}
function closeAddReviewModal() {
  document.getElementById('modal-add-review').classList.remove('open');
}
function handleReviewSubmit(e) {
  e.preventDefault();
  if (!currentProduct) return;
  const rating = Number(document.getElementById('review-rating').value);
  const author = document.getElementById('review-author').value.trim();
  const text = document.getElementById('review-text').value.trim();

  AstroStore.addReview(currentProduct.id, { rating, author, text });
  renderPDPReviews();
  closeAddReviewModal();
  showToast('Ваш отзыв опубликован!');
}

// Forgot password modal
function openForgotPasswordModal() {
  document.getElementById('modal-forgot-password').classList.add('open');
}
function closeForgotPasswordModal() {
  document.getElementById('modal-forgot-password').classList.remove('open');
}
function handleForgotPasswordSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value.trim();
  closeForgotPasswordModal();
  showToast(`Инструкция по сбросу отправлена на ${email}`);
}
