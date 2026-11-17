// menu.js – renders menu and home page elements
const Menu = {
  // Utility to get unique categories from menu
  getCategories: function(){
    const menu = Storage.getMenu();
    const set = new Set(menu.map(i=>i.category));
    return Array.from(set);
  },
  // Render categories as buttons (used on home and menu pages)
  renderCategories: function(containerId, activeCategory=null){
    const container = document.getElementById(containerId);
    if (!container) return;
    const categories = this.getCategories();
    let html = `<button class="btn category-btn" data-cat="all">All</button>`;
    categories.forEach(cat=>{
      const active = cat===activeCategory ? 'active' : '';
      html += `<button class="btn category-btn ${active}" data-cat="${cat}">${cat}</button>`;
    });
    container.innerHTML = html;
    // attach listeners
    container.querySelectorAll('.category-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const cat = btn.dataset.cat;
        if (window.location.pathname.endsWith('home.html')) {
          this.renderFeatured(cat);
        } else {
          this.renderMenuPage(cat);
        }
      });
    });
  },
  // Render featured items on home page (first 4 items of selected category or all)
  renderFeatured: function(filterCat='all'){
    const container = document.getElementById('featured-list');
    if (!container) return;
    const menu = Storage.getMenu();
    let items = filterCat==='all' ? menu : menu.filter(i=>i.category===filterCat);
    items = items.slice(0,4);
    let html='';
    items.forEach(item=>{
      html+=`<div class="card">
        <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/200?text=No+Image';"/>
        <div class="info">
          <h4>${item.name}</h4>
          <p>Category: ${item.category}</p>
          <p>₹${item.price} | Stock: ${item.stock}</p>
          <button class="btn primary add-to-cart" data-id="${item.id}">Add to Cart</button>
        </div>
      </div>`;
    });
    container.innerHTML = html;
    // add listeners for add to cart
    container.querySelectorAll('.add-to-cart').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const user = Session.getCurrentUser();
        const res = Cart.addItem(user.id, btn.dataset.id);
        if (!res.ok) alert(res.msg);
        else {
          document.getElementById('cart-count').textContent = Cart.getCount(user.id);
        }
      });
    });
  },
  // Render the full menu page with optional filter
  renderMenuPage: function(filterCat='all'){
    const grid = document.getElementById('menu-grid');
    const empty = document.getElementById('empty-state');
    const categoryContainer = document.getElementById('category-buttons');
    if (!grid) return;
    // Render category buttons
    this.renderCategories('category-buttons', filterCat==='all'?null:filterCat);
    const menu = Storage.getMenu();
    let items = filterCat==='all' ? menu : menu.filter(i=>i.category===filterCat);
    // Apply search if present
    const searchInput = document.getElementById('search-input');
    if (searchInput && searchInput.value.trim()){
      const term = searchInput.value.trim().toLowerCase();
      items = items.filter(i=>i.name.toLowerCase().includes(term) || i.category.toLowerCase().includes(term));
    }
    grid.innerHTML='';
    if (items.length===0){
      empty.style.display='block';
      return;
    }
    empty.style.display='none';
    items.forEach(item=>{
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/200?text=No+Image';"/>
        <div class="info">
          <h4>${item.name}</h4>
          <p>Category: ${item.category}</p>
          <p>Price: ₹${item.price}</p>
          <p>Stock: ${item.stock}</p>
          <button class="btn primary add-to-cart" data-id="${item.id}">Add to Cart</button>
        </div>`;
      grid.appendChild(card);
    });
    // add to cart listeners
    grid.querySelectorAll('.add-to-cart').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const user = Session.getCurrentUser();
        const res = Cart.addItem(user.id, btn.dataset.id);
        if (!res.ok) alert(res.msg);
        else document.getElementById('cart-count').textContent = Cart.getCount(user.id);
      });
    });
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn){
      searchBtn.onclick = ()=>{ this.renderMenuPage(filterCat); };
    }
  },
  // Home page entry point
  renderHome: function(){
    this.renderCategories('category-list');
    this.renderFeatured('all');
  }
};
window.Menu = Menu;
