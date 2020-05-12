import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.clear();
      const loadedProducts = await AsyncStorage.getItem(
        '@GoMarketPlace:products',
      );

      if (loadedProducts) {
        setProducts(JSON.parse(loadedProducts));
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const newProducts = [...products];
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex > -1) {
        newProducts[productIndex].quantity += 1;
        setProducts(newProducts);
      }
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const newProducts = [...products];
      const productIndex = products.findIndex(p => p.id === id);

      if (productIndex > -1) {
        if (newProducts[productIndex].quantity === 1) {
          newProducts.splice(productIndex, 1);
        } else {
          newProducts[productIndex].quantity -= 1;
        }

        setProducts(newProducts);
      }
      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify(newProducts),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const productIndex = products.find(item => item.id === product.id);

      // If found a product
      if (productIndex) {
        increment(productIndex.id);
        return;
      }

      // If didn't find a product
      setProducts(oldState => [...oldState, { ...product, quantity: 1 }]);

      await AsyncStorage.setItem(
        '@GoMarketPlace:products',
        JSON.stringify([...products, { ...product, quantity: 1 }]),
      );
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
