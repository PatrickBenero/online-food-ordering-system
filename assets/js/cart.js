// cart.js – cart operations for a given customer
const Cart = {
  // retrieve cart array for customer
  getCart: function(customerId) {
    return Storage.getCart(customerId);
  },
  // save cart array
  setCart: function(customerId, cart) {
    Storage.setCart(customerId, cart);
  },
  // add item (by menu id) with qty 1 default
  addItem: function(customerId, itemId) {
    const menu = Storage.getMenu();
    const item = menu.find(i => i.id === itemId);
    if (!item) return {ok:false, msg:'Item not found'};
    if (item.stock <= 0) return {ok:false, msg:'Out of stock'};
    const cart = this.getCart(customerId);
    const existing = cart.find(c => c.itemId === itemId);
    if (existing) {
      if (existing.qty >= Math.min(item.stock,10)) return {ok:false, msg:'Maximum quantity reached'};
      existing.qty++;
    } else {
      cart.push({itemId, qty:1});
    }
    this.setCart(customerId, cart);
    return {ok:true};
  },
  // update quantity (positive or negative delta)
  updateQty: function(customerId, itemId, newQty) {
    const menuItem = Storage.getMenu().find(i=>i.id===itemId);
    if (!menuItem) return {ok:false,msg:'Item not found'};
    if (newQty < 1) return {ok:false,msg:'Quantity must be at least 1'};
    if (newQty > Math.min(menuItem.stock,10)) return {ok:false,msg:'Quantity exceeds stock or limit'};
    const cart = this.getCart(customerId);
    const entry = cart.find(c=>c.itemId===itemId);
    if (!entry) return {ok:false,msg:'Item not in cart'};
    entry.qty = newQty;
    this.setCart(customerId, cart);
    return {ok:true};
  },
  // remove item completely
  removeItem: function(customerId, itemId) {
    let cart = this.getCart(customerId);
    cart = cart.filter(c=>c.itemId!==itemId);
    this.setCart(customerId, cart);
  },
  // clear cart
  clear: function(customerId) {
    this.setCart(customerId, []);
  },
  // total item count
  getCount: function(customerId) {
    const cart = this.getCart(customerId);
    return cart.reduce((sum,c)=>sum+c.qty,0);
  },
  // compute total price (subtotal only)
  getSubtotal: function(customerId) {
    const cart = this.getCart(customerId);
    const menu = Storage.getMenu();
    return cart.reduce((sum,c)=>{
      const item = menu.find(i=>i.id===c.itemId);
      return sum + (item? item.price * c.qty : 0);
    },0);
  },
  // render cart table (used by cart.html)
  renderCart: function(customerId) {
    const cart = this.getCart(customerId);
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    if (cart.length===0) {
      document.getElementById('empty-cart').style.display='block';
      document.getElementById('checkout-btn').disabled = true;
      document.getElementById('total-count').textContent='0';
      document.getElementById('grand-total').textContent='0';
      return;
    }
    document.getElementById('empty-cart').style.display='none';
    const menu = Storage.getMenu();
    cart.forEach(entry=>{
      const item = menu.find(i=>i.id===entry.itemId);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td><button class="qty-dec" data-id="${item.id}">-</button> ${entry.qty} <button class="qty-inc" data-id="${item.id}">+</button></td>
        <td>₹${item.price}</td>
        <td>₹${item.price * entry.qty}</td>
        <td><button class="remove" data-id="${item.id}">Remove</button></td>
      `;
      tbody.appendChild(tr);
    });
    // update totals
    document.getElementById('total-count').textContent = this.getCount(customerId);
    document.getElementById('grand-total').textContent = this.getSubtotal(customerId);
    document.getElementById('checkout-btn').disabled = false;
    // attach handlers
    tbody.querySelectorAll('.qty-inc').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id = btn.dataset.id;
        const cartEntry = this.getCart(customerId).find(c=>c.itemId===id);
        const newQty = cartEntry.qty+1;
        const res = this.updateQty(customerId, id, newQty);
        if (!res.ok) alert(res.msg);
        this.renderCart(customerId);
      });
    });
    tbody.querySelectorAll('.qty-dec').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id = btn.dataset.id;
        const cartEntry = this.getCart(customerId).find(c=>c.itemId===id);
        const newQty = cartEntry.qty-1;
        if (newQty<1){
          if (confirm('Remove item from cart?')) {
            this.removeItem(customerId, id);
          }
        } else {
          const res = this.updateQty(customerId, id, newQty);
          if (!res.ok) alert(res.msg);
        }
        this.renderCart(customerId);
      });
    });
    tbody.querySelectorAll('.remove').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id = btn.dataset.id;
        this.removeItem(customerId, id);
        this.renderCart(customerId);
      });
    });
  }
};
window.Cart = Cart;
