// =====================
// Product Data
// =====================
const products = {
  tops: [
    { name: "Tie Back Halter Fitted Top in Powder Blue", price: 749, img: "https://littleboxindia.com/cdn/shop/files/20260625101011-TP13301_20_2.jpg?v=1783617144&width=480", badge: "New" },
    { name: "V-Neck Collared Knit Fitted Top in Navy", price: 599, oldPrice: 899, img: "https://littleboxindia.com/cdn/shop/files/V-Neck_Collared_Layered_Look_Fitted_Knit_Top_in_Navy_Blue.webp?v=1769775291&width=480", badge: "Sale" },
    { name: "Asymmetric Neck Curved Hem Half Sleeve Top", price: 799, img: "https://littleboxindia.com/cdn/shop/files/20260603103035-3.jpg?v=1780591852&width=480" },
    { name: "Checkered Collared Button Down Fitted Top", price: 749, img: "https://littleboxindia.com/cdn/shop/files/Checkered_Collared_Button_Down_Fitted_Short_Sleeve_Top.webp?v=1783680391&width=480" },
    { name: "Sweetheart Neck Gingham Top in Red", price: 699, oldPrice: 999, img: "https://littleboxindia.com/cdn/shop/files/Sweetheart_Neck_Slim_Fit_Straight_Hem_Gingham_Top_in_Red.jpg?v=1783667285&width=480", badge: "Sale" },
    { name: "Boat Neck Striped Half Sleeves Top in Pink", price: 799, img: "https://littleboxindia.com/cdn/shop/files/20260521132825-TP13378_20_1.jpg?v=1779371539&width=480" },
    { name: "Satin Halter Neck Backless Tank Top in Lilac", price: 799, img: "https://littleboxindia.com/cdn/shop/files/20260708064608-LILAC1.jpg?v=1783664846&width=480" },
    { name: "Slim Fit Short Sleeve Collared Top in White", price: 699, img: "https://littleboxindia.com/cdn/shop/files/Slim_Fit_Short_Sleeve_Fitted_Collared_Top_in_White.jpg?v=1773915478&width=480" },
    { name: "Polka Dot Bow Tie Top With Scarf", price: 549, oldPrice: 799, img: "https://littleboxindia.com/cdn/shop/files/Polka_Dot_Bow_Tie_Top_With_Scarf.jpg?v=1776344669&width=480", badge: "Sale" },
    { name: "Casual Sweetheart Neck Checkered Top", price: 749, img: "https://littleboxindia.com/cdn/shop/files/Casual_Sweetheart_Neck_Checkered_Top.webp?v=1783679883&width=480" },
  ],
  dresses: [
    { name: "Ruched Waist Batwing Sleeve Mini Dress in Dusty Blue", price: 999, img: "https://littleboxindia.com/cdn/shop/files/20260703124130-DR14223_20_1.jpg?v=1783676885&width=480", badge: "New" },
    { name: "Off Shoulder Mesh Ruched Fitted Dress in Coco", price: 1199, oldPrice: 1599, img: "https://littleboxindia.com/cdn/shop/files/Off_Shoulder_Mesh_Ruched_Fitted_Dress_With_Long_Sleeve_in_Coco_0.webp?v=1784022172&width=480", badge: "Sale" },
    { name: "Maroon Faux Fishbone One-Shoulder Dress", price: 1199, img: "https://littleboxindia.com/cdn/shop/files/Maroon_Faux_Fishbone_Design_Romantic_One-Shoulder_Dress.webp?v=1754570398&width=480" },
    { name: "Off Shoulder Mesh Ruched Dress in Dark Red", price: 1199, img: "https://littleboxindia.com/cdn/shop/files/Off_Shoulder_Mesh_Ruched_Fitted_Dress_With_Long_Sleeve_in_Dark_Red.webp?v=1756114327&width=480" },
    { name: "Waist Twist High Slit Sleeveless Midi in Brown", price: 899, img: "https://littleboxindia.com/cdn/shop/files/20260423124836-757.jpg?v=1776963832&width=480" },
    { name: "Knitted Asymmetrical Neck Ruffle Mini Dress", price: 899, img: "https://littleboxindia.com/cdn/shop/files/20260225045141-18.jpg?v=1772106300&width=480" },
    { name: "Ruched Waist Batwing Sleeve Mini in Chocolate", price: 999, img: "https://littleboxindia.com/cdn/shop/files/20260703122539-DR14030.jpg?v=1783676897&width=480" },
    { name: "Sleeveless Fitted Maxi Dress in Coffee", price: 1399, img: "https://littleboxindia.com/cdn/shop/files/Sleeveless_Fitted_Maxi_Dress_in_Coffee.jpg?v=1774272209&width=480" },
    { name: "Off Shoulder Mesh Dress in Dusty Blue", price: 1199, img: "https://littleboxindia.com/cdn/shop/files/Off_Shoulder_Mesh_Ruched_Fitted_Dress_With_Long_Sleeve_In_Dusty_Blue.webp?v=1754571187&width=480" },
    { name: "Asymmetrical Neck Floral Flared Sleeve Mini", price: 799, img: "https://littleboxindia.com/cdn/shop/files/86-1.jpg?v=1782450311&width=480" },
  ],
  handbags: [
    { name: "Functional Shoulder Bag With Contrast Strap", price: 2199, img: "https://littleboxindia.com/cdn/shop/files/20260512114021-SHB1035_20_1.jpg?v=1778659618&width=480" },
    { name: "Adjustable Strap Shoulder Bag in Espresso", price: 2399, oldPrice: 2999, img: "https://littleboxindia.com/cdn/shop/files/20260512114315-SHB1034_20_1.jpg?v=1778659317&width=480", badge: "Sale" },
    { name: "Glossy Shoulder Bag With Tie Detail in Red", price: 1399, img: "https://littleboxindia.com/cdn/shop/files/20260512104923-SHB1004_20_4.jpg?v=1778657418&width=480" },
    { name: "Chain Strap Top Handle Sling Bag in Red", price: 1899, img: "https://littleboxindia.com/cdn/shop/files/20260512111006-SLB1042_20_1.jpg?v=1778660297&width=480" },
    { name: "Buckle Detail Structured Shoulder Bag in Blue", price: 1899, img: "https://littleboxindia.com/cdn/shop/files/20260512100846-SHB1052_20_1.jpg?v=1778661082&width=480" },
    { name: "Soft Slouchy Shoulder bag in Mocha Brown", price: 1899, img: "https://littleboxindia.com/cdn/shop/files/SHB1010_4.webp?v=1778672810&width=480" },
    { name: "Turn Lock Denim Crossbody Sling Bag", price: 1399, img: "https://littleboxindia.com/cdn/shop/files/20260512110511-SLB1043_20_5.jpg?v=1778660375&width=480" },
    { name: "Buckle Accent Office Tote Bag in Cream", price: 2499, img: "https://littleboxindia.com/cdn/shop/files/20260512103900-TOB1047_20_6.jpg?v=1778660766&width=480" },
    { name: "Chic Minimal Shoulder Bag in Caramel", price: 1499, img: "https://littleboxindia.com/cdn/shop/files/20260512105925-SHB1007_20_4.jpg?v=1778657834&width=480" },
    { name: "Denim Buckle Detail Top Handle Bag", price: 2099, img: "https://littleboxindia.com/cdn/shop/files/20260512120311-SHB1031_20_3.jpg?v=1778658853&width=480" },
  ],
  footwear: [
    { name: "Double Buckle Strap Platform Mary Jane in Black", price: 1699, img: "https://littleboxindia.com/cdn/shop/files/20260605105653-PL1311_20_2.jpg?v=1780661873&width=480" },
    { name: "Motorcycle Side Zipper Chunky Sole Knee Boots", price: 1799, oldPrice: 2499, img: "https://littleboxindia.com/cdn/shop/files/Motorcycle_Side_Zipper_Chunky_Sole_Knee_Boots.jpg?v=1769686487&width=480", badge: "Sale" },
    { name: "Oxford Lace Up Brogue Boots", price: 1799, img: "https://littleboxindia.com/cdn/shop/files/20260422111623-BT1294_4.jpg?v=1776949362&width=480" },
    { name: "Burgundy Square Toe Ballet Flats", price: 699, img: "https://littleboxindia.com/cdn/shop/files/Burgundy_Square_Toe_Womens_Ballet_Flats.jpg?v=1769693803&width=480" },
    { name: "Pointed Toe Buckle Strap Slingback Heels", price: 1399, img: "https://littleboxindia.com/cdn/shop/files/20260605110959-HL1499_20_3.jpg?v=1780661650&width=480" },
    { name: "Lace-Up Slim Fit Knee-High Block Heel Boots", price: 2399, img: "https://littleboxindia.com/cdn/shop/files/Lace-Up_Slim_Fit_Solid_Knee-High_Block_Heel_Boots_in_Black.webp?v=1770979615&width=480" },
    { name: "Classic Mary Jane Glossy Platform Shoes", price: 2299, img: "https://littleboxindia.com/cdn/shop/files/20260422103604-PL1307_4.jpg?v=1776946436&width=480" },
    { name: "Block Heel Front Zip Solid Mid-Calf Boots", price: 2299, img: "https://littleboxindia.com/cdn/shop/files/BT1264_2.webp?v=1776687602&width=480" },
    { name: "Double Buckle Strap Mary Jane in Brown", price: 1699, img: "https://littleboxindia.com/cdn/shop/files/20260605105024-BT1292_20_3.jpg?v=1780661002&width=480" },
    { name: "Round Toe Croco Textured Lace Up Boots", price: 2399, img: "https://littleboxindia.com/cdn/shop/files/BT1275_3.webp?v=1776687841&width=480" },
  ],
  trousers: [
    { name: "High Waist Wide Leg Linen Trousers in White", price: 999, img: "https://littleboxindia.com/cdn/shop/files/High_Waist_Wide_Leg_Linen_Trousers_In_White.webp?v=1769519079&width=480" },
    { name: "Striped Suit Pants High Waist in Brown", price: 1099, oldPrice: 1499, img: "https://littleboxindia.com/cdn/shop/files/Striped_Suit_Pants_High_Waist_Trousers_in_Brown.jpg?v=1781597998&width=480", badge: "Sale" },
    { name: "High Waist Pleated Trousers in Black", price: 1099, img: "https://littleboxindia.com/cdn/shop/products/High_Waist_Pleated_Trousers_In_Black.jpg?v=1769664453&width=480" },
    { name: "Mid Rise Straight Leg Trousers in Coco Brown", price: 999, img: "https://littleboxindia.com/cdn/shop/files/Mid_Rise_Solid_Pocket_Straight_Leg_Trousers_In_Coco_Brown.jpg?v=1743077104&width=480" },
    { name: "Mid Rise Straight Leg Trousers in Off-White", price: 949, img: "https://littleboxindia.com/cdn/shop/files/Mid_Rise_Solid_Pocket_Straight_Leg_Trousers_In_Off-White.jpg?v=1743076811&width=480" },
    { name: "Korean Style Baggy Trousers Combo", price: 2099, img: "https://littleboxindia.com/cdn/shop/products/Combo_Korean_Style_Trousers_With_Baggy_Fit_In_Black_And_Off-White.jpg?v=1769664087&width=480" },
    { name: "Pleated Wide Leg Tailored Pants in Black", price: 1199, img: "https://littleboxindia.com/cdn/shop/products/New_Nostalgia_Pleated_Wide_Leg_Trousers_In_Black.jpg?v=1769664793&width=480" },
    { name: "High Waist Pleated Trousers in White", price: 1199, img: "https://littleboxindia.com/cdn/shop/products/High_Waist_Pleated_Trousers_In_White.jpg?v=1769597286&width=480" },
    { name: "Pleated Wide-Leg Flowy Trousers in Black", price: 1199, img: "https://littleboxindia.com/cdn/shop/files/Black_High-Waist_Pleated_Wide-Leg_Flowy_Trousers.jpg?v=1776432918&width=480" },
    { name: "Draped Loose Fit Wide Leg Trouser in Rust", price: 999, img: "https://littleboxindia.com/cdn/shop/files/20260610072543-TR13658_20_3.jpg?v=1781595494&width=480" },
  ],
  coords: [
    { name: "Tie Front Shrug & Cami Dress Co-Ord in Cocoa", price: 1599, img: "https://littleboxindia.com/cdn/shop/files/20260709122819-set_203a.jpg?v=1783613995&width=480" },
    { name: "Off Shoulder Crop Top & Wide Leg Pant in Grey", price: 899, oldPrice: 1399, img: "https://littleboxindia.com/cdn/shop/products/Off_Shoulder_Crop_Top_And_Wide_Leg_Pant_In_Grey.jpg?v=1741852524&width=480", badge: "Sale" },
    { name: "Striped V-Neck Jacket & Wide-Leg Pants Suit", price: 1849, img: "https://littleboxindia.com/cdn/shop/files/Navy_Blue_Striped_V-Neck_Asymmetric_Long_Sleeve_Jacket_Wide-Leg_Pants_Suit.jpg?v=1770297504&width=480" },
    { name: "Tie Front Top & Mini Shorts Two Piece Set", price: 899, img: "https://littleboxindia.com/cdn/shop/files/ST13153.webp?v=1778926406&width=480" },
    { name: "Halter Neck Sleeveless Top & Pants Set", price: 1399, img: "https://littleboxindia.com/cdn/shop/files/Pinstriped_Halter_Neck_Sleeveless_Top_And_Pants_Set_In_Off-White.jpg?v=1742040072&width=480" },
    { name: "Vest Top & Wide Leg Pants Set in Beige", price: 1599, img: "https://littleboxindia.com/cdn/shop/files/20260708124730-ST12569_20_2.jpg?v=1783599214&width=480" },
    { name: "Off-Shoulder Ruffled Top & Mermaid Skirt Set", price: 1699, img: "https://littleboxindia.com/cdn/shop/files/Mesh_Off-Shoulder_Polka_Dot_Ruffled_Top_Mermaid_Maxi_Skirt_Set.jpg?v=1771420959&width=480" },
    { name: "Vest Coat & Trousers Set in Cappuccino", price: 1699, img: "https://littleboxindia.com/cdn/shop/products/Matching_Set_of_Vest_Coat_and_Trousers_in_Cappuccino.jpg?v=1782129559&width=480" },
    { name: "Golden Buttons Top & Flowy Pants in Maroon", price: 2099, img: "https://littleboxindia.com/cdn/shop/files/Sleeveless_Golden_Buttons_Top_And_Flowy_Wide-Leg_Pants_Set_in_Maroon.jpg?v=1781939529&width=480" },
    { name: "Halter Top & Wide Leg Pants Set in White/Black", price: 1699, img: "https://littleboxindia.com/cdn/shop/files/Halter_Neck_Top_and_Wide_Leg_Straight_Pants_Set_in_White_and_Black.jpg?v=1777874799&width=480" },
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
    const badgeHtml = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
    const nameEscaped = p.name.replace(/'/g, "\\'");
    const inWishlist = wishlist.some(w => w.name === p.name);

    return `
      <div class="product-card">
        <div class="product-image">
          ${badgeHtml}
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          <div class="product-actions">
            <button onclick="toggleWishlist('${nameEscaped}', '${p.img}', ${p.price})" title="Wishlist"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
            <button onclick="addToCart('${nameEscaped}', '${p.img}', ${p.price})" title="Add to Cart"><i class="fas fa-shopping-bag"></i></button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">₹${p.price.toLocaleString()} ${oldPriceHtml}</div>
        </div>
      </div>
    `;
  }).join('');
}

renderProducts('topsGrid', products.tops);
renderProducts('dressesGrid', products.dresses);
renderProducts('handbagsGrid', products.handbags);
renderProducts('footwearGrid', products.footwear);
renderProducts('trousersGrid', products.trousers);
renderProducts('coordsGrid', products.coords);

// Page-specific grids
const allProducts = [...products.tops, ...products.dresses, ...products.handbags, ...products.footwear, ...products.trousers, ...products.coords];
renderProducts('newArrivalsGrid', allProducts);
renderProducts('clothingGrid', allProducts);
renderProducts('footwearPageGrid', products.footwear);

// =====================
// Cart
// =====================
function addToCart(name, img, price) {
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
}

// =====================
// Wishlist
// =====================
function toggleWishlist(name, img, price) {
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
}

function reRenderProducts() {
  renderProducts('topsGrid', products.tops);
  renderProducts('dressesGrid', products.dresses);
  renderProducts('handbagsGrid', products.handbags);
  renderProducts('footwearGrid', products.footwear);
  renderProducts('trousersGrid', products.trousers);
  renderProducts('coordsGrid', products.coords);
  renderProducts('newArrivalsGrid', allProducts);
  renderProducts('clothingGrid', allProducts);
  renderProducts('footwearPageGrid', products.footwear);
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
    footer.innerHTML = `<a href="#" id="logoutBtn">Logout</a>`;
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
}

// =====================
// Modal Helpers
// =====================
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
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
  toast.style.cssText = 'position:fixed;bottom:80px;right:24px;z-index:9999;background:#f9488e;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:500;box-shadow:0 8px 32px rgba(0,0,0,0.15);transform:translateY(20px);opacity:0;transition:all 0.3s ease;';
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

document.addEventListener('DOMContentLoaded', () => {
  // Init state
  saveCart();
  renderCart();
  updateWishlistBadge();
  updateAuthUI();

  // Cart toggle
  document.getElementById('cartIcon').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('cartSlideout').classList.toggle('active');
    overlay.classList.toggle('active');
  });
  document.getElementById('cartClose').addEventListener('click', () => {
    document.getElementById('cartSlideout').classList.remove('active');
    overlay.classList.remove('active');
  });

  // Auth modals
  document.getElementById('accountBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (!user) { openModal('loginModal'); }
  });

  document.getElementById('loginClose').addEventListener('click', () => closeModal('loginModal'));
  document.getElementById('signupClose').addEventListener('click', () => closeModal('signupModal'));

  document.getElementById('loginToSignup').addEventListener('click', (e) => {
    e.preventDefault(); closeModal('loginModal'); openModal('signupModal');
  });
  document.getElementById('signupToLogin').addEventListener('click', (e) => {
    e.preventDefault(); closeModal('signupModal'); openModal('loginModal');
  });

  // Overlay closes cart & modals
  overlay.addEventListener('click', () => {
    closeMenuFn();
    document.getElementById('cartSlideout').classList.remove('active');
    closeModal('loginModal');
    closeModal('signupModal');
  });

  // Login form
  document.getElementById('loginForm').addEventListener('submit', (e) => {
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
  document.getElementById('signupForm').addEventListener('submit', (e) => {
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
  document.getElementById('searchBtn').addEventListener('click', (e) => {
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
});
