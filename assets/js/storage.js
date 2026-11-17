// storage.js – wrapper for localStorage
// Key: ofs-v1
const STORAGE_KEY = 'ofs-v1';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load storage', e);
    // Corrupted data – reset
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save storage', e);
  }
}

function initSampleData() {
  let data = loadData();
  // Initialize if no data or missing core arrays
  if (!data || !Array.isArray(data.menu) || data.menu.length === 0) {
    const menu = [
      {id:'101',name:'Veg Burger',category:'Fast Food',price:120,stock:10,img:'https://via.placeholder.com/200?text=Veg+Burger'},
      {id:'102',name:'Paneer Pizza',category:'Pizza',price:250,stock:3,img:'https://via.placeholder.com/200?text=Paneer+Pizza'},
      {id:'103',name:'Chicken Biryani',category:'Biryani',price:180,stock:10,img:'https://via.placeholder.com/200?text=Chicken+Biryani'},
      {id:'104',name:'Veg Fried Rice',category:'Rice',price:140,stock:10,img:'https://via.placeholder.com/200?text=Veg+Fried+Rice'},
      {id:'105',name:'Masala Dosa',category:'South Indian',price:80,stock:10,img:'https://via.placeholder.com/200?text=Masala+Dosa'},
      {id:'106',name:'Cold Coffee',category:'Beverages',price:80,stock:10,img:'https://via.placeholder.com/200?text=Cold+Coffee'},
      {id:'107',name:'French Fries',category:'Fast Food',price:90,stock:10,img:'https://via.placeholder.com/200?text=French+Fries'},
      {id:'108',name:'Paneer Sandwich',category:'Snacks',price:110,stock:10,img:'https://via.placeholder.com/200?text=Paneer+Sandwich'}
    ];
    const customers = [
      {id:'501',name:'Prasanna M'}
    ];
    const dataObj = {
      menu,
      customers,
      orders: [],
      nextOrderId: 1,
      carts: {}
    };
    saveData(dataObj);
    data = dataObj; // ensure subsequent code sees the initialized data
  }
  // Ensure customers array exists for later operations
  if (!data || !Array.isArray(data.customers)) {
    data = data || {};
    data.customers = [{id:'501',name:'Prasanna M'}];
    saveData(data);
  }
}

// Ensure data exists on load of any script
initSampleData();

const Storage = {
  getData: loadData,
  saveData: saveData,
  // Menu
  getMenu: function(){ const d = loadData(); return d && Array.isArray(d.menu) ? d.menu : []; },
  setMenu: function(menu){ const d = loadData() || {}; d.menu = menu; saveData(d); },
  // Customers
  getCustomers: function(){ const d = loadData(); return d && Array.isArray(d.customers) ? d.customers : []; },
  setCustomers: function(customers){ const d = loadData() || {}; d.customers = customers; saveData(d); },
  getCustomerById: function(id){ return this.getCustomers().find(c=>c.id===id); },
  // Orders
  getOrders: function(){ return loadData().orders; },
  setOrders: function(orders){ const d = loadData(); d.orders = orders; saveData(d); },
  getNextOrderId: function(){ return loadData().nextOrderId; },
  incrementOrderId: function(){ const d = loadData(); d.nextOrderId +=1; saveData(d); },
  // Cart per customer
  getCart: function(custId){ const d = loadData(); return d.carts[custId]||[]; },
  setCart: function(custId, cart){ const d = loadData(); d.carts[custId]=cart; saveData(d); },
  // Session helper (simple in-memory, persisted via sessionStorage)
  Session: {
    setCurrentUser: function(user){ sessionStorage.setItem('ofs-current-user', JSON.stringify(user)); },
    getCurrentUser: function(){ const raw = sessionStorage.getItem('ofs-current-user'); return raw?JSON.parse(raw):null; },
    clear: function(){ sessionStorage.removeItem('ofs-current-user'); }
  }
};

// Export globals for other scripts (in browsers they become window properties)
window.Storage = Storage;
window.Session = Storage.Session;
