// import React,{createContext,useEffect,useState} from 'react';

// export const ShopContext=createContext(null);

// const getDefaultCart=()=>{
//     let cart={};
//     for(let index=0;index<300+1;index++)
//     {
//         cart[index]=0;
//     }
//     return cart;
// }
// const ShopContextProvider=(props)=>{
//     const [all_product,setAll_Product]=useState([]);
//     const [cartItems,setCartItems]=useState(getDefaultCart());

//     useEffect(()=>{
//         fetch('http://localhost:4000/allproducts')
//          .then((response)=>response.json())
//          .then((data)=>setAll_Product(data))
//     },[])

//     const addToCart=(itemId)=>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
//         if(localStorage.getItem('auth-token')){
//             fetch('http://localhost:4000/addtocart',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/form-data',
//                     'auth-token':`${localStorage.getItem('auth-token')}`,
//                     'Content-Type':'application/json',
//                 },
//                 body:JSON.stringify({"itemId":itemId}),
//             })
//             .then((response)=>response.json())
//             .then((data)=>console.log(data));
//         }
//     }
//     const removeFromCart=(itemId)=>{
//         setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
//         if(localStorage.getItem('auth-token')){
//             fetch('http://localhost:4000/removefromcart',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application/form-data',
//                     'auth-token':`${localStorage.getItem('auth-token')}`,
//                     'Content-Type':'application/json',
//                 },
//                 body:JSON.stringify({"itemId":itemId}),
//             })
//             .then((response)=>response.json())
//             .then((data)=>console.log(data));
//         }
//     }
//     const getTotalCartAmount=()=>{
//         let totalAmount=0;
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 let itemInfo=all_product.find((product)=>product.id===Number(item));
//                 totalAmount+=itemInfo.new_price*cartItems[item]
              
//             }
//         }
//         return totalAmount;
//     }

//     const getTotalCartItems=()=>{
//         let totalItem=0;
//         for(const item in cartItems)
//         {
//             if(cartItems[item]>0)
//             {
//                 totalItem+=cartItems[item];
//             }
//         }
//         return totalItem;
//     }

//     const contextValue={getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
//     return (
//         <ShopContext.Provider value={contextValue}>
//             {props.children}
//         </ShopContext.Provider>
//     )
// }
// export default ShopContextProvider;

import React, { createContext, useEffect, useState } from 'react';

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

const ShopContextProvider = (props) => {
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    // Fetch products
    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
            .then((response) => response.json())
            .then((data) => setAll_Product(data));

        // Fetch cart if user is logged in
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data.cartData || getDefaultCart()))
                .catch((error) => console.error('Error fetching cart:', error));
        }
    }, []);

    const addToCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId.toString() }),
            })
                .then((response) => {
                    console.log("AddToCart - Response status:", response.status);
                    console.log("AddToCart - Response headers:", [...response.headers.entries()]);
                    return response.json().catch((err) => {
                        throw new Error(`JSON parsing error: ${err.message}`);
                    });
                })
                .then((data) => {
                    console.log("AddToCart - Response data:", data);
                    if (data.success) {
                        setCartItems(data.cartData); // Sync with backend
                        console.log("Cart updated successfully:", data.cartData);
                    } else {
                        console.error('Error adding to cart:', data.error);
                        alert('Failed to add to cart: ' + data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error in addToCart:', error.message);
                    alert('Error adding to cart: ' + error.message);
                });
        }
    };
    
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0), // Prevent negative quantities
        }));
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId.toString() }),
            })
                .then((response) => {
                    console.log("RemoveFromCart - Response status:", response.status);
                    console.log("RemoveFromCart - Response headers:", [...response.headers.entries()]);
                    return response.json().catch((err) => {
                        throw new Error(`JSON parsing error: ${err.message}`);
                    });
                })
                .then((data) => {
                    console.log("RemoveFromCart - Response data:", data);
                    if (data.success) {
                        setCartItems(data.cartData); // Sync with backend
                        console.log("Cart updated successfully:", data.cartData);
                    } else {
                        console.error('Error removing from cart:', data.error);
                        alert('Failed to remove from cart: ' + data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error in removeFromCart:', error.message);
                    alert('Error removing from cart: ' + error.message);
                });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    const contextValue = { getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
