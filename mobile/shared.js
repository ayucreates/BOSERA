/* =====================================================
   BOSERA Mobile — shared chrome (header, menu, cart drawer,
   search, footer). Injected on every mobile page so the nav
   lives in ONE place.
   ===================================================== */
(function () {
  'use strict';

  var MENU = {
    Shop: [
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Hoodies', href: '/hoodies' },
      { label: 'Clothing', href: '/clothing' },
      { label: 'Sale', href: '/sale' },
    ],
    Categories: [
      { label: 'Tops', href: '/clothing' },
      { label: 'Bottoms', href: '/clothing' },
      { label: 'Coords', href: '/clothing' },
      { label: 'Accessories', href: '/clothing' },
    ],
    Account: [
      { label: 'My Account', href: '/account' },
      { label: 'Orders', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Track Order', href: '/track-order' },
    ],
    Support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  var ANNOUNCEMENT =
    'Extra 10% OFF | Use Code WELCOME10 | Free Shipping Above ₹499 | COD Available | As Seen On Instagram';

  var FOOTER_LINKS = {
    'Quick Links': [
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Best Sellers', href: '/best-sellers' },
      { label: 'Sale', href: '/sale' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
    'Categories': [
      { label: 'Tees', href: '/clothing' },
      { label: 'Hoodies', href: '/hoodies' },
      { label: 'Coords', href: '/clothing' },
      { label: 'Accessories', href: '/clothing' },
    ],
    'Customer Care': [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Shipping Policy', href: '/shipping-policy' },
      { label: 'Return Policy', href: '/return-policy' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  };

  var ADDRESS = 'Jwhwlao Dwimalu Rd, near Vishal Mega Mart, Boro Bhatarmari, Kokrajhar, Assam 783370';
  var PHONE = '+91 76368 11101';
  var EMAIL = 'Litebouys4@gmail.com';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function buildMenuGroups() {
    var html = '<a class="m-nav-link" id="mSearchOpen" href="#"><span><i class="fas fa-search" style="margin-right:10px;"></i>Search</span></a>';
    Object.keys(MENU).forEach(function (group) {
      html += '<div class="m-nav-group-title">' + esc(group) + '</div>';
      MENU[group].forEach(function (it) {
        html += '<a class="m-nav-link" href="' + esc(it.href) + '">' + esc(it.label) + '</a>';
      });
    });
    return html;
  }

  function buildFooter() {
    var html = '';
    html += '<div class="m-footer"><div class="container" style="padding:0 4px;">';
    html += '<h4>BOSERA</h4>';
    html += '<p>Unisex streetwear & everyday fashion. Bold fits for everyone.</p>';
    html += '<div class="social">';
    html += '<a href="https://www.instagram.com/litebouys_zone/" target="_blank"><i class="fab fa-instagram"></i></a>';
    html += '<a href="https://www.facebook.com/people/Lite-Bouys-Zone/61585258894779/" target="_blank"><i class="fab fa-facebook-f"></i></a>';
    html += '</div>';
    Object.keys(FOOTER_LINKS).forEach(function (group) {
      html += '<h4>' + esc(group) + '</h4>';
      FOOTER_LINKS[group].forEach(function (it) {
        html += '<a href="' + esc(it.href) + '">' + esc(it.label) + '</a>';
      });
    });
    html += '<h4>Contact</h4>';
    html += '<p><i class="fas fa-map-marker-alt" style="margin-right:6px;"></i>' + esc(ADDRESS) + '</p>';
    html += '<p><i class="fas fa-phone" style="margin-right:6px;"></i>' + esc(PHONE) + '</p>';
    html += '<p><i class="fas fa-envelope" style="margin-right:6px;"></i>' + esc(EMAIL) + '</p>';
    html += '<a href="?desktop=1" class="view-toggle"><i class="fas fa-desktop"></i> View Desktop Site</a>';
    html += '</div>';
    html += '<div class="m-footer-bottom">&copy; 2026 BOSERA. All rights reserved. Made with &hearts; By Ayushman B.</div>';
    html += '</div>';
    return html;
  }

  function inject() {
    var isIndex = document.body && document.body.dataset.page === 'index';
    var topbar = '';
    if (isIndex) {
      var annSpans = ANNOUNCEMENT.split('|').map(function (s) { return esc(s.trim()); }).filter(Boolean);
      var annHtml = annSpans.map(function (s) {
        return '<span>' + s + '</span><span class="sep">★</span>';
      }).join('');
      topbar =
        '<div class="m-top-marquee"><div class="announcement-track">' + annHtml + annHtml + '</div></div>';
    }
    document.body.insertAdjacentHTML('afterbegin',
      '<header class="m-header" id="mHeader">' +
      topbar +
      '  <div class="m-header-row">' +
      '    <button class="m-icon-btn" id="mMenuBtn" aria-label="Menu"><i class="fas fa-bars"></i></button>' +
      '    <a href="/" class="m-logo">BOS<span class="accent">ERA</span></a>' +
      '    <div class="m-header-right">' +
      '      <button class="m-icon-btn" id="mCartBtn" aria-label="Cart"><i class="fas fa-shopping-bag"></i><span class="m-count-badge hidden" id="mCartBadge">0</span></button>' +
      '    </div>' +
      '  </div>' +
      '  <form class="m-header-search" id="mHeaderSearch" autocomplete="off">' +
      '    <i class="fas fa-search"></i>' +
      '    <input type="search" id="mHeaderSearchInput" placeholder="Search Bosera" autocomplete="off" spellcheck="false">' +
      '    <div class="m-header-search-results" id="mHeaderSearchResults"></div>' +
      '  </form>' +
      '</header>' +

      '<div class="m-overlay" id="mOverlay"></div>' +

      '<div class="m-drawer" id="mDrawer">' +
      '  <div class="m-drawer-header"><strong>BOSERA Menu</strong><button id="mCloseMenu"><i class="fas fa-times"></i></button></div>' +
      '  <div class="m-drawer-body" id="mDrawerBody"></div>' +
      '  <div class="m-drawer-foot">' +
      '    <a href="/account" class="m-drawer-cta">Account</a>' +
      '    <a href="/cart">Cart</a>' +
      '  </div>' +
      '</div>' +

      '<div class="m-cart-drawer" id="mCartDrawer">' +
      '  <div class="m-cart-head"><strong>Your Cart</strong><button id="mCartClose"><i class="fas fa-times"></i></button></div>' +
      '  <div class="m-cart-body" id="mCartBody"></div>' +
      '  <div class="m-cart-foot" id="mCartFoot" style="display:none;">' +
      '    <div class="m-cart-total"><span>Total</span><span id="mCartTotal">₹0</span></div>' +
      '    <div class="m-cart-foot-actions">' +
      '      <a href="/cart" class="btn btn-outline">View Cart</a>' +
      '      <a href="/checkout" class="btn btn-yellow">Checkout</a>' +
      '    </div>' +
      '  </div>' +
      '</div>' +

      '<div class="m-toast" id="mToast"></div>'
    );

    var foot = document.createElement('footer');
    foot.id = 'mFooter';
    foot.innerHTML = buildFooter();
    document.body.appendChild(foot);

    document.getElementById('mDrawerBody').innerHTML = buildMenuGroups();
  }

  function wireMenu() {
    var drawer = document.getElementById('mDrawer');
    var overlay = document.getElementById('mOverlay');
    var open = function () { drawer.classList.add('open'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    var close = function () { drawer.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; };
    document.getElementById('mMenuBtn').addEventListener('click', open);
    document.getElementById('mCloseMenu').addEventListener('click', close);
    overlay.addEventListener('click', close);
  }

  function wireHeaderSearch(api) {
    var input = document.getElementById('mHeaderSearchInput');
    var results = document.getElementById('mHeaderSearchResults');
    var form = document.getElementById('mHeaderSearch');
    if (!input || !results) return;

    var debounceTimer;
    function doSearch() {
      var q = input.value.trim().toLowerCase();
      clearTimeout(debounceTimer);
      if (!q) {
        results.innerHTML = '';
        results.style.display = 'none';
        return;
      }
      debounceTimer = setTimeout(function () {
        api.searchProducts(q).then(function (list) {
          if (!list.length) {
            results.innerHTML = '<div class="m-header-search-empty">No products found</div>';
          } else {
            results.innerHTML = list.slice(0, 6).map(function (p) {
              return '<a class="m-header-search-result" href="/product?slug=' + encodeURIComponent(p.slug) + '">' +
                '<img src="' + esc(p.image_url) + '" loading="lazy">' +
                '<div><div class="t">' + esc(p.name) + '</div><div class="p">' + esc(api.money(p.price)) + '</div></div>' +
                '</a>';
            }).join('');
          }
          results.style.display = 'block';
        });
      }, 200);
    }

    input.addEventListener('input', doSearch);
    input.addEventListener('focus', function () { if (input.value.trim()) doSearch(); });

    // Hide results when clicking outside
    document.addEventListener('click', function (e) {
      if (!form.contains(e.target)) {
        results.style.display = 'none';
      }
    });

    // Prevent form submission (we handle via input)
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  function wireCart(api) {
    var drawer = document.getElementById('mCartDrawer');
    var overlay = document.getElementById('mOverlay');
    var body = document.getElementById('mCartBody');
    var foot = document.getElementById('mCartFoot');
    var totalEl = document.getElementById('mCartTotal');
    var badge = document.getElementById('mCartBadge');

    var open = function () { drawer.classList.add('open'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    var close = function () { drawer.classList.remove('open'); overlay.classList.remove('active'); document.body.style.overflow = ''; };
    document.getElementById('mCartBtn').addEventListener('click', open);
    document.getElementById('mCartClose').addEventListener('click', close);

    function setBadge(n) { badge.textContent = n; badge.classList.toggle('hidden', n <= 0); }

    function render() {
      var items = api.getCart();
      setBadge(api.cartCount());
      if (!items.length) {
        foot.style.display = 'none';
        body.innerHTML = '<div class="m-cart-empty"><i class="fas fa-shopping-bag"></i><h3>Your cart is empty</h3><p>Add some fits you love before checking out.</p></div>';
        return;
      }
      foot.style.display = '';
      totalEl.textContent = api.money(api.cartTotal());
      body.innerHTML = items.map(function (it) {
        return '<div class="m-cart-item">' +
          '<a href="/product?slug=' + encodeURIComponent(it.slug) + '"><img src="' + esc(it.image_url) + '" loading="lazy"></a>' +
          '<div class="m-cart-item-info">' +
          '  <a class="m-cart-item-name" href="/product?slug=' + encodeURIComponent(it.slug) + '">' + esc(it.name) + '</a>' +
          '  <div class="m-cart-item-price">' + esc(api.money(it.price)) + '</div>' +
          '  <div class="m-cart-qty">' +
          '    <button data-dir="-1" data-id="' + it.id + '">−</button><span>' + it.qty + '</span><button data-dir="1" data-id="' + it.id + '">+</button>' +
          '  </div>' +
          '</div>' +
          '<button class="m-cart-remove" data-id="' + it.id + '"><i class="fas fa-trash-alt"></i></button>' +
          '</div>';
      }).join('');
    }

    body.addEventListener('click', function (e) {
      var btn = e.target.closest('.m-cart-qty button, .m-cart-remove');
      if (!btn) return;
      var id = Number(btn.dataset.id);
      if (e.target.closest('.m-cart-remove') || btn.classList.contains('m-cart-remove')) {
        api.removeFromCart(id);
        api.toast('Removed from cart');
      } else {
        api.updateQty(id, Number(btn.dataset.dir));
      }
      render();
    });

    api.onCartChange(render);
    render();
    window.openCartFn = open;
  }

  function wireScroll() {
    var header = document.getElementById('mHeader');
    var lastY = window.scrollY || 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      header.classList.toggle('scrolled', y > 8);
      lastY = y;
    }, { passive: true });
  }

  function wireToast(api) {
    // toast handled by api.toast; expose only
    window.mShowToast = api.toast;
  }

  window.BOSERA = {
    esc: esc,
    money: function (n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); },
  };

  // Chrome is injected as soon as DOM is ready. Page logic is driven by
  // mobile.js (loaded first) via its own boot — nothing to init here.
  function boot() {
    inject();
    var api = requireAPI();
    wireMenu();
    wireHeaderSearch(api);
    wireCart(api);
    wireScroll();
    wireToast(api);
    // Badges live in the injected header; refresh now that chrome exists.
    if (api.refreshBadges) api.refreshBadges();
    else {
      var wb = document.getElementById('mWishBadge');
      var cb = document.getElementById('mCartBadge');
      if (wb && window.MOBILE_API) { wb.textContent = window.MOBILE_API.getWishlist().length; wb.classList.toggle('hidden', window.MOBILE_API.getWishlist().length <= 0); }
      if (cb && window.MOBILE_API) { cb.textContent = window.MOBILE_API.cartCount(); cb.classList.toggle('hidden', window.MOBILE_API.cartCount() <= 0); }
    }
  }

  function requireAPI() {
    // Shared API layer defined in mobile.js; if not yet loaded, stub waits.
    if (window.MOBILE_API) return window.MOBILE_API;
    var listeners = [];
    window.MOBILE_API = {
      cart: [],
      listeners: listeners,
      getCart: function () { return window.MOBILE_API.cart; },
      searchProducts: function (q) {
        return window.boseraSearchProducts ? window.boseraSearchProducts(q) : Promise.resolve([]);
      },
      money: function () { return '₹0'; },
      cartCount: function () { return window.MOBILE_API.cart.reduce(function (s, i) { return s + i.qty; }, 0); },
      cartTotal: function () { return window.MOBILE_API.cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0); },
      removeFromCart: function () {},
      updateQty: function () {},
      onCartChange: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
      toast: function () {},
    };
    return window.MOBILE_API;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();