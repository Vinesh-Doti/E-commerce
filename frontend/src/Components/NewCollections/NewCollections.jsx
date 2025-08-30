import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';
import { getImageUrl } from '../../../../utils/getImageUrl'; // ✅ import utility

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch('https://e-commerce-backend-plor.onrender.com/newcollections')
      .then((response) => response.json())
      .then((data) => {
        // ✅ convert image filenames to full URLs
        const productsWithURL = data.map((product) => ({
          ...product,
          image: getImageUrl(product.image),
        }));
        setNewCollection(productsWithURL);
      })
      .catch((error) => console.error('Error fetching new collections:', error));
  }, []);

  return (
    <div className='newcollections'>
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newCollection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image} // ✅ now full URL
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
