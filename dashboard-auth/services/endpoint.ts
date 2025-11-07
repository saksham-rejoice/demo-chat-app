let apiEndpoints = {
  auth: {
    login: "http://localhost:5000/api/auth/login",
    register: "http://localhost:5000/api/auth/register",
  },
  product:{
    list: "http://localhost:5000/api/products",
    details: "http://localhost:5000/api/products",
  },
  cart:{
    addItem: "http://localhost:5000/api/cart/create",
    removeItem: "http://localhost:5000/api/cart/remove",
    viewCart: "http://localhost:5000/api/cart/list",
    updateCart: "http://localhost:5000/api/cart/update",
    clearCart: "http://localhost:5000/api/cart/clear",
  }
};

export default apiEndpoints;
