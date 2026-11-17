// orders.js – functions for order handling (customer view)
// Provides utility to fetch orders for current customer and render them.
const Orders = {
  // get all orders for a specific customer ID
  getCustomerOrders: function(customerId){
    return Storage.getOrders().filter(o=>o.customerId===customerId);
  },
  // render order list in a given container element (used by my-orders.html)
  renderCustomerOrders: function(containerId){
    const user = Session.getCurrentUser();
    if (!user) return;
    const orders = this.getCustomerOrders(user.id);
    const container = document.getElementById(containerId);
    if (!container) return;
    if (orders.length===0){
      container.innerHTML = '<p>No orders yet.</p>';
      return;
    }
    let html='';
    orders.forEach(o=>{
      html+=`<div class="order-card">
        <h4>Order ID: ${o.orderId}</h4>
        <p>Date: ${new Date(o.date).toLocaleString()}</p>
        <p>Status: ${o.status}</p>
        <p>Total: ₹${o.total}</p>
        <button class="btn small view-details" data-id="${o.orderId}">View Details</button>
        ${ o.status==='Placed' ? '<button class="btn small cancel-order" data-id="'+o.orderId+'">Cancel</button>' : '' }
      </div>`;
    });
    container.innerHTML = html;
    // attach listeners for view details
    container.querySelectorAll('.view-details').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id = btn.dataset.id;
        window.location.href = `order-detail.html?orderId=${id}`;
      });
    });
    // cancel order
    container.querySelectorAll('.cancel-order').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const id = btn.dataset.id;
        if(confirm('Cancel this order?')){
          // Find order
          const ordersAll = Storage.getOrders();
          const order = ordersAll.find(o=>o.orderId===parseInt(id));
          if(order && order.status==='Placed'){
            order.status='Cancelled';
            // restore stock
            const menu = Storage.getMenu();
            order.items.forEach(it=>{
              const menuItem = menu.find(m=>m.id===it.itemId);
              if(menuItem){ menuItem.stock += it.qty; }
            });
            Storage.setMenu(menu);
            Storage.setOrders(ordersAll);
            alert('Order cancelled');
            // re-render
            Orders.renderCustomerOrders(containerId);
          }
        }
      });
    });
  }
};
window.Orders = Orders;
