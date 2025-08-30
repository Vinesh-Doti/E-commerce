import React, { createContext, useEffect, useState } from 'react';
import { getImageUrl } from '../utils/getImageUrl';


// Create context
export const ShopContext = createContext(null);

// Default cart with all item counts set to 0
const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index <= 300; index++) {
        cart[index] = 0;
    }
    return cart;
};

// Backend URL
const BACKEND_URL = 'https://e-commerce-backend-plor.onrender.com';

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Fetch products and cart
    useEffect(() => {
        // Fetch all products
        fetch(`${BACKEND_URL}/allproducts`)
            .then((res) => res.json())
            .then((data) => {
                // ✅ Use utility for product image
                const productsWithURL = data.map((product) => ({
                    ...product,
                    image: getImageUrl(product.image),
                }));
                setAll_Product(productsWithURL);
            })
            .catch((err) => console.error('Error fetching products:', err));

        // Fetch user's cart if logged in
        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch(`${BACKEND_URL}/getcart`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((data) => setCartItems(data.cartData || getDefaultCart()))
                .catch((err) => console.error('Error fetching cart:', err));
        }
    }, []);

    // Add to cart
    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch(`${BACKEND_URL}/addtocart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId.toString() }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setCartItems(data.cartData);
                })
                .catch((err) => console.error('Error adding to cart:', err));
        }
    };

    // Remove from cart
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));

        const token = localStorage.getItem('auth-token');
        if (token) {
            fetch(`${BACKEND_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId.toString() }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setCartItems(data.cartData);
                })
                .catch((err) => console.error('Error removing from cart:', err));
        }
    };

    // Total cart amount
    const getTotalCartAmount = () => {
        let total = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const product = all_product.find((p) => p.id === Number(item));
                if (product) total += product.new_price * cartItems[item];
            }
        }
        return total;
    };

    // Total cart items
    const getTotalCartItems = () => {
        let total = 0;
        for (const item in cartItems) {
            total += cartItems[item] || 0;
        }
        return total;
    };

    // Context value
    const contextValue = {
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
