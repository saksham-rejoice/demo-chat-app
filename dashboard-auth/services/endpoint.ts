let apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
  },
  product:{
    list: "/api/products",
    details: "/api/products",
  },
  cart:{
    addItem: "/api/cart/create",
    removeItem: "/api/cart/remove",
    viewCart: "/api/cart/list",
    updateCart: "/api/cart/update",
    clearCart: "/api/cart/clear",
  },
  instagram: {
    posts: {
      create: "/api/instagram/posts",
      list: "/api/instagram/posts",
      getById: "/api/instagram/posts",
      update: "/api/instagram/posts",
    },
    comments: {
      create: "/api/instagram/comments",
      list: "/api/instagram/comments",
      update: "/api/instagram/comments",
      delete: "/api/instagram/comments",
      reply: "/api/instagram/comments",
    },
    savedPosts: {
      save: "/api/instagram/saved-posts",
      list: "/api/instagram/saved-posts",
      remove: "/api/instagram/saved-posts",
    }
  }
};

export default apiEndpoints;
