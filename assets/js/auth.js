// auth.js – handles login, registration helpers
// Uses Storage.Session (sessionStorage) to keep current user
const Auth = {
  loginCustomer: function(id){
    const cust = Storage.getCustomerById(id);
    if (cust) {
      Storage.Session.setCurrentUser({type:'customer', id: cust.id});
      return true;
    }
    return false;
  },
  logout: function(){
    Storage.Session.clear();
  },
  getCurrentUser: function(){
    return Storage.Session.getCurrentUser();
  }
};
window.Auth = Auth;
