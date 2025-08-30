import React, { useEffect, useState } from 'react';
import './Popular.css';
import Item from '../Item/Item';
import { getImageUrl } from '../../utils/getImageUrl'; // ✅ import utility

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch('https://e-commerce-backend-plor.onrender.com/popularinwomen')
      .then((response) => response.json())
      .then((data) => {
        // ✅ convert image filenames to full URLs
        const productsWithURL = data.map((product) => ({
          ...product,
          image: getImageUrl(product.image),
        }));
        setPopularProducts(productsWithURL);
      })
      .catch((error) => console.error('Error fetching popular products:', error));
  }, []);

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className='popular-item'>
        {popularProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image} // ✅ already full URL
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
