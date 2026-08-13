// =====================
// Product Data
// =====================
const products = {
  tops: [
    { name: "Off The Grid Oversized T-shirt", price: 999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/OffTheGridOversizedT-shirt_6.jpg?v=1785402583&width=480", oldPrice: 1299, badge: "Sale" },
    { name: "Grey Pinstripe Sculpt Vest", price: 899, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Untitled_design_7.png?v=1786451071&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Navy Pinstripe Sculpt Vest", price: 899, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Untitleddesign_5.png?v=1786447072&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Everyday Sailor Stripe Oversized T-shirt", price: 1099, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/EverydaySailorStripeOversized_T-shirtMen_jpg.jpg?v=1786093957&width=480", oldPrice: 1299, badge: "Sale" },
    { name: "Midnight Pine Stripe Oversized T-shirt", price: 1099, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/MidnightPineStripeOversizedT-shirt_1_853b459a-56bf-46f0-b394-914f3a61e725.jpg?v=1786084585&width=480", oldPrice: 1299, badge: "Sale" },
    { name: "Sky Stripe Oversized T-shirt", price: 1099, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/SkyStripeOversizedT-shirt_7.jpg?v=1782898822&width=480", oldPrice: 1299, badge: "Sale" },
    { name: "Shadow Star Long Sleeve T-shirt", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/ShadowStarLongSleeveT-shirt4.jpg?v=1785921585&width=480", oldPrice: 1499, badge: "Sale" },
    { name: "Downtown Muse Drape Halter Top", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/DowntownMuseDrapeHalterTop_5.jpg?v=1785758357&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Sand Soft Fade Ribbed Tank", price: 499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Bonkers_Corner_X_SpiderMan_22-07-20268627.jpg?v=1785830628&width=480", oldPrice: 599, badge: "Sale" },
    { name: "Rose Soft Fade Ribbed Tank", price: 499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/RoseSoftFadeRibbedTank_1.jpg?v=1785754420&width=480", oldPrice: 599, badge: "Sale" },
  ],
  shirts: [
    { name: "Real Slim Oversized Polo Jersey", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/RealSlimOversizedPoloJerseyWomen_1.jpg?v=1786603661&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Ivy Green Rugby Polo", price: 1399, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/IvyGreenRugbyPolo_3_210fd05b-3312-4794-bf27-bb1e9f280140.jpg?v=1785737932&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Dusty Rose Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/DustyRoseRelaxedFitShirt_3.jpg?v=1785151694&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Pastel Sage Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/PastelSageRelaxedFitShirt_2.jpg?v=1785151063&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "True Black Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/TrueBlackRelaxedFitShirt_2.jpg?v=1785150732&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Black Ember Stripe Rugby Polo", price: 1399, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/BlackEmberStripeRugbyPolo_2.jpg?v=1784714195&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Pink Cloud Linen Shirt", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/PinkCloudLinenShirt_15.jpg?v=1785234311&width=480", oldPrice: 2499, badge: "Sale" },
    { name: "Warm Yellow Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/WarmYellowRelaxedFitShirt_2.jpg?v=1785233308&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Soft Blue Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/SoftBlueRelaxedFitShirt_9.jpg?v=1785232866&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Classic White Relaxed Fit Shirt", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/ClassicWhiteRelaxedFitShirt_9.jpg?v=1785230893&width=480", oldPrice: 1899, badge: "Sale" },
  ],
  hoodies: [
    { name: "Rhythm In Control Hoodie", price: 1699, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/RhythmInControlHoodie6.jpg?v=1785490224&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Web Slash Hoodie", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Web_Slash_Hoodie_5.jpg?v=1785393791&width=480", oldPrice: 2299, badge: "Sale" },
    { name: "Web Crest Red Hoodie", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Bonkers_Corner_X_SpiderMan_22-07-20268440.jpg?v=1785389975&width=480", oldPrice: 2299, badge: "Sale" },
    { name: "Web Crest White Hoodie", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/BonkersCornerXSpiderMan22-07-20269133.jpg?v=1785396864&width=480", oldPrice: 2299, badge: "Sale" },
    { name: "Web Crest Black Hoodie", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/BonkersCornerXSpiderMan22-07-20268358.jpg?v=1785389567&width=480", oldPrice: 2299, badge: "Sale" },
    { name: "United 48 Knit Sweatshirt", price: 1599, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/United48KnitSweatshirt_6.jpg?v=1783406627&width=480", oldPrice: 1799, badge: "Sale" },
    { name: "Black Layered Crop Hoodie", price: 999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/BlackLayeredCropHoodie_7.jpg?v=1782892657&width=480", oldPrice: 1299, badge: "Sale" },
    { name: "Blue Mickey Hoodie", price: 1599, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Bonkerscorner_blue_mickey_hoodie_4.jpg?v=1734500000&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Wear A Hug Oversized Hoodie", price: 1599, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Bonkerscorner_tealblue_wear_a_hug_oversized_hoodie_4.jpg?v=1733404374&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Players only Hoodie", price: 1799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/pushing-b-red-hoodie-back.gif?v=1733129079&width=480", oldPrice: 2199, badge: "Sale" },
  ],
  trousers: [
    { name: "Grey Pinstriped Loose Fit Trousers", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/GreyPinstripeSculptVest_11_983d61bb-d50e-441b-8f52-eaf376b4de41.jpg?v=1786441095&width=480", oldPrice: 1799, badge: "Sale" },
    { name: "Navy Pinstriped Loose Fit Trousers", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/NavyPinstripeSculptVest_9_dd06abae-b038-4b33-8abf-8fcf766595d8.jpg?v=1786442776&width=480", oldPrice: 1799, badge: "Sale" },
    { name: "Relaxed Fit Black Corduroy Pants", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/RelaxedFitBlackCorduroyPants_5.jpg?v=1785929603&width=480", oldPrice: 1799, badge: "Sale" },
    { name: "Corner Web Shorts", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/313.png?v=1785834385&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Buttercup Track Pants", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/ButtercupTrackPants_15.jpg?v=1785752831&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Ice Blue Track Pants", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/IceBlueTrackPants_3_079c6b30-78ee-4ded-beaf-05151d4156bc.jpg?v=1785738469&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Sunshine Yellow Loose Fit Joggers", price: 1299, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/329.png?v=1786016324&width=480", oldPrice: 1599, badge: "Sale" },
    { name: "Moss Arc Barrel Pants", price: 1699, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/MossArcBarrelPants_5.jpg?v=1785492102&width=480", oldPrice: 1999, badge: "Sale" },
    { name: "Pink Cloud Faded Loose Fit Pants", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/PinkCloudFadedLooseFitPantsMEN_1.jpg?v=1785398201&width=480", oldPrice: 1899, badge: "Sale" },
    { name: "Off Grid Denim Cargo", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/BonkersMan08-07-2026-1017.jpg?v=1785134410&width=480", oldPrice: 2299, badge: "Sale" },
  ],
  accessories: [
    { name: "Webcode Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Seedream_5_0_Pro_-_A_professional_photoshoot_recreation_matching_the_exact_composition__lighting__an.png?v=1784871739&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Heartbit Pouch Bag Charm", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/HeartbitPouchBagCharm_5.jpg?v=1783945758&width=480", oldPrice: 999, badge: "Sale" },
    { name: "Hot Wheels Iconic Red Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/IMG_7586_JPG.jpg?v=1783681683&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Hot Wheels Iconic Blue Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/IMG_7579_JPG.jpg?v=1783681539&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Million Dollar Nap Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/CAP-03_jpg.jpg?v=1783582441&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Bonkers Bronx Club Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/07.jpg?v=1783179279&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Heritage Club Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/CAP-02_jpg.jpg?v=1783582441&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Espresso Mood Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/CAP-01_jpg.jpg?v=1783582441&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Smiley Originals x Bonkers Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/SmileyXBonkersCornerProducts-2484.jpg?v=1736925696&width=480", oldPrice: 1099, badge: "Sale" },
    { name: "Pink Bonkers Embroidered Cap", price: 799, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/pink-bonkers-embroidered-cap-fs-bonkerscorner-store-34149400117348.jpg?v=1728982788&width=480", oldPrice: 999, badge: "Sale" },
  ],
  coords: [
    { name: "Fuchsia Fever Co-ord Set", price: 1499, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/FuchsiaFeverCo-ordSet_4.png?v=1785305114&width=480", oldPrice: 1799, badge: "Sale" },
    { name: "Bratz Little Black Co-ord Set", price: 999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/Bonkerscorner_Bratz_Little_Black_Co-ord_Set_1.jpg?v=1743574680&width=480", oldPrice: 1199, badge: "Sale" },
    { name: "Midnight Black Pyjama Set", price: 1999, img: "https://cdn.shopify.com/s/files/1/0653/0541/1684/files/midnightblackpyjamaset3.jpg?v=1780554854&width=480", oldPrice: 2199, badge: "Sale" },
  ],
};


// =====================
// State
// =====================
let user = JSON.parse(localStorage.getItem('lbz_user')) || null;
let cart = JSON.parse(localStorage.getItem('lbz_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('lbz_wishlist')) || [];

// =====================
// Render Products
// =====================
function renderProducts(categoryId, productsArray) {
  const grid = document.getElementById(categoryId);
  if (!grid) return;

  grid.innerHTML = productsArray.map(p => {
    const oldPriceHtml = p.oldPrice ? `<span class="old-price">₹${p.oldPrice.toLocaleString()}</span>` : '';
    let badgeHtml = '';
    if (p.badge) {
      const badgeClass = p.badge === 'New' ? 'new' : p.badge === 'Sale' ? 'sale' : '';
      badgeHtml = `<span class="product-badge ${badgeClass}">${p.badge}</span>`;
    } else if (p.oldPrice) {
      const savePct = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      badgeHtml = `<span class="product-badge">Save ${savePct}%</span>`;
    }
    const nameEscaped = p.name.replace(/'/g, "\\'");
    const inWishlist = wishlist.some(w => w.name === p.name);
    const cardLink = `product.html?name=${encodeURIComponent(p.name)}`;

    return `
      <div class="product-card">
        <div class="product-image">
          ${badgeHtml}
          <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${nameEscaped}', '${p.img}', ${p.price})" title="Wishlist"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
          <a href="${cardLink}"><img src="${p.img}" alt="${p.name}" loading="lazy"></a>
          <button class="add-to-cart" onclick="addToCart('${nameEscaped}', '${p.img}', ${p.price})">Add To Cart</button>
        </div>
        <div class="product-info">
          <a href="${cardLink}"><div class="product-name">${p.name}</div></a>
          <div class="product-price">₹${p.price.toLocaleString()} ${oldPriceHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}

const allProducts = [
  ...products.tops.map(p => ({ ...p, cat: 'tops' })),
  ...products.shirts.map(p => ({ ...p, cat: 'shirts' })),
  ...products.accessories.map(p => ({ ...p, cat: 'accessories' })),
  ...products.hoodies.map(p => ({ ...p, cat: 'hoodies' })),
  ...products.trousers.map(p => ({ ...p, cat: 'trousers' })),
  ...products.coords.map(p => ({ ...p, cat: 'coords' })),
];

renderProducts('allProductsGrid', allProducts);
renderProducts('newArrivalsGrid', allProducts);
renderProducts('clothingGrid', allProducts);
renderProducts('hoodiesGrid', products.hoodies);

// =====================
// Filter & Sort
// =====================
function getFilteredProducts() {
  const cats = [...document.querySelectorAll('.filter-cat:checked')].map(el => el.value);
  const priceVal = document.querySelector('.filter-price:checked')?.value || '';
  let [minP, maxP] = priceVal.split('-').map(Number);

  let list = allProducts;
  if (cats.length) {
    list = list.filter(p => cats.includes(p.cat));
  }
  if (priceVal) {
    list = list.filter(p => {
      const pr = Number(p.price);
      return pr >= minP && pr <= maxP;
    });
  }
  return list;
}

function getSortedProducts() {
  const sortVal = document.getElementById('sortSelect')?.value || 'relevance';
  const list = getFilteredProducts().slice();

  switch (sortVal) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'best-selling':
      list.sort((a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0) || b.price - a.price);
      break;
    case 'newest':
      list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
      break;
    case 'oldest':
      list.sort((a, b) => (a.badge === 'New' ? 1 : 0) - (b.badge === 'New' ? 1 : 0));
      break;
    case 'relevance':
    default:
      list.sort((a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0));
  }
  return list;
}

function applyFilters() {
  renderProducts('allProductsGrid', getSortedProducts());
  updateFilterSummary();
}

function updateFilterSummary() {
  const summaryEl = document.getElementById('filterSummary');
  if (!summaryEl) return;
  const cats = [...document.querySelectorAll('.filter-cat:checked')].map(el => el.value);
  const priceVal = document.querySelector('.filter-price:checked')?.value || '';
  let html = '';
  if (cats.length) html += cats.map(c => `<span class="chip">${c}</span>`).join('');
  if (priceVal) {
    const [lo, hi] = priceVal.split('-').map(Number);
    html += `<span class="chip">₹${lo.toLocaleString()} - ₹${hi === 99999 ? 'Above' : hi.toLocaleString()}</span>`;
  }
  summaryEl.innerHTML = html || `${getFilteredProducts().length} items`;
}

document.addEventListener('DOMContentLoaded', () => {
  const filterToggle = document.getElementById('filterToggle');
  const filterDrawer = document.getElementById('filterDrawer');
  const filterDrawerClose = document.getElementById('filterDrawerClose');
  const filterOverlay = document.getElementById('filterOverlay');
  const filterClear = document.getElementById('filterClear');
  const filterApply = document.getElementById('filterApply');
  const sortSelect = document.getElementById('sortSelect');

  if (filterToggle && filterDrawer) {
    const openDrawer = () => {
      filterDrawer.classList.add('open');
      filterOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      filterDrawer.classList.remove('open');
      filterOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    };

    filterToggle.addEventListener('click', openDrawer);
    filterDrawerClose?.addEventListener('click', closeDrawer);
    filterOverlay?.addEventListener('click', closeDrawer);
    filterApply?.addEventListener('click', () => { applyFilters(); closeDrawer(); });
    filterClear?.addEventListener('click', () => {
      document.querySelectorAll('.filter-cat').forEach(el => el.checked = false);
      document.querySelectorAll('.filter-price').forEach(el => el.checked = false);
      document.querySelector('.filter-price[value=""]').checked = true;
      applyFilters();
    });
    sortSelect?.addEventListener('change', applyFilters);
  }
});

// =====================
// Cart
// =====================
// Splash configs
const splashConfigs = {
  wishlist: {
    icon: 'far fa-heart',
    title: 'Save to Wishlist',
    text: 'Login to save your favourite items and never lose track of what you love.'
  },
  cart: {
    icon: 'fas fa-shopping-bag',
    title: 'Add to Cart',
    text: 'Login to start shopping and add items to your cart.'
  },
  account: {
    icon: 'far fa-user',
    title: 'My Account',
    text: 'Login to view your orders, wishlist, and account details.'
  },
  checkout: {
    icon: 'fas fa-credit-card',
    title: 'Proceed to Checkout',
    text: 'Login to complete your purchase quickly and securely.'
  }
};

function showSplash(feature) {
  const modal = document.getElementById('splashModal');
  if (!modal) return;
  const config = splashConfigs[feature] || splashConfigs.account;
  document.getElementById('splashIcon').innerHTML = `<i class="${config.icon}"></i>`;
  document.getElementById('splashTitle').textContent = config.title;
  document.getElementById('splashText').textContent = config.text;
  modal.classList.add('active');
  const overlayEl = document.getElementById('overlay');
  if (overlayEl) overlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSplash() {
  const modal = document.getElementById('splashModal');
  if (modal) modal.classList.remove('active');
  const overlayEl = document.getElementById('overlay');
  if (overlayEl) overlayEl.classList.remove('active');
  document.body.style.overflow = '';
}

function addToCart(name, img, price) {
  if (!user) { showSplash('cart'); return; }
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, img, price, qty: 1 });
  }
  saveCart();
  renderCart();
  showToast(`Added "${name}" to cart`);
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

function updateQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(name);
    return;
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('lbz_cart', JSON.stringify(cart));
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-icon .badge').forEach(b => b.textContent = total);
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const totalEl = document.getElementById('cartTotal');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    if (totalEl) totalEl.textContent = '₹0';
    renderCartPage();
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button onclick="updateQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">&times;</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = '₹' + total.toLocaleString();

  renderCartPage();
}

// =====================
// Wishlist
// =====================
function toggleWishlist(name, img, price) {
  if (!user) { showSplash('wishlist'); return; }
  const idx = wishlist.findIndex(w => w.name === name);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed "${name}" from wishlist`);
  } else {
    wishlist.push({ name, img, price });
    showToast(`Added "${name}" to wishlist`);
  }
  localStorage.setItem('lbz_wishlist', JSON.stringify(wishlist));
  updateWishlistBadge();
  reRenderProducts();
}

function updateWishlistBadge() {
  document.querySelectorAll('.wishlist-icon .badge').forEach(b => b.textContent = wishlist.length);
  // Reload page if on wishlist page to reflect changes
  if (window.location.pathname === '/wishlist') {
    window.location.reload();
  }
}

function reRenderProducts() {
  renderProducts('allProductsGrid', allProducts);
  renderProducts('newArrivalsGrid', allProducts);
  renderProducts('clothingGrid', allProducts);
  renderProducts('hoodiesGrid', products.hoodies);

// Wishlist page
const wishlistData = JSON.parse(localStorage.getItem('lbz_wishlist')) || [];
const wishlistGrid = document.getElementById('wishlistPageGrid');
const wishlistEmpty = document.getElementById('wishlistEmpty');
const wishlistCount = document.getElementById('wishlistCount');
if (wishlistGrid) {
  if (wishlistData.length === 0) {
    wishlistGrid.style.display = 'none';
    if (wishlistEmpty) wishlistEmpty.style.display = 'block';
  } else {
    if (wishlistEmpty) wishlistEmpty.style.display = 'none';
    if (wishlistCount) wishlistCount.textContent = wishlistData.length + ' items saved';
    wishlistGrid.innerHTML = wishlistData.map(p => {
      const nameEscaped = p.name.replace(/'/g, "\\'");
      const inWishlist = wishlist.some(w => w.name === p.name);
      return `
        <div class="product-card">
          <div class="product-image">
            <button class="wishlist-btn active" onclick="toggleWishlist('${nameEscaped}', '${p.img}', ${p.price})" title="Remove from Wishlist"><i class="fas fa-heart"></i></button>
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <button class="add-to-cart always-visible" onclick="addToCart('${nameEscaped}', '${p.img}', ${p.price})">Add To Cart</button>
          </div>
          <div class="product-info">
            <div class="product-name">${p.name}</div>
            <div class="product-price">₹${p.price.toLocaleString()}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}
}

// =====================
// Orders (localStorage)
// =====================
function getOrders() {
  try { return JSON.parse(localStorage.getItem('lbz_orders')) || []; } catch (e) { return []; }
}
function saveOrders(orders) { localStorage.setItem('lbz_orders', JSON.stringify(orders)); }

const ORDER_STAGES = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

function placeOrder(details) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 99;
  const order = {
    id: 'BOS' + Date.now().toString().slice(-8),
    date: new Date().toISOString(),
    items: cart.map(i => ({ ...i })),
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping,
    name: details.name,
    phone: details.phone,
    email: details.email || (user ? user.email : ''),
    address: details.address,
    city: details.city,
    state: details.state,
    pincode: details.pincode,
    payment: details.payment,
    status: 'Order Placed'
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  cart = [];
  saveCart();
  renderCart();
  return order;
}

function stageIndex(status) { return ORDER_STAGES.indexOf(status); }

// =====================
// Cart page (cart.html)
// =====================
function renderCartPage() {
  const list = document.getElementById('cartPageItems');
  if (!list) return;
  const cartPageEmpty = document.getElementById('cartPageEmpty');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 99;

  const setTotal = () => {
    const sub = document.getElementById('cartSubtotal');
    const ship = document.getElementById('cartShipping');
    const grand = document.getElementById('cartGrandTotal');
    if (sub) sub.textContent = money(subtotal);
    if (ship) ship.textContent = shipping === 0 ? 'FREE' : money(shipping);
    if (grand) grand.textContent = money(subtotal + shipping);
    const note = document.getElementById('freeShipNote');
    if (note) note.style.display = (subtotal > 0 && subtotal < 499) ? 'block' : 'none';
    const freeLeft = document.getElementById('freeShipLeft');
    if (freeLeft) freeLeft.textContent = money(499 - subtotal);
  };

  if (cart.length === 0) {
    if (cartPageEmpty) cartPageEmpty.style.display = 'block';
    if (cartCheckoutBtn) cartCheckoutBtn.style.display = 'none';
    list.innerHTML = '';
    setTotal();
    return;
  }
  if (cartPageEmpty) cartPageEmpty.style.display = 'none';
  if (cartCheckoutBtn) cartCheckoutBtn.style.display = 'block';

  list.innerHTML = cart.map(item => `
    <div class="cart-row">
      <a href="product.html?name=${encodeURIComponent(item.name)}"><img src="${item.img}" alt="${item.name}"></a>
      <div class="cart-row-info">
        <a href="product.html?name=${encodeURIComponent(item.name)}"><div class="cart-item-name">${item.name}</div></a>
        <div class="cart-item-price">${money(item.price)}</div>
        <div class="cart-item-qty" style="margin-top:8px;">
          <button onclick="updateQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
        </div>
      </div>
      <div class="cart-row-actions">
        <div class="cart-item-price">${money(item.price * item.qty)}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">&times;</button>
      </div>
    </div>
  `).join('');
  setTotal();
}

// =====================
// Checkout page (checkout.html)
// =====================
function renderCheckoutPage() {
  const summary = document.getElementById('checkoutItems');
  if (!summary) return;
  const layout = document.getElementById('checkoutLayout');
  const checkoutForm = document.getElementById('checkoutForm');
  const authNotice = document.getElementById('checkoutAuthNotice');

  if (!user) {
    if (authNotice) authNotice.style.display = 'block';
    if (layout) layout.style.display = 'none';
    return;
  }
  if (authNotice) authNotice.style.display = 'none';
  if (layout) layout.style.display = 'grid';

  if (cart.length === 0) {
    summary.innerHTML = '<p style="color:#888;font-size:13px;">Your cart is empty. <a href="/" style="color:#0a0a0a;font-weight:700;">Start shopping</a></p>';
    const t = document.getElementById('checkoutTotal');
    if (t) t.textContent = money(0);
    return;
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 99;
  summary.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <a href="product.html?name=${encodeURIComponent(item.name)}"><img src="${item.img}" alt="${item.name}"></a>
      <div class="checkout-item-info">
        <div class="t">${item.name}</div>
        <div class="s">Qty: ${item.qty}</div>
      </div>
      <div class="cart-item-price">${money(item.price * item.qty)}</div>
    </div>
  `).join('');
  const sub = document.getElementById('checkoutSubtotal');
  const ship = document.getElementById('checkoutShipping');
  const tot = document.getElementById('checkoutTotal');
  if (sub) sub.textContent = money(subtotal);
  if (ship) ship.textContent = shipping === 0 ? 'FREE' : money(shipping);
  if (tot) tot.textContent = money(subtotal + shipping);

  if (checkoutForm) {
    checkoutForm.onsubmit = (e) => {
      e.preventDefault();
      const details = {
        name: e.target.name.value.trim(),
        phone: e.target.phone.value.trim(),
        email: e.target.email.value.trim(),
        address: e.target.address.value.trim(),
        city: e.target.city.value.trim(),
        state: e.target.state.value.trim(),
        pincode: e.target.pincode.value.trim(),
        payment: (document.querySelector('input[name="payment"]:checked') || {}).value || 'COD'
      };
      const order = placeOrder(details);
      window.location.href = 'order-success.html?order=' + order.id;
    };
  }
}

// =====================
// Orders page (orders.html)
// =====================
function renderOrdersPage() {
  const container = document.getElementById('ordersList');
  if (!container) return;
  const ordersEmpty = document.getElementById('ordersEmpty');
  const ordersAuth = document.getElementById('ordersAuth');

  if (!user) {
    container.innerHTML = '';
    if (ordersAuth) ordersAuth.style.display = 'block';
    if (ordersEmpty) ordersEmpty.style.display = 'none';
    return;
  }
  if (ordersAuth) ordersAuth.style.display = 'none';

  const orders = getOrders();
  if (orders.length === 0) {
    container.innerHTML = '';
    if (ordersEmpty) ordersEmpty.style.display = 'block';
    return;
  }
  if (ordersEmpty) ordersEmpty.style.display = 'none';

  container.innerHTML = orders.map(o => {
    const dateStr = new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const statusClass = o.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="order-card">
        <div class="order-card-top">
          <div>
            <strong>Order #${o.id}</strong>
            <span style="margin-left:12px;">${dateStr}</span>
          </div>
          <span class="status-pill ${statusClass}">${o.status}</span>
        </div>
        <div class="order-card-body">
          ${o.items.map(i => `
            <div class="oc-item">
              <a href="product.html?name=${encodeURIComponent(i.name)}"><img src="${i.img}" alt="${i.name}"></a>
              <div>
                <div class="t">${i.name}</div>
                <div class="s">Qty: ${i.qty} &middot; ${money(i.price)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="order-card-foot">
          <div class="total">${money(o.total)}</div>
          <a class="btn btn-outline" style="padding:9px 18px;font-size:12px;" href="track-order.html?order=${o.id}">Track Order</a>
        </div>
      </div>
    `;
  }).join('');
}

// =====================
// Account page (account.html)
// =====================
function renderAccountPage() {
  const wrap = document.getElementById('accountFormWrap');
  if (!wrap) return;
  const auth = document.getElementById('accountAuth');

  if (!user) {
    wrap.style.display = 'none';
    if (auth) auth.style.display = 'block';
    return;
  }
  if (auth) auth.style.display = 'none';
  wrap.style.display = 'block';

  const fname = document.getElementById('accName');
  const femail = document.getElementById('accEmail');
  const fphone = document.getElementById('accPhone');
  const faddress = document.getElementById('accAddress');
  if (fname) fname.value = user.name || '';
  if (femail) { femail.value = user.email || ''; femail.disabled = true; }
  if (fphone) fphone.value = user.phone || '';
  if (faddress) faddress.value = user.address || '';

  const statOrders = document.getElementById('accStatOrders');
  const statWishlist = document.getElementById('accStatWishlist');
  if (statOrders) statOrders.textContent = getOrders().length;
  if (statWishlist) statWishlist.textContent = wishlist.length;

  const saveBtn = document.getElementById('accountSaveBtn');
  if (saveBtn) {
    saveBtn.onclick = (e) => {
      e.preventDefault();
      user.name = (fname && fname.value.trim()) || user.name;
      user.phone = (fphone && fphone.value.trim()) || '';
      user.address = (faddress && faddress.value.trim()) || '';
      const usersList = (JSON.parse(localStorage.getItem('lbz_users')) || []).map(u =>
        u.email === user.email ? { ...u, name: user.name, phone: user.phone, address: user.address } : u
      );
      localStorage.setItem('lbz_users', JSON.stringify(usersList));
      localStorage.setItem('lbz_user', JSON.stringify(user));
      updateAuthUI();
      showToast('Account updated');
    };
  }

  const logoutBtn = document.getElementById('accountLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      user = null;
      localStorage.removeItem('lbz_user');
      updateAuthUI();
      showToast('Logged out');
      window.location.href = '/';
    });
  }
}

// =====================
// Product page (product.html)
// =====================
function renderProductPage() {
  const wrap = document.getElementById('pdpWrap');
  if (!wrap) return;
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  const product = name ? allProducts.find(p => p.name === name) : null;

  if (!product) {
    wrap.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <i class="fas fa-box-open"></i>
          <h2>Product not found</h2>
          <p>The item you're looking for isn't available right now.</p>
          <a class="btn btn-dark" href="/">Continue Shopping</a>
        </div>
      </div>
    `;
    return;
  }

  const inWishlist = wishlist.some(w => w.name === product.name);
  const oldPriceHtml = product.oldPrice ? `<span class="old-price">₹${product.oldPrice.toLocaleString()}</span>` : '';

  wrap.innerHTML = `
    <div class="container">
      <div class="breadcrumbs"><a href="/">Home</a><span class="sep">/</span><a href="${product.cat === 'hoodies' ? '/hoodies' : '/clothing'}">Shop</a><span class="sep">/</span><span>${product.name}</span></div>
      <div class="pdp-layout">
        <div class="pdp-gallery"><img src="${product.img}" alt="${product.name}"></div>
        <div>
          <span class="pdp-brand">BOSERA</span>
          <h1 class="pdp-title">${product.name}</h1>
          <div class="pdp-price">${money(product.price)} ${oldPriceHtml}</div>
          <p class="pdp-desc">Premium streetwear from BOSERA. Relaxed, bold fits in unisex sizing. Ships across India with easy 7-day returns and COD available.</p>
          <h3 style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Select Size</h3>
          <div class="size-options" id="pdpSizes">
            ${['XS','S','M','L','XL','XXL'].map(s => `<button type="button">${s}</button>`).join('')}
          </div>
          <div class="pdp-actions">
            <button class="btn btn-dark" id="pdpAddCart" style="flex:1;">Add To Cart</button>
            <button class="btn btn-outline" id="pdpWishlist" style="min-width:54px;"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
          </div>
          <div class="pdp-meta">
            <p><strong style="color:#0a0a0a;">Free Shipping</strong> on orders above ₹499</p>
            <p><strong style="color:#0a0a0a;">Easy Returns</strong> within 7 days</p>
            <p><strong style="color:#0a0a0a;">COD Available</strong> across India</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const sizeBox = document.getElementById('pdpSizes');
  sizeBox.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      sizeBox.querySelectorAll('button').forEach(b => b.classList.remove('sel'));
      e.target.classList.add('sel');
    }
  });

  document.getElementById('pdpAddCart').addEventListener('click', () => {
    addToCart(product.name, product.img, product.price);
  });
  document.getElementById('pdpWishlist').addEventListener('click', () => {
    toggleWishlist(product.name, product.img, product.price);
    const heart = document.getElementById('pdpWishlist').querySelector('i');
    const inList = wishlist.some(w => w.name === product.name);
    heart.className = inList ? 'fas fa-heart' : 'far fa-heart';
  });
}

// =====================
// Track order (track-order.html)
// =====================
function renderTrackOrder() {
  const form = document.getElementById('trackForm');
  const resultBox = document.getElementById('trackResult');
  if (!form || !resultBox) return;

  function lookupOrder(id) {
    const order = getOrders().find(o => o.id.toUpperCase() === id.toUpperCase());
    if (!order) {
      resultBox.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h2>Order not found</h2>
          <p>We couldn't find an order with that ID. Double-check your order ID and try again.</p>
        </div>
      `;
      return;
    }
    const idx = stageIndex(order.status);
    resultBox.innerHTML = `
      <div class="panel">
        <h2>Order #${order.id}</h2>
        <p style="margin-bottom:6px;">Status: <span class="status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span></p>
        <p style="color:#888;font-size:13px;margin-bottom:20px;">Placed on ${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &middot; Total ${money(order.total)}</p>
        <div class="timeline">
          ${ORDER_STAGES.map((stage, i) => {
            const cls = i < idx ? 'done' : (i === idx ? 'current' : 'pending');
            const icon = i < idx ? 'fa-check' : (i === idx ? 'fa-circle-notch' : 'fa-circle');
            const eta = {
              0: 'Order received, awaiting confirmation.',
              1: 'Your order has been confirmed.',
              2: 'Packed & handed to the courier partner.',
              3: 'Arriving soon — keep your phone handy.',
              4: 'Delivered. Enjoy your BOSERA fit!'
            }[i];
            return `
              <div class="timeline-step ${cls}">
                <div class="timeline-dot"><i class="fas ${icon}"></i></div>
                <div class="timeline-body"><strong>${stage}</strong><p>${eta}</p></div>
              </div>
            `;
          }).join('')}
        </div>
        <h3 style="font-size:15px;font-weight:800;margin:20px 0 10px;text-transform:uppercase;letter-spacing:0.05em;">Items</h3>
        ${order.items.map(i => `
          <div class="checkout-item">
            <a href="product.html?name=${encodeURIComponent(i.name)}"><img src="${i.img}" alt="${i.name}"></a>
            <div class="checkout-item-info"><div class="t">${i.name}</div><div class="s">Qty: ${i.qty}</div></div>
            <div class="cart-item-price">${money(i.price)}</div>
          </div>
        `).join('')}
        <h3 style="font-size:15px;font-weight:800;margin:20px 0 10px;text-transform:uppercase;letter-spacing:0.05em;">Delivery Address</h3>
        <p style="font-size:14px;">${order.name} &middot; ${order.phone}<br>${order.address}, ${order.city}, ${order.state} &mdash; ${order.pincode}</p>
      </div>
    `;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.orderId.value.trim().toUpperCase();
    if (id) lookupOrder(id);
  });

  const params = new URLSearchParams(window.location.search);
  const auto = params.get('order');
  if (auto) lookupOrder(decodeURIComponent(auto));
}

// =====================
// Order success (order-success.html)
// =====================
function renderOrderSuccess() {
  const box = document.getElementById('successBox');
  if (!box) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('order');
  box.innerHTML = `
    <div style="text-align:center;">
      <i class="fas fa-check-circle" style="font-size:64px;color:#1a7f37;margin-bottom:16px;"></i>
      <h2 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:0.03em;margin-bottom:10px;">Order Placed!</h2>
      <p style="color:#888;font-size:15px;margin-bottom:8px;">Thank you for shopping with BOSERA.</p>
      <p style="color:#555;font-size:14px;">${id ? `Your Order ID is <strong>${id}</strong>.` : ''}</p>
      <div style="margin-top:24px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <a class="btn btn-dark" href="track-order.html?order=${id || ''}">Track Order</a>
        <a class="btn btn-outline" href="/">Continue Shopping</a>
      </div>
    </div>
  `;
}

// =====================
// Auth
// =====================
function updateAuthUI() {
  const header = document.getElementById('accountDropdownHeader');
  const footer = document.getElementById('accountDropdownFooter');
  const nameEl = document.getElementById('accountName');
  const emailEl = document.getElementById('accountEmail');

  if (user) {
    header.innerHTML = `<strong>${user.name}</strong><span>${user.email}</span>`;
    footer.innerHTML = `<a href="/account" style="border-top:1px solid #f0f0f0;">My Account</a><a href="#" id="logoutBtn">Logout</a>`;
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      user = null;
      localStorage.removeItem('lbz_user');
      updateAuthUI();
      showToast('Logged out');
    });
  } else {
    header.innerHTML = '<strong>My Account</strong><span></span>';
    footer.innerHTML = `<a href="#" id="loginOpenBtn">Login</a><a href="#" id="signupOpenBtn">Sign Up</a>`;
    document.getElementById('loginOpenBtn').addEventListener('click', (e) => { e.preventDefault(); openModal('loginModal'); });
    document.getElementById('signupOpenBtn').addEventListener('click', (e) => { e.preventDefault(); openModal('signupModal'); });
  }

  // Re-render auth-dependent page sections (guarded, safe on every page)
  renderCheckoutPage();
  renderOrdersPage();
  renderAccountPage();
}

// =====================
// Modal Helpers
// =====================
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('active');
  document.body.style.overflow = '';
}

// =====================
// Toast
// =====================
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:9999;background:#ff4d00;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.15);transform:translateY(20px);opacity:0;transition:all 0.3s ease;';
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// =====================
// Hero Slider
// =====================
const slider = document.getElementById('heroSlider');
if (slider) {
  const slides = slider.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('heroDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  let currentSlide = 0;
  let autoSlideInterval;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('button');

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlideFn() { goToSlide(currentSlide + 1); }
  function prevSlideFn() { goToSlide(currentSlide - 1); }

  prevBtn.addEventListener('click', () => { prevSlideFn(); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { nextSlideFn(); resetAutoSlide(); });

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlideFn, 4000);
  }
  goToSlide(0);
  autoSlideInterval = setInterval(nextSlideFn, 4000);
}

// =====================
// Mobile Menu
// =====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const closeMenuBtn = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

function openMenu() { mobileMenu.classList.add('open'); overlay.classList.add('active'); }
function closeMenuFn() { mobileMenu.classList.remove('open'); overlay.classList.remove('active'); }

mobileMenuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenuFn);
overlay.addEventListener('click', closeMenuFn);

document.querySelectorAll('.has-submenu > a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sub = link.nextElementSibling;
    if (sub) sub.classList.toggle('open');
  });
});

// =====================
// Event Listeners
// =====================
window.addEventListener('beforeunload', () => { window.scrollTo(0, 0); });

// Touch device: make product actions always visible
if ('ontouchstart' in window) {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(el => el.classList.add('always-visible'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Init state
  saveCart();
  renderCart();
  updateWishlistBadge();
  updateAuthUI();

  const cartSlideout = document.getElementById('cartSlideout');

  // Cart toggle
  document.getElementById('cartIcon').addEventListener('click', (e) => {
    e.preventDefault();
    if (!cartSlideout) return;
    if (!user && cart.length === 0) { showSplash('cart'); return; }
    cartSlideout.classList.toggle('active');
    overlay.classList.toggle('active');
  });
  document.getElementById('cartClose')?.addEventListener('click', () => {
    cartSlideout?.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Active nav link
  const page = window.location.pathname.replace(/^\//, '') || 'index';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').replace(/^\//, '');
    if (page === href || (page === 'index' && href === 'index')) {
      link.classList.add('active');
    }
  });

  // Auth modals
  document.getElementById('accountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (!user) { openModal('loginModal'); }
    else { document.getElementById('accountDropdown').classList.toggle('open'); }
  });

  document.getElementById('loginClose')?.addEventListener('click', () => closeModal('loginModal'));
  document.getElementById('signupClose')?.addEventListener('click', () => closeModal('signupModal'));

  document.getElementById('loginToSignup')?.addEventListener('click', (e) => {
    e.preventDefault(); closeModal('loginModal'); openModal('signupModal');
  });
  document.getElementById('signupToLogin')?.addEventListener('click', (e) => {
    e.preventDefault(); closeModal('signupModal'); openModal('loginModal');
  });

  // Splash modal
  document.getElementById('splashClose')?.addEventListener('click', (e) => { e.preventDefault(); closeSplash(); });
  document.getElementById('splashContinue')?.addEventListener('click', (e) => { e.preventDefault(); closeSplash(); });
  document.getElementById('splashLoginBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSplash(); openModal('loginModal'); });
  document.getElementById('splashSignupBtn')?.addEventListener('click', (e) => { e.preventDefault(); closeSplash(); openModal('signupModal'); });

  // Account page login/signup buttons
  document.getElementById('accLoginBtn')?.addEventListener('click', () => openModal('loginModal'));
  document.getElementById('accSignupBtn')?.addEventListener('click', () => openModal('signupModal'));

  // Checkout page login/signup buttons
  document.getElementById('coLoginBtn')?.addEventListener('click', () => openModal('loginModal'));
  document.getElementById('coSignupBtn')?.addEventListener('click', () => openModal('signupModal'));

  // Overlay closes cart & modals
  overlay.addEventListener('click', () => {
    closeMenuFn();
    cartSlideout?.classList.remove('active');
    closeModal('loginModal');
    closeModal('signupModal');
  });

  // Login form
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const stored = localStorage.getItem('lbz_users');
    const users = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      user = { name: found.name, email: found.email };
      localStorage.setItem('lbz_user', JSON.stringify(user));
      updateAuthUI();
      closeModal('loginModal');
      showToast(`Welcome back, ${found.name}!`);
    } else {
      showToast('Invalid email or password');
    }
    e.target.reset();
  });

  // Signup form
  document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const stored = localStorage.getItem('lbz_users');
    const users = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email === email)) {
      showToast('Email already registered');
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem('lbz_users', JSON.stringify(users));
    user = { name, email };
    localStorage.setItem('lbz_user', JSON.stringify(user));
    updateAuthUI();
    closeModal('signupModal');
    showToast(`Welcome, ${name}!`);
    e.target.reset();
  });

  // Search
  document.getElementById('searchBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Search coming soon!');
  });

  // Newsletter
  document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    if (input.value) {
      showToast('Subscribed successfully!');
      input.value = '';
    }
  });

  // Page renderers
  renderCartPage();
  renderCheckoutPage();
  renderOrdersPage();
  renderAccountPage();
  renderProductPage();
  renderTrackOrder();
  renderOrderSuccess();

  // Sale + Best Sellers grids
  const saleGrid = document.getElementById('saleGrid');
  if (saleGrid) renderProducts('saleGrid', allProducts.filter(p => p.oldPrice || p.badge === 'Sale'));
  const bsGrid = document.getElementById('bestSellersGrid');
  if (bsGrid) renderProducts('bestSellersGrid', allProducts.filter(p => p.badge === 'New' || p.oldPrice));

  // Contact form
  document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Message sent! We\'ll get back to you within 24 hours.');
    this.reset();
  });
});

// =====================
// Dynamic page title (tab switch rotation)
// =====================
(function () {
  const originalTitle = document.title;
  const attentionTitles = ["🔥 Don't miss out!", '👀 Come back!', 'We miss you! 💔'];
  let titleIndex = 0;
  let isAway = false;
  let rotateTimer = null;

  function startRotation() {
    if (isAway) return;
    isAway = true;
    const rotate = () => {
      titleIndex = (titleIndex + 1) % attentionTitles.length;
      document.title = attentionTitles[titleIndex];
    };
    rotate();
    rotateTimer = setInterval(rotate, 1000);
  }

  function stopRotation() {
    if (!isAway) return;
    isAway = false;
    clearInterval(rotateTimer);
    rotateTimer = null;
    document.title = originalTitle;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) startRotation();
    else stopRotation();
  });

  window.addEventListener('blur', startRotation);
  window.addEventListener('focus', stopRotation);
})();

// =====================
// Home: solid header after scroll (transparent over banner at top)
// =====================
(function () {
  const header = document.querySelector('.header');
  if (!header || !document.body.classList.contains('home')) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 15);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
