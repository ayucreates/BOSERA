/* =====================================================
   BOSERA Mobile — app logic + API client.
   Talks to the real server/ REST API (/api/products,
   /api/auth, /api/cart). Cart/wishlist/orders persist in
   localStorage so browsing works before login.
   ===================================================== */
(function () {
  'use strict';

  // Configurable API base — set via <meta name="api-base" content="https://api.example.com">
  // or window.BOSERA_API_BASE = 'https://api.example.com' before this script loads.
  // Empty string = same-origin (current SQLite server).
  var API_BASE = (function () {
    var meta = document.querySelector('meta[name="api-base"]');
    if (meta && meta.content) return meta.content.replace(/\/+$/, '');
    if (window.BOSERA_API_BASE) return String(window.BOSERA_API_BASE).replace(/\/+$/, '');
    return '';
  })();

  var LS_CART = 'lbz_cart';
  var LS_WISH = 'lbz_wishlist';
  var LS_ORDERS = 'lbz_orders';
  var LS_USER = 'lbz_user';
  var FREE_SHIP = 499;
  var SHIP_FEE = 99;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
  }
  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  // ---------- Products ----------
  function fetchProducts() {
    if (window._productsPromise) return window._productsPromise;
    window._productsPromise = fetch(apiUrl('/api/products'))
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load products');
        return r.json();
      })
      .then(function (data) { return data.products || data || []; })
      .catch(function (e) {
        window._productsPromise = null;
        throw e;
      });
    return window._productsPromise;
  }

  function searchProducts(q) {
    return fetchProducts().then(function (list) {
      if (!q) return list;
      return list.filter(function (p) {
        return (p.name || '').toLowerCase().indexOf(q) !== -1 ||
               (p.category_name || '').toLowerCase().indexOf(q) !== -1;
      });
    });
  }

  function productBySlug(slug) {
    return fetchProducts().then(function (list) {
      return list.find(function (p) { return p.slug === slug; }) || null;
    });
  }

  // ---------- Cart (localStorage, mirrors server schema) ----------
  function getCart() { return read(LS_CART, []); }
  function saveCart(cart) {
    write(LS_CART, cart);
    emit();
  }
  var cartListeners = [];
  function emit() { cartListeners.forEach(function (fn) { fn(); }); }
  function onCartChange(fn) { cartListeners.push(fn); }

  function addToCart(product, qty) {
    var cart = getCart();
    var existing = cart.find(function (i) { return i.id === product.id; });
    if (existing) existing.qty += qty || 1;
    else cart.push({ id: product.id, product_id: product.id, slug: product.slug, name: product.name, price: product.price, image_url: product.image_url, qty: qty || 1 });
    saveCart(cart);
  }
  function updateQty(id, delta) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    saveCart(cart);
  }
  function removeFromCart(id) {
    saveCart(getCart().filter(function (i) { return i.id !== id; }));
  }
  function cartCount() { return getCart().reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartTotal() { return getCart().reduce(function (s, i) { return s + i.price * i.qty; }, 0); }
  function cartSubtotal() { return cartTotal(); }

  // ---------- Wishlist ----------
  function getWishlist() { return read(LS_WISH, []); }
  function inWishlist(id) { return getWishlist().some(function (i) { return i.id === id; }); }
  function toggleWishlist(product) {
    var w = getWishlist();
    var idx = w.findIndex(function (i) { return i.id === product.id; });
    if (idx > -1) { w.splice(idx, 1); }
    else { w.push({ id: product.id, slug: product.slug, name: product.name, price: product.price, image_url: product.image_url }); }
    write(LS_WISH, w);
    return idx === -1;
  }

  // ---------- Auth ----------
  function getAuth() { return read(LS_USER, null); }
  function isAuthed() { return !!getAuth(); }
  function setAuth(user) {
    if (user) write(LS_USER, user);
    else localStorage.removeItem(LS_USER);
    emit();
  }

  function apiLogin(email, password) {
    return fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); });
  }
  function apiRegister(name, email, password) {
    return fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, password: password }),
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); });
  }
  function apiLogout() {
    return fetch(apiUrl('/api/auth/logout'), { method: 'POST' });
  }

  // ---------- Orders (localStorage) ----------
  function getOrders() { return read(LS_ORDERS, []); }
  function saveOrders(o) { write(LS_ORDERS, o); }
  function placeOrder(details) {
    var carts = getCart();
    var id = 'BOS' + Date.now().toString().slice(-8);
    var order = {
      id: id,
      date: new Date().toISOString(),
      items: carts.map(function (c) { return { ...c }; }),
      total: cartTotal() + (cartSubtotal() >= FREE_SHIP || cartSubtotal() === 0 ? 0 : SHIP_FEE),
      subtotal: cartSubtotal(),
      shipping: cartSubtotal() >= FREE_SHIP || cartSubtotal() === 0 ? 0 : SHIP_FEE,
      status: 'placed',
      details: details,
      payment: details.payment || 'COD',
    };
    var orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    write(LS_CART, []);
    emit();
    return order;
  }
  function findOrder(id) {
    return getOrders().find(function (o) { return o.id.toUpperCase() === String(id).toUpperCase(); });
  }

  // ---------- Product card ----------
  function cardTemplate(p, opts) {
    var showAdd = (opts && opts.showAdd) || 'always-visible';
    var badge = '';
    var save = '';
    var nativeOld = p && p.old_price && Number(p.old_price) > Number(p.price);
    if (nativeOld) {
      var pct = Math.round((1 - Number(p.price) / Number(p.old_price)) * 100);
      save = pct > 0 ? '<span class="save">' + pct + '% OFF</span>' : '';
      badge = '<span class="m-badge sale">Save ' + pct + '%</span>';
    } else {
      badge = '<span class="m-badge new">BOSERA</span>';
    }
    var wished = inWishlist(p.id) ? ' active' : '';
    return '<div class="m-card">' +
      '<a class="m-card-img ' + (showAdd === 'always-visible' ? 'always-visible' : '') + '" href="/product?slug=' + encodeURIComponent(p.slug) + '">' +
      badge +
      '<button class="m-wish' + wished + '" data-wish data-id="' + p.id + '" data-name="' + esc(p.name) + '" data-price="' + p.price + '" data-slug="' + esc(p.slug) + '" data-img="' + esc(p.image_url) + '" aria-label="Wishlist"><i class="' + (wished ? 'fas' : 'far') + ' fa-heart"></i></button>' +
      '<img src="' + esc(p.image_url) + '" loading="lazy">' +
      '<span class="m-card-add">Add To Cart</span>' +
      '</a>' +
      '<div class="m-card-info">' +
      '<a class="m-card-name" href="/product?slug=' + encodeURIComponent(p.slug) + '">' + esc(p.name) + '</a>' +
      '<div class="m-card-price">' + money(p.price) + (nativeOld ? '<span class="old">' + money(p.old_price) + '</span>' + save : '') + '</div>' +
      '</div></div>';
  }

  function renderGrid(el, products) {
    if (!el) return;
    if (!products.length) {
      el.innerHTML = '<div class="m-empty" style="grid-column:1/-1;"><i class="fas fa-box-open"></i><h3>Nothing here yet</h3><p>Check back soon for new drops.</p></div>';
      return;
    }
    el.innerHTML = products.map(function (p) { return cardTemplate(p, { showAdd: 'always-visible' }); }).join('');
  }

  // ---------- Shared handlers ----------
  function bindGlobal() {
    // Hide any image that fails to load (delegated — CSP blocks inline onerror).
    document.addEventListener('error', function (e) {
      var t = e.target;
      if (t && t.tagName === 'IMG') t.style.display = 'none';
    }, true);

    document.addEventListener('click', function (e) {
      var wish = e.target.closest('[data-wish]');
      if (wish) {
        e.preventDefault();
        e.stopPropagation();
        var p = {
          id: Number(wish.dataset.id),
          name: wish.dataset.name,
          price: Number(wish.dataset.price),
          slug: wish.dataset.slug,
          image_url: wish.dataset.img,
        };
        var added = toggleWishlist(p);
        wish.classList.toggle('active', added);
        wish.querySelector('i').className = (added ? 'fas' : 'far') + ' fa-heart';
        toast(added ? 'Added to wishlist' : 'Removed from wishlist');
        refreshWishBadge();
        if (window.MOBILE_WISHLIST_GRID) window.MOBILE_WISHLIST_GRID();
        return;
      }
      var add = e.target.closest('[data-add]');
      if (add) {
        e.preventDefault();
        var prod = window._productById && window._productById[add.dataset.id];
        if (prod) { addToCart(prod); toast('Added to cart'); }
      }
      var cardAdd = e.target.closest('.m-card-add');
      if (cardAdd) {
        e.preventDefault();
        var card = cardAdd.closest('.m-card');
        var id = Number(card && card.querySelector('[data-wish]') && card.querySelector('[data-wish]').dataset.id);
        var prodById = window._productById;
        if (prodById && prodById[id]) { addToCart(prodById[id]); toast('Added to cart'); }
        else {
          var slugEl = card && card.querySelector('.m-card-name');
          if (slugEl) {
            var href = slugEl.getAttribute('href');
            var slug = href ? decodeURIComponent(href.split('slug=')[1]) : '';
            fetchProducts().then(function (list) {
              var p = list.find(function (x) { return x.slug === slug; });
              if (p) {
                window._productById = window._productById || {};
                window._productById[p.id] = p;
                addToCart(p); toast('Added to cart');
              }
            });
          }
        }
      }
    });
  }

  function refreshWishBadge() {
    var b = document.getElementById('mWishBadge');
    if (b) { b.textContent = getWishlist().length; b.classList.toggle('hidden', getWishlist().length <= 0); }
  }
  function refreshCartBadge() {
    var b = document.getElementById('mCartBadge');
    if (b) { b.textContent = cartCount(); b.classList.toggle('hidden', cartCount() <= 0); }
  }

  var toastTimer;
  function toast(msg, isError) {
    var t = document.getElementById('mToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.toggle('error', !!isError);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  // ---------- Page initializers ----------
  function index_init(api) {
    var slides = document.querySelectorAll('.m-hero-slide');
    if (slides.length > 1) {
      var i = 0;
      setInterval(function () {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
        var dots = document.querySelectorAll('.m-hero-dots span');
        dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
      }, 5000);
    }
    fetchProducts().then(function (list) {
      renderGrid(document.getElementById('mAllGrid'), list);
      renderGrid(document.getElementById('mNewGrid'), list.slice(0, 8));
    }).catch(function () { toast('Failed to load products', true); });
  }

  function category_init(api) {
    var cat = document.body.dataset.category;
    var grid = document.getElementById('mCatGrid');
    fetchProducts().then(function (list) {
      var filtered = cat && cat !== 'all'
        ? list.filter(function (p) { return (p.category_name || '').toLowerCase() === cat.toLowerCase(); })
        : list;
      renderGrid(grid, filtered);
    }).catch(function () { toast('Failed to load products', true); });
  }

  function product_init(api) {
    var slug = new URLSearchParams(window.location.search).get('slug');
    var wrap = document.getElementById('mPdpWrap');
    if (!slug) {
      wrap.innerHTML = '<div class="m-empty"><i class="fas fa-box-open"></i><h3>Product not found</h3><a class="btn btn-dark" href="/">Continue Shopping</a></div>';
      return;
    }
    productBySlug(slug).then(function (p) {
      if (!p) {
        wrap.innerHTML = '<div class="m-empty"><i class="fas fa-box-open"></i><h3>Product not found</h3><a class="btn btn-dark" href="/">Continue Shopping</a></div>';
        return;
      }
      window._productById = window._productById || {};
      window._productById[p.id] = p;
      var nativeOld = p.old_price && Number(p.old_price) > Number(p.price);
      var saveHtml = '';
      if (nativeOld) {
        var pct = Math.round((1 - Number(p.price) / Number(p.old_price)) * 100);
        saveHtml = '<span class="old">' + money(p.old_price) + '</span><span class="save">' + pct + '% OFF</span>';
      }
      var wished = inWishlist(p.id);
      wrap.innerHTML =
        '<div class="m-pdp">' +
        '  <div class="m-pdp-gallery"><img src="' + esc(p.image_url) + '" alt="' + esc(p.name) + '"></div>' +
        '  <div class="m-pdp-info">' +
        '    <div class="m-pdp-brand">' + esc(p.category_name || 'BOSERA') + '</div>' +
        '    <h1 class="m-pdp-title">' + esc(p.name) + '</h1>' +
        '    <div class="m-pdp-price">' + money(p.price) + saveHtml + '</div>' +
        '    <p class="m-pdp-desc">' + esc(p.description || 'Streetwear essentials crafted for bold, unisex fits.') + '</p>' +
        '    <div class="m-pdp-size"><h4>Select Size</h4><div id="mSizes">' +
        ['XS','S','M','L','XL','XXL'].map(function (s) { return '<button class="m-size-opt' + (s === 'M' ? ' sel' : '') + '">' + s + '</button>'; }).join('') +
        '    </div></div>' +
        '  </div>' +
        '  <div class="m-pdp-actions">' +
        '    <button class="m-wish-big' + (wished ? ' active' : '') + '" id="mPdpWish" aria-label="Wishlist"><i class="' + (wished ? 'fas' : 'far') + ' fa-heart"></i></button>' +
        '    <button class="btn btn-dark" id="mPdpAdd">Add To Cart</button>' +
        '  </div>' +
        '</div>';

      document.getElementById('mSizes').addEventListener('click', function (e) {
        var s = e.target.closest('.m-size-opt');
        if (!s) return;
        document.querySelectorAll('.m-size-opt').forEach(function (o) { o.classList.remove('sel'); });
        s.classList.add('sel');
      });
      document.getElementById('mPdpAdd').addEventListener('click', function () {
        addToCart(p, 1);
        toast('Added to cart');
      });
      document.getElementById('mPdpWish').addEventListener('click', function () {
        var added = toggleWishlist(p);
        this.classList.toggle('active', added);
        this.querySelector('i').className = (added ? 'fas' : 'far') + ' fa-heart';
        toast(added ? 'Added to wishlist' : 'Removed from wishlist');
      });
    }).catch(function () { toast('Failed to load product', true); });
  }

  function cart_init(api) {
    var items = document.getElementById('mCartItems');
    var empty = document.getElementById('mCartEmpty');
    var subtotalEl = document.getElementById('mSubtotal');
    var shipEl = document.getElementById('mShipping');
    var totalEl = document.getElementById('mGrandTotal');
    var note = document.getElementById('mFreeNote');
    var fill = document.getElementById('mFreeLeft');

    function render() {
      var cart = getCart();
      var sub = cartSubtotal();
      var ship = sub >= FREE_SHIP || sub === 0 ? 0 : SHIP_FEE;
      items.innerHTML = cart.length ? cart.map(function (it) {
        return '<div class="m-cart-item">' +
          '<a href="/product?slug=' + encodeURIComponent(it.slug) + '"><img src="' + esc(it.image_url) + '" loading="lazy"></a>' +
          '<div class="m-cart-item-info">' +
          '  <a class="m-cart-item-name" href="/product?slug=' + encodeURIComponent(it.slug) + '">' + esc(it.name) + '</a>' +
          '  <div class="m-cart-item-price">' + money(it.price) + '</div>' +
          '  <div class="m-cart-qty">' +
          '    <button data-dir="-1" data-id="' + it.id + '">−</button><span>' + it.qty + '</span><button data-dir="1" data-id="' + it.id + '">+</button>' +
          '  </div>' +
          '</div>' +
          '<button class="m-cart-remove" data-id="' + it.id + '"><i class="fas fa-trash-alt"></i></button>' +
          '</div>';
      }).join('') : '';
      empty.style.display = cart.length ? 'none' : '';
      subtotalEl.textContent = money(sub);
      shipEl.textContent = sub === 0 ? '₹0' : (ship === 0 ? 'FREE' : money(ship));
      totalEl.textContent = money(sub + ship);
      if (sub > 0 && sub < FREE_SHIP) {
        note.style.display = '';
        fill.textContent = money(FREE_SHIP - sub);
      } else { note.style.display = 'none'; }
    }
    items.addEventListener('click', function (e) {
      var btn = e.target.closest('.m-cart-qty button, .m-cart-remove');
      if (!btn) return;
      var id = Number(btn.dataset.id);
      if (e.target.closest('.m-cart-remove')) removeFromCart(id);
      else updateQty(id, Number(btn.dataset.dir));
      render();
    });
    onCartChange(render);
    render();
  }

  function checkout_init(api) {
    var summary = document.getElementById('mCheckoutItems');
    var subEl = document.getElementById('mCheckoutSubtotal');
    var shipEl = document.getElementById('mCheckoutShipping');
    var totalEl = document.getElementById('mCheckoutTotal');

    function render() {
      var cart = getCart();
      var sub = cartSubtotal();
      var ship = sub >= FREE_SHIP || sub === 0 ? 0 : SHIP_FEE;
      summary.innerHTML = cart.map(function (it) {
        return '<div class="m-cart-item">' +
          '<a href="/product?slug=' + encodeURIComponent(it.slug) + '"><img src="' + esc(it.image_url) + '" loading="lazy"></a>' +
          '<div class="m-cart-item-info">' +
          '  <span class="m-cart-item-name">' + esc(it.name) + '</span>' +
          '  <div class="m-cart-item-price">' + money(it.price) + ' <span style="color:#888;font-weight:500;font-size:11px;">Qty: ' + it.qty + '</span></div>' +
          '  <div style="font-size:12px;font-weight:700;margin-top:6px;">' + money(it.price * it.qty) + '</div>' +
          '</div></div>';
      }).join('');
      subEl.textContent = money(sub);
      shipEl.textContent = sub === 0 ? '₹0' : (ship === 0 ? 'FREE' : money(ship));
      totalEl.textContent = money(sub + ship);
    }
    render();

    var form = document.getElementById('mCheckoutForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var details = {};
        fd.forEach(function (v, k) { details[k] = v; });
        if (!details.name || !details.phone || !details.address || !details.city || !details.state || !details.pincode) {
          toast('Please fill all required fields', true);
          return;
        }
        var order = placeOrder(details);
        window.location.href = '/order-success?order=' + order.id;
      });
    }
  }

  function orders_init(api) {
    var list = document.getElementById('mOrdersList');
    var empty = document.getElementById('mOrdersEmpty');
    var authGate = document.getElementById('mOrdersAuth');

    function statusPill(status) {
      var map = {
        placed: ['Order Placed', 'placed'],
        confirmed: ['Confirmed', 'confirmed'],
        shipped: ['Shipped', 'shipped'],
        out: ['Out for Delivery', 'shipped'],
        delivered: ['Delivered', 'delivered'],
      };
      var m = map[status] || map.placed;
      return '<span class="m-status-pill ' + m[1] + '">' + m[0] + '</span>';
    }

    function render() {
      var orders = getOrders();
      if (!getAuth() && !orders.length) { authGate.style.display = ''; list.style.display = 'none'; empty.style.display = 'none'; return; }
      authGate.style.display = 'none';
      if (!orders.length) { empty.style.display = ''; list.style.display = 'none'; return; }
      empty.style.display = 'none'; list.style.display = '';
      list.innerHTML = '';
      orders.forEach(function (o) {
        var el = document.createElement('div');
        el.className = 'm-order-card';
        var d = new Date(o.date);
        var dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        el.innerHTML =
          '<div class="m-order-top"><div><strong>Order #' + esc(o.id) + '</strong><br><small>' + dateStr + '</small></div>' + statusPill(o.status) + '</div>' +
          '<div class="m-order-items">' + (o.items || []).map(function (it) {
            return '<div class="m-order-item"><img src="' + esc(it.image_url) + '"><span class="t">' + esc(it.name) + '</span><span class="s">Qty: ' + it.qty + ' · ' + money(it.price) + '</span></div>';
          }).join('') + '</div>' +
          '<div class="m-order-foot"><span class="total">' + money(o.total) + '</span>' +
          '<a class="btn btn-outline" style="padding:9px 14px;font-size:11px;" href="/track-order?order=' + esc(o.id) + '">Track</a></div>';
        list.appendChild(el);
      });
    }
    render();
  }

  function track_init(api) {
    var form = document.getElementById('mTrackForm');
    var result = document.getElementById('mTrackResult');

    function lookup(id) {
      var order = findOrder(id);
      if (!order) {
        result.innerHTML = '<div class="m-empty"><i class="fas fa-search"></i><h3>Order not found</h3><p>We couldn\'t find an order with that ID.</p></div>';
        return;
      }
      var d = new Date(order.date);
      result.innerHTML = '<div class="m-panel"><div class="m-flex"><div><strong>Order #' + esc(order.id) + '</strong><br><small style="color:#888;">Placed on ' + d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + money(order.total) + '</small></div>' +
        '<span class="m-status-pill shipped">' + statusLabel(order.status) + '</span></div>' +
        '<div class="m-timeline">' + timeline(order.status) + '</div></div>';
    }

    function statusLabel(status) {
      return ({ placed: 'Order Placed', confirmed: 'Confirmed', shipped: 'Shipped', out: 'Out for Delivery', delivered: 'Delivered' })[status] || 'Order Placed';
    }
    function timeline(status) {
      var steps = [
        ['placed', 'Order Placed', 'Order received, awaiting confirmation.'],
        ['confirmed', 'Confirmed', 'Your order has been confirmed.'],
        ['shipped', 'Shipped', 'Packed & handed to the courier partner.'],
        ['out', 'Out for Delivery', 'Arriving soon — keep your phone handy.'],
        ['delivered', 'Delivered', 'Delivered. Enjoy your BOSERA fit!'],
      ];
      var idx = steps.findIndex(function (s) { return s[0] === status; });
      if (idx < 0) idx = 0;
      return steps.map(function (s, i) {
        var cls = i < idx ? 'done' : (i === idx ? 'active' : '');
        return '<div class="step ' + cls + '"><div class="dot"><i class="fas fa-check"></i></div><div class="step-text"><strong>' + s[1] + '</strong><p>' + s[2] + '</p></div></div>';
      }).join('');
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = form.querySelector('[name=orderId]').value.trim().toUpperCase();
        lookup(id);
      });
    }
    var q = new URLSearchParams(window.location.search).get('order');
    if (q) lookup(q);
    else result.innerHTML = '<div class="m-empty"><i class="fas fa-box"></i><p style="color:#888;">Enter an order ID above to see tracking details.</p></div>';
  }

  function wishlist_init(api) {
    var grid = document.getElementById('mWishGrid');
    var empty = document.getElementById('mWishEmpty');
    var count = document.getElementById('mWishCount');
    window.MOBILE_WISHLIST_GRID = function () { render(); };

    function render() {
      var w = getWishlist();
      if (count) count.textContent = w.length + (w.length === 1 ? ' item saved' : ' items saved');
      if (!w.length) { grid.style.display = 'none'; empty.style.display = ''; return; }
      grid.style.display = ''; empty.style.display = 'none';
      grid.innerHTML = w.map(function (p) { return cardTemplate(p, { showAdd: 'always-visible' }); }).join('');
    }
    render();
  }

  function account_init(api) {
    var authEl = document.getElementById('mAccountAuth');
    var formEl = document.getElementById('mAccountForm');
    var authForms = document.getElementById('mAuthForms');

    function render() {
      var user = getAuth();
      if (!user) {
        authEl.style.display = '';
        formEl.style.display = 'none';
        if (authForms) authForms.style.display = '';
        return;
      }
      authEl.style.display = 'none';
      formEl.style.display = '';
      if (authForms) authForms.style.display = 'none';
      var u = document.getElementById('accName'), e = document.getElementById('accEmail');
      if (u) u.value = user.name || '';
      if (e) { e.value = user.email || ''; e.disabled = true; }
      var p = document.getElementById('accPhone'), a = document.getElementById('accAddress');
      var saved = read('lbz_profile', {});
      if (p) p.value = saved.phone || '';
      if (a) a.value = saved.address || '';
      var so = document.getElementById('accStatOrders');
      if (so) so.textContent = String(getOrders().length);
      var sw = document.getElementById('accStatWishlist');
      if (sw) sw.textContent = String(getWishlist().length);
    }
    render();

    var save = document.getElementById('accountSaveBtn');
    if (save) {
      save.addEventListener('click', function () {
        var p = document.getElementById('accPhone').value.trim();
        var a = document.getElementById('accAddress').value.trim();
        write('lbz_profile', { phone: p, address: a });
        toast('Account updated');
      });
    }
    var out = document.getElementById('accountLogoutBtn');
    if (out) {
      out.addEventListener('click', function () {
        apiLogout().finally(function () {
          setAuth(null);
          toast('Logged out');
          window.location.href = '/';
        });
      });
    }

    var loginBtn = document.getElementById('loginBtn');
    var signupBtn = document.getElementById('signupBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        var email = document.getElementById('loginEmail').value.trim();
        var pass = document.getElementById('loginPassword').value;
        var err = document.getElementById('loginError');
        if (!email || !pass) { err.textContent = 'Enter email and password'; err.classList.remove('hidden'); return; }
        apiLogin(email, pass).then(function (res) {
          if (!res.ok) { err.textContent = res.data && res.data.error ? res.data.error : 'Invalid credentials'; err.classList.remove('hidden'); return; }
          setAuth({ name: res.data.user.name, email: res.data.user.email });
          toast('Welcome back, ' + res.data.user.name + '!');
          render();
        });
      });
    }
    if (signupBtn) {
      signupBtn.addEventListener('click', function () {
        var name = document.getElementById('signupName').value.trim();
        var email = document.getElementById('signupEmail').value.trim();
        var pass = document.getElementById('signupPassword').value;
        var err = document.getElementById('signupError');
        if (!name || !email || pass.length < 6) { err.textContent = 'Fill all fields — password must be 6+ characters'; err.classList.remove('hidden'); return; }
        apiRegister(name, email, pass).then(function (res) {
          if (!res.ok) { err.textContent = res.data && res.data.error ? res.data.error : 'Could not create account'; err.classList.remove('hidden'); return; }
          setAuth({ name: res.data.user.name, email: res.data.user.email });
          toast('Account created! Welcome, ' + res.data.user.name + '!');
          render();
        });
      });
    }
  }

  function order_success_init(api) {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('order');
    var box = document.getElementById('mSuccessBox');
    if (id) {
      var order = findOrder(id);
      box.innerHTML =
        '<div style="font-size:52px;color:#1a7f37;margin-bottom:10px;"><i class="fas fa-check-circle"></i></div>' +
        '<h2 style="font-size:20px;font-weight:800;margin-bottom:6px;">Order Placed!</h2>' +
        '<p style="color:#666;font-size:13px;">Thank you for shopping with BOSERA.</p>' +
        '<p style="margin:8px 0 18px;font-size:13px;">Your Order ID is <strong>' + esc(id) + '</strong>.</p>' +
        '<a class="btn btn-dark btn-block" href="/track-order?order=' + encodeURIComponent(id) + '" style="margin-bottom:10px;">Track Order</a>' +
        '<a class="btn btn-outline btn-block" href="/">Continue Shopping</a>';
    } else {
      box.innerHTML =
        '<div style="font-size:52px;color:#1a7f37;margin-bottom:10px;"><i class="fas fa-check-circle"></i></div>' +
        '<h2 style="font-size:20px;font-weight:800;margin-bottom:6px;">Order Placed!</h2>' +
        '<p style="color:#666;font-size:13px;">Thank you for shopping with BOSERA.</p>' +
        '<a class="btn btn-dark btn-block" href="/" style="margin-top:14px;">Continue Shopping</a>';
    }
  }

  // Login / register modal handlers (used by shared footer/drawer hooks)
  function openLogin() {
    var el = document.getElementById('mLoginModal');
    if (!el) return openAccount();
    el.classList.add('open');
  }
  function openAccount() { window.location.href = '/account'; }

  // ---------- Boot ----------
  var api = {
    esc: esc,
    money: money,
    read: read,
    write: write,
    fetchProducts: fetchProducts,
    searchProducts: searchProducts,
    productBySlug: productBySlug,
    getCart: getCart,
    addToCart: addToCart,
    updateQty: updateQty,
    removeFromCart: removeFromCart,
    cartCount: cartCount,
    cartTotal: cartTotal,
    cartSubtotal: cartSubtotal,
    getWishlist: getWishlist,
    toggleWishlist: toggleWishlist,
    inWishlist: inWishlist,
    getAuth: getAuth,
    isAuthed: isAuthed,
    setAuth: setAuth,
    apiLogin: apiLogin,
    apiRegister: apiRegister,
    apiLogout: apiLogout,
    getOrders: getOrders,
    placeOrder: placeOrder,
    findOrder: findOrder,
    cardTemplate: cardTemplate,
    renderGrid: renderGrid,
    onCartChange: onCartChange,
    toast: toast,
    refreshBadges: function () { refreshCartBadge(); refreshWishBadge(); },
  };
  window.MOBILE_API = api;

  // searchProducts bridge for shared.js
  window.boseraSearchProducts = searchProducts;
  // money bridge
  if (window.MOBILE_API) window.MOBILE_API.money = money;
  if (window.BOSERA) window.BOSERA.money = money;
  if (window.BOSERA) window.BOSERA.esc = esc;

  function boot() {
    bindGlobal();
    refreshCartBadge();
    refreshWishBadge();
    onCartChange(refreshCartBadge);

    // Generic contact form (contact.html)
    var cf = document.getElementById('contactFormMobile');
    if (cf) {
      cf.addEventListener('submit', function (e) {
        e.preventDefault();
        cf.reset();
        var ok = document.getElementById('contactOk');
        if (ok) { ok.textContent = 'Thanks! Your message has been received.'; ok.classList.remove('hidden'); }
      });
    }

    var page = (document.body.dataset.page || '').replace(/-/g, '_');
    var initFns = {
      index: index_init,
      category: category_init,
      product: product_init,
      cart: cart_init,
      checkout: checkout_init,
      orders: orders_init,
      track: track_init,
      wishlist: wishlist_init,
      account: account_init,
      order_success: order_success_init,
    };
    if (page && initFns[page]) initFns[page](api);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();