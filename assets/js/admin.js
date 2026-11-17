// admin.js – admin dashboard and management UI
const Admin = {
  // Dashboard statistics
  renderDashboard: function(){
    const statsContainer = document.getElementById('stats');
    if(!statsContainer) return;
    const data = Storage.getData();
    const totalFood = data.menu.length;
    const totalCustomers = data.customers.length;
    const totalOrders = data.orders.length;
    const activeOrders = data.orders.filter(o=> o.status!=='Delivered' && o.status!=='Cancelled').length;
    const totalSales = data.orders.filter(o=> o.status!=='Cancelled').reduce((sum,o)=>sum+o.total,0);
    const recent = data.orders.slice(-3).reverse(); // last 3
    let html = `
      <div class="stat-card"><strong>Total Food Items:</strong> ${totalFood}</div>
      <div class="stat-card"><strong>Total Customers:</strong> ${totalCustomers}</div>
      <div class="stat-card"><strong>Total Orders:</strong> ${totalOrders}</div>
      <div class="stat-card"><strong>Active Orders:</strong> ${activeOrders}</div>
      <div class="stat-card"><strong>Total Sales:</strong> ₹${totalSales}</div>
      <div class="stat-card"><strong>Recent Orders:</strong></div>
    `;
    recent.forEach(o=>{
      html += `<div class="order-card">
        <p>Order ID: ${o.orderId} | Customer: ${o.customerId} | Amount: ₹${o.total} | Status: ${o.status}</p>
      </div>`;
    });
    statsContainer.innerHTML = html;
  },

  // Menu Management page
  renderMenuManagement: function(){
    const container = document.getElementById('menu-mgmt');
    if(!container) return;
    const menu = Storage.getMenu();
    // Form for adding/updating
    let html = `<h2>Food Items</h2>
      <table class="table" id="menu-table">
        <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Image URL</th><th>Actions</th></tr></thead>
        <tbody></tbody>
      </table>
      <h3>Add / Edit Item</h3>
      <div class="form-section" id="item-form">
        <label>ID:</label><input type="text" id="fid" />
        <label>Name:</label><input type="text" id="fname" />
        <label>Category:</label><input type="text" id="fcat" />
        <label>Price:</label><input type="number" id="fprice" />
        <label>Stock:</label><input type="number" id="fstock" />
        <label>Image URL:</label><input type="text" id="fimg" />
        <button id="save-item" class="btn primary">Save</button>
        <button id="clear-form" class="btn secondary">Clear</button>
      </div>`;
    container.innerHTML = html;
    const tbody = document.querySelector('#menu-table tbody');
    const renderRows = () => {
      tbody.innerHTML='';
      Storage.getMenu().forEach(item=>{
        const tr=document.createElement('tr');
        tr.innerHTML = `<td>${item.id}</td><td>${item.name}</td><td>${item.category}</td><td>₹${item.price}</td><td>${item.stock}</td><td><a href="${item.img}" target="_blank">Link</a></td>
          <td>
            <button class="btn small edit-item" data-id="${item.id}">Edit</button>
            <button class="btn small delete-item" data-id="${item.id}">Delete</button>
          </td>`;
        tbody.appendChild(tr);
      });
    };
    renderRows();
    // Save (add or update)
    document.getElementById('save-item').addEventListener('click',()=>{
      const id=document.getElementById('fid').value.trim();
      const name=document.getElementById('fname').value.trim();
      const cat=document.getElementById('fcat').value.trim();
      const price=parseFloat(document.getElementById('fprice').value);
      const stock=parseInt(document.getElementById('fstock').value);
      const img=document.getElementById('fimg').value.trim()||'https://via.placeholder.com/200?text=No+Image';
      if(!id||!name||!cat||isNaN(price)||isNaN(stock)) {alert('All fields required');return;}
      if(price<=0){alert('Price must be >0');return;}
      if(stock<0){alert('Stock cannot be negative');return;}
      let menu = Storage.getMenu();
      const existing = menu.find(i=>i.id===id);
      if(existing){
        // update
        existing.name=name; existing.category=cat; existing.price=price; existing.stock=stock; existing.img=img;
      } else {
        // add new – ensure unique ID
        if(menu.some(i=>i.id===id)){alert('Food ID must be unique');return;}
        menu.push({id,name,category:cat,price,stock,img});
      }
      Storage.setMenu(menu);
      renderRows();
      alert('Saved');
      clearForm();
    });
    const clearForm =()=>{document.getElementById('fid').value='';document.getElementById('fname').value='';document.getElementById('fcat').value='';document.getElementById('fprice').value='';document.getElementById('fstock').value='';document.getElementById('fimg').value='';};
    document.getElementById('clear-form').addEventListener('click',clearForm);
    // Edit handler
    tbody.addEventListener('click',e=>{
      if(e.target.classList.contains('edit-item')){
        const id=e.target.dataset.id;
        const item=Storage.getMenu().find(i=>i.id===id);
        if(item){
          document.getElementById('fid').value=item.id;
          document.getElementById('fname').value=item.name;
          document.getElementById('fcat').value=item.category;
          document.getElementById('fprice').value=item.price;
          document.getElementById('fstock').value=item.stock;
          document.getElementById('fimg').value=item.img;
        }
      }
      if(e.target.classList.contains('delete-item')){
        const id=e.target.dataset.id;
        // prevent deletion if item in active orders
        const active = Storage.getOrders().some(o=> o.status!=='Cancelled' && o.items.some(it=> it.itemId===id));
        if(active){alert('Cannot delete item that is part of active orders');return;}
        if(confirm('Delete this item?')){
          const newMenu=Storage.getMenu().filter(i=>i.id!==id);
          Storage.setMenu(newMenu);
          renderRows();
        }
      }
    });
  },

  // Customer Management page
  renderCustomerManagement: function(){
    const container=document.getElementById('customer-mgmt');
    if(!container) return;
    const customers=Storage.getCustomers();
    const orders=Storage.getOrders();
    let html='<h2>Customers</h2><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Orders</th></tr></thead><tbody>';
    customers.forEach(c=>{
      const count=orders.filter(o=>o.customerId===c.id).length;
      html+=`<tr><td>${c.id}</td><td>${c.name}</td><td>${count}</td></tr>`;
    });
    html+='</tbody></table>';
    container.innerHTML=html;
  },

  // Order Management page
  renderOrderManagement: function(){
    const container=document.getElementById('order-mgmt');
    if(!container) return;
    const orders=Storage.getOrders();
    let html='<h2>All Orders</h2><table class="table"><thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>';
    orders.forEach(o=>{
      const nextStatus = this.nextStatus(o.status);
      const canAdvance = nextStatus && o.status!=='Delivered' && o.status!=='Cancelled';
      html+=`<tr data-id="${o.orderId}"><td>${o.orderId}</td><td>${o.customerId}</td><td>₹${o.total}</td><td class="status">${o.status}</td><td>`;
      if(canAdvance){
        html+=`<button class="btn small advance-status" data-next="${nextStatus}">Set ${nextStatus}</button>`;
      } else {
        html+='-';
      }
      html+='</td></tr>';
    });
    html+='</tbody></table>';
    container.innerHTML=html;
    // handler
    container.addEventListener('click',e=>{
      if(e.target.classList.contains('advance-status')){
        const row=e.target.closest('tr');
        const orderId=parseInt(row.dataset.id);
        const ordersAll=Storage.getOrders();
        const order=ordersAll.find(o=>o.orderId===orderId);
        const newStatus=e.target.dataset.next;
        if(order && newStatus){
          order.status=newStatus;
          Storage.setOrders(ordersAll);
          // re-render
          this.renderOrderManagement();
        }
      }
    });
  },

  // Helper to compute next status following flow
  nextStatus: function(current){
    const flow=['Placed','Preparing','Out for delivery','Delivered'];
    const idx=flow.indexOf(current);
    if(idx===-1 || idx===flow.length-1) return null;
    return flow[idx+1];
  },

  // Reports page
  renderReports: function(){
    const container=document.getElementById('reports');
    if(!container) return;
    const data=Storage.getData();
    const totalMenu=data.menu.length;
    const totalCustomers=data.customers.length;
    const totalOrders=data.orders.length;
    const activeOrders=data.orders.filter(o=> o.status!=='Delivered' && o.status!=='Cancelled').length;
    const deliveredOrders=data.orders.filter(o=> o.status==='Delivered').length;
    const cancelledOrders=data.orders.filter(o=> o.status==='Cancelled').length;
    const totalSales=data.orders.filter(o=> o.status!=='Cancelled').reduce((s,o)=>s+o.total,0);
    const recent=data.orders.slice(-5).reverse();
    let html=`<h2>Reports</h2>
      <ul>
        <li>Total menu items: ${totalMenu}</li>
        <li>Total customers: ${totalCustomers}</li>
        <li>Total orders: ${totalOrders}</li>
        <li>Active orders: ${activeOrders}</li>
        <li>Delivered orders: ${deliveredOrders}</li>
        <li>Cancelled orders: ${cancelledOrders}</li>
        <li>Total sales (excl. cancelled): ₹${totalSales}</li>
      </ul>
      <h3>Recent Transactions</h3>
      <table class="table"><thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>`;
    recent.forEach(o=>{html+=`<tr><td>${o.orderId}</td><td>${o.customerId}</td><td>₹${o.total}</td><td>${o.status}</td></tr>`;});
    html+='</tbody></table>';
    container.innerHTML=html;
  }
};
window.Admin = Admin;
