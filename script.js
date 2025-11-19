// script.js — interactividad y carrito funcional
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Productos (datos simplificados)
  const products = [
    { id:1, name:'Zapatillas Running Pro', category:'Running', price:129.99, originalPrice:159.99, rating:4.8, reviews:234, image:'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800', badge:'Oferta' },
    { id:2, name:'Mancuernas Ajustables 20kg', category:'Fitness', price:89.99, originalPrice:null, rating:4.9, reviews:156, image:'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800', badge:'Nuevo' },
    { id:3, name:'Bicicleta Mountain Bike', category:'Ciclismo', price:899.99, originalPrice:null, rating:4.7, reviews:89, image:'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=800', badge:null },
    { id:4, name:'Esterilla Yoga Premium', category:'Fitness', price:45.99, originalPrice:59.99, rating:4.6, reviews:312, image:'https://images.pexels.com/photos/6453356/pexels-photo-6453356.jpeg?auto=compress&cs=tinysrgb&w=800', badge:'Oferta' },
    { id:5, name:'Cuerda de Saltar Pro', category:'Fitness', price:24.99, originalPrice:null, rating:4.5, reviews:445, image:'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800', badge:null },
    { id:6, name:'Casco Ciclismo Aero', category:'Ciclismo', price:149.99, originalPrice:null, rating:4.9, reviews:67, image:'https://images.pexels.com/photos/6386607/pexels-photo-6386607.jpeg?auto=compress&cs=tinysrgb&w=800', badge:'Nuevo' }
  ];

  const grid = document.getElementById('products-grid');
  const cartCountEl = document.getElementById('cart-count');
  const cartBtn = document.getElementById('cart-btn');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartContents = document.getElementById('cart-contents');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  const CART_KEY = 'sportspro_cart_v1';

  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  function formatPrice(v){
    return '$' + v.toFixed(2);
  }

  function updateCartCount(){
    const totalQty = cart.reduce((s,i)=> s + i.qty, 0);
    cartCountEl.textContent = String(totalQty);
  }

  function saveCart(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }

  function addToCart(productId, qty = 1){
    const prod = products.find(p => p.id === Number(productId));
    if(!prod) return;
    const existing = cart.find(i => i.id === prod.id);
    if(existing){
      existing.qty += qty;
    } else {
      cart.push({ id: prod.id, name: prod.name, price: prod.price, image: prod.image, qty });
    }
    saveCart();
  }

  function removeFromCart(productId){
    cart = cart.filter(i => i.id !== Number(productId));
    saveCart();
  }

  function changeQty(productId, qty){
    const it = cart.find(i => i.id === Number(productId));
    if(!it) return;
    it.qty = Math.max(0, qty);
    if(it.qty === 0) removeFromCart(productId);
    else saveCart();
  }

  function clearCart(){
    cart = [];
    saveCart();
  }

  function renderProducts(){
    grid.innerHTML = products.map(p => `
      <div class="product-card relative group">
        <div class="relative overflow-hidden">
          <img src="${p.image}" alt="${p.name}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500">
          ${p.badge ? `<div class="product-badge ${p.badge==='Oferta' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}">${p.badge}</div>`: ''}
          <button class="favorite-btn" data-fav-id="${p.id}" title="Favorito">❤</button>
          <div class="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button class="add-cart w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold" data-add-id="${p.id}">Agregar al Carrito</button>
          </div>
        </div>
        <div class="p-4">
          <div class="text-sm text-yellow-600 font-semibold mb-1">${p.category}</div>
          <h3 class="text-lg font-bold mb-2">${p.name}</h3>
          <div class="flex items-center space-x-2 mb-2">
            <div class="flex items-center text-yellow-400">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
            <span class="text-sm text-gray-600">${p.rating} · (${p.reviews})</span>
          </div>
          <div class="flex items-baseline space-x-2">
            <span class="text-xl font-bold text-gray-900">${formatPrice(p.price)}</span>
            ${p.originalPrice ? `<span class="text-gray-400 line-through">${formatPrice(p.originalPrice)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderCart(){
    if(!cartContents) return;
    if(cart.length === 0){
      cartContents.innerHTML = `<div class="text-center text-gray-600 py-12">Tu carrito está vacío.</div>`;
      cartSubtotalEl.textContent = formatPrice(0);
      return;
    }

    let html = '';
    let subtotal = 0;
    cart.forEach(item => {
      const line = item.price * item.qty;
      subtotal += line;
      html += `
        <div class="flex items-center gap-4 mb-4 border rounded p-2">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-12 object-cover rounded" />
          <div class="flex-1">
            <div class="font-semibold">${item.name}</div>
            <div class="text-sm text-gray-600">${formatPrice(item.price)} c/u</div>
            <div class="mt-2 flex items-center gap-2">
              <button class="qty-btn bg-gray-200 px-2 py-1 rounded" data-action="decrease" data-id="${item.id}">-</button>
              <div class="px-3 py-1 border rounded">${item.qty}</div>
              <button class="qty-btn bg-gray-200 px-2 py-1 rounded" data-action="increase" data-id="${item.id}">+</button>
              <button class="ml-4 text-sm text-red-500" data-action="remove" data-id="${item.id}">Eliminar</button>
            </div>
          </div>
          <div class="text-right font-semibold">${formatPrice(line)}</div>
        </div>
      `;
    });

    cartContents.innerHTML = html;
    cartSubtotalEl.textContent = formatPrice(subtotal);
  }

  // Inicialización
  renderProducts();
  updateCartCount();
  renderCart();

  // Delegación de eventos para favoritos y añadir al carrito
  grid.addEventListener('click', (ev) => {
    const favBtn = ev.target.closest('[data-fav-id]');
    if(favBtn){
      favBtn.classList.toggle('favorited');
      return;
    }

    const addBtn = ev.target.closest('[data-add-id]');
    if(addBtn){
      const id = addBtn.getAttribute('data-add-id');
      addToCart(id, 1);
      addBtn.textContent = 'Añadido ✓';
      addBtn.disabled = true;
      setTimeout(()=>{ addBtn.textContent = 'Agregar al Carrito'; addBtn.disabled=false; }, 900);
    }
  });

  // Panel del carrito: abrir / cerrar
  cartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('translate-x-full');
  });
  cartClose.addEventListener('click', () => {
    cartPanel.classList.add('translate-x-full');
  });

  // Delegación dentro del panel del carrito
  cartContents.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-action]');
    if(!btn) return;
    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');
    if(action === 'remove') removeFromCart(id);
    if(action === 'increase') changeQty(id, (cart.find(i=>i.id===Number(id))?.qty || 0) + 1);
    if(action === 'decrease') changeQty(id, (cart.find(i=>i.id===Number(id))?.qty || 0) - 1);
  });

  clearCartBtn.addEventListener('click', () => {
    if(confirm('¿Vaciar el carrito?')) clearCart();
  });

  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0) return alert('Tu carrito está vacío.');
    // Simulación de checkout
    const total = cart.reduce((s,i)=> s + i.price * i.qty, 0);
    alert(`Total a pagar: ${formatPrice(total)}\n(Checkout simulado)`);
    // Aquí podríamos redirigir a página de pago o integrar pasarela
  });

  // Newsletter (simulado)
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if(!email) return alert('Introduce tu correo.');
    alert('Gracias — comprobando ' + email + '. (Simulado)');
    newsletterForm.reset();
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        const el = document.querySelector(href);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); mobileMenu.classList.add('hidden'); }
      }
    });
  });
});
