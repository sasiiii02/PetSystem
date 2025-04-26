import { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from '../config';

export const ShopContext = createContext();

export const ShopProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const validateCartData = (cartData) => {
    const validCart = {};
    for (const itemId in cartData) {
      if (typeof cartData[itemId] === 'object') {
        validCart[itemId] = {};
        for (const size in cartData[itemId]) {
          const quantity = Number(cartData[itemId][size]);
          if (!isNaN(quantity) && quantity > 0) {
            validCart[itemId][size] = quantity;
          }
        }
        if (Object.keys(validCart[itemId]).length === 0) {
          delete validCart[itemId];
        }
      }
    }
    return validCart;
  };

  const updateCartItems = (newCartItems) => {
    const validCart = validateCartData(newCartItems);
    setCartItems(validCart);
    localStorage.setItem('cartItems', JSON.stringify(validCart));
  };

  const getCartCount = () => {
    let totalCount = 0;
    const validCart = validateCartData(cartItems);
    for (const itemId in validCart) {
      for (const size in validCart[itemId]) {
        totalCount += validCart[itemId][size];
      }
    }
    return totalCount;
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    let cartData = { ...cartItems };
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    updateCartItems(cartData);
    toast.success("Added to cart");

    if (token && !isOffline) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/cart/add`,
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          await syncCart();
        }
      } catch (error) {
        console.error("Add to cart error:", error.response?.data || error);
        if (!isOffline) {
          setIsOffline(true);
        }
      }
    }
  };

  const removeFromCart = async (itemId, size) => {
    let cartData = { ...cartItems };
    if (cartData[itemId]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
      updateCartItems(cartData);
      toast.success("Removed from cart");

      if (token && !isOffline) {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/api/cart/remove`,
            { itemId, size },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (response.data.success) {
            await syncCart();
          }
        } catch (error) {
          console.error("Remove from cart error:", error.response?.data || error);
          if (!isOffline) {
            setIsOffline(true);
          }
        }
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = { ...cartItems };
    if (!cartData[itemId]) cartData[itemId] = {};

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    updateCartItems(cartData);

    if (token && !isOffline) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/cart/update`,
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          await syncCart();
        }
      } catch (error) {
        console.error("Update cart error:", error.response?.data || error);
        if (!isOffline) {
          setIsOffline(true);
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => String(product._id) === String(items));
      if (!itemInfo) continue;
      for (const size in cartItems[items]) {
        if (cartItems[items][size] > 0) totalAmount += cartItems[items][size] * itemInfo.price;
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      if (response.status === 200) {
        setProducts(response.data);
        setIsOffline(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error);
      setIsOffline(true);
      // Load sample products if in offline mode
      setProducts([
        {
          _id: '1',
          name: 'Sample Dog Food',
          description: 'High-quality dog food for all breeds',
          price: 29.99,
          originalPrice: 39.99,
          category: 'Dog',
          subCategory: 'Food',
          inStock: 10,
          rating: 4.5,
          sold: 50,
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRvZyBGb29kPC90ZXh0Pjwvc3ZnPg=='
        },
        {
          _id: '2',
          name: 'Cat Litter Box',
          description: 'Spacious and easy to clean litter box',
          price: 19.99,
          category: 'Cat',
          subCategory: 'Other',
          inStock: 15,
          rating: 4.0,
          sold: 30,
          image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdHRlciBCb3g8L3RleHQ+PC9zdmnPg=='
        }
      ]);
    }
  };

  const syncCart = async () => {
    if (!token || isOffline) return;
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        const validCart = validateCartData(response.data.cartData || {});
        updateCartItems(validCart);
        setIsOffline(false);
      }
    } catch (error) {
      console.error("Cart sync error:", error.response?.data || error);
      if (!isOffline) {
        setIsOffline(true);
      }
    }
  };

  useEffect(() => {
    const initializeCart = async () => {
      if (token && !isOffline) {
        await syncCart();
      } else {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            const validCart = validateCartData(parsedCart);
            updateCartItems(validCart);
          } catch (error) {
            console.error("Error parsing cart from localStorage:", error);
            localStorage.removeItem("cartItems");
            setCartItems({});
          }
        }
      }
    };
    initializeCart();
  }, [token, isOffline]);

  useEffect(() => {
    getProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    backendUrl: BACKEND_URL,
    token,
    setToken,
    userData,
    isOffline
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};