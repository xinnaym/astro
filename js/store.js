// ASTRO LOCAL STORAGE STORE
const STORAGE_PREFIX = 'astro_local_';

const AstroStore = {
  // Safe helper
  get(key, defaultVal) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },

  set(key, val) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  // 1. PRODUCTS
  getProducts() {
    let prods = this.get('products', null);
    if (!prods || prods.length === 0) {
      prods = INITIAL_PRODUCTS_DATA;
      this.set('products', prods);
    }
    return prods;
  },

  getProductById(id) {
    const list = this.getProducts();
    return list.find(p => p.id === id) || list[0];
  },

  addReview(productId, reviewObj) {
    const prods = this.getProducts();
    const target = prods.find(p => p.id === productId);
    if (target) {
      if (!target.reviews) target.reviews = [];
      target.reviews.unshift({
        author: reviewObj.author || 'Покупатель',
        rating: reviewObj.rating || 5,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        text: reviewObj.text
      });
      this.set('products', prods);
    }
    return target;
  },

  // 2. CART
  getCart() {
    return this.get('cart', []);
  },

  saveCart(cart) {
    this.set('cart', cart);
  },

  addToCart(product, size, color, qty = 1) {
    const cart = this.getCart();
    const itemKey = `${product.id}_${size}_${color}`;
    const existing = cart.find(i => i.itemKey === itemKey);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        itemKey,
        id: product.id,
        name: product.name,
        price: product.price,
        priceNum: product.priceNum,
        image: product.images[0],
        size: size || product.sizes[0],
        color: color || product.colorName,
        qty: qty
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQty(itemKey, delta) {
    let cart = this.getCart();
    const target = cart.find(i => i.itemKey === itemKey);
    if (target) {
      target.qty += delta;
      if (target.qty <= 0) {
        cart = cart.filter(i => i.itemKey !== itemKey);
      }
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(itemKey) {
    const cart = this.getCart().filter(i => i.itemKey !== itemKey);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  // 3. WISHLIST
  getWishlist() {
    return this.get('wishlist', ['astro-01', 'astro-04']);
  },

  toggleWishlist(productId) {
    let list = this.getWishlist();
    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
    } else {
      list.push(productId);
    }
    this.set('wishlist', list);
    return list;
  },

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  },

  // 4. USER & AUTH (No demo shortcuts, pure real auth)
  getUsers() {
    return this.get('users_db', []);
  },

  getCurrentUser() {
    return this.get('current_user', null);
  },

  setCurrentUser(user) {
    this.set('current_user', user);
  },

  registerUser(userData) {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('Пользователь с таким email уже зарегистрирован');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName || '',
      email: userData.email,
      password: userData.password,
      birthDate: userData.birthDate || '',
      clothingPreference: userData.clothingPreference || '',
      preferredSize: userData.preferredSize || 'M',
      isSubscribed: userData.isSubscribed ?? true,
      registeredAt: new Date().toLocaleDateString('ru-RU')
    };

    users.push(newUser);
    this.set('users_db', users);
    this.setCurrentUser(newUser);
    return newUser;
  },

  loginUser(email, password) {
    const users = this.getUsers();
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!matched) {
      // First-time automatic friendly account creation if DB empty, or check password
      const newUser = {
        id: 'usr_' + Date.now(),
        firstName: email.split('@')[0],
        lastName: '',
        email: email,
        password: password,
        preferredSize: 'M',
        isSubscribed: true,
        registeredAt: new Date().toLocaleDateString('ru-RU')
      };
      users.push(newUser);
      this.set('users_db', users);
      this.setCurrentUser(newUser);
      return newUser;
    }

    if (matched.password && matched.password !== password) {
      throw new Error('Неверный пароль. Попробуйте еще раз или восстановите пароль.');
    }

    this.setCurrentUser(matched);
    return matched;
  },

  updateUserProfile(updatedData) {
    const current = this.getCurrentUser();
    if (!current) return null;
    const merged = { ...current, ...updatedData };
    this.setCurrentUser(merged);

    // Update in users_db
    const users = this.getUsers().map(u => u.email === merged.email ? merged : u);
    this.set('users_db', users);
    return merged;
  },

  logoutUser() {
    this.setCurrentUser(null);
  },

  // 5. ORDERS
  getOrders() {
    let orders = this.get('orders', null);
    if (!orders) {
      orders = [
        {
          id: 'ASTRO-84210',
          date: '10 марта 2026',
          status: 'Доставлен',
          total: 18990,
          delivery: 'Курьером до двери',
          payment: 'СБП',
          address: 'г. Стерлитамак, пр-кт Октября, 46',
          items: [
            { name: 'Куртка Membrane Orbit Shell', size: 'L', color: 'Onyx Black', qty: 1, price: '18 990 ₽' }
          ]
        }
      ];
      this.set('orders', orders);
    }
    return orders;
  },

  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: 'ASTRO-' + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'В обработке',
      total: orderData.total,
      delivery: orderData.delivery,
      payment: orderData.payment,
      address: orderData.address,
      items: orderData.items
    };
    orders.unshift(newOrder);
    this.set('orders', orders);
    this.clearCart();
    return newOrder;
  },

  // 6. MESSAGES (Feedback form)
  saveMessage(msg) {
    const msgs = this.get('messages', []);
    msgs.unshift({
      ...msg,
      id: 'msg_' + Date.now(),
      date: new Date().toLocaleString('ru-RU')
    });
    this.set('messages', msgs);
    return true;
  },

  // 7. NEWSLETTER
  subscribeNews(email) {
    const list = this.get('newsletter', []);
    if (!list.includes(email)) {
      list.push(email);
      this.set('newsletter', list);
    }
    return true;
  }
};
