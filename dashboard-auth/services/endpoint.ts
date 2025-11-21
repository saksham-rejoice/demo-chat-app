let apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",
    user: "/api/auth/user",
  },
  product: {
    list: "/api/products",
    details: "/api/products",
  },
  cart: {
    addItem: "/api/cart/create",
    removeItem: "/api/cart/remove",
    viewCart: "/api/cart/list",
    updateCart: "/api/cart/update",
    clearCart: "/api/cart/clear",
  },
  instagram: {
    posts: {
      publish: "/api/instagram/posts",
      list: "/api/instagram/posts",
      getById: "/api/instagram/posts",
      update: "/api/instagram/posts",
      upload: "/api/instagram/posts/upload",
      delete: "/api/instagram/posts/delete",
      like: "/api/instagram/posts/like",
      unlike: "/api/instagram/posts/unlike",
      trendingHashtags: "/api/instagram/trending-hashtags",
    },
    follow: {
      toggle: "/api/instagram/followers",
      get: "/api/instagram/followers",
      suggestion: "/api/instagram/suggested/users",
      getFollowing: "/api/instagram/following",
    },
    comments: {
      create: "/api/instagram/comments",
      list: "/api/instagram/comments",
      update: "/api/instagram/comments",
      delete: "/api/instagram/comments",
      reply: "/api/instagram/comments",
    },
    savedPosts: {
      save: "/api/instagram/saved-post",
      list: "/api/instagram/saved-post",
      remove: "/api/instagram/saved-post",
    },
    collection: {
      create: "/api/instagram/collections",
      list: "/api/instagram/collections",
      update: "/api/instagram/collections",
      delete: "/api/instagram/collections",
      getById: "/api/instagram/collections",
    },
  },
};

export default apiEndpoints;
