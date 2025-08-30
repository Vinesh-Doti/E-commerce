import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';

// Use your deployed backend URL
const BACKEND_URL = 'https://e-commerce-backend-plor.onrender.com';

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/popularinwomen`)
      .then((response) => response.json())
      .then((data) => setPopularProducts(data))
      .catch((error) => console.error('Error fetching popular products:', error));
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className='popular-item'>
        {popularProducts.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image} // should already be full URL from backend
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
