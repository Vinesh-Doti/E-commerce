import React, { useState, useEffect } from 'react';
import './NewCollections.css';
import Item from '../Item/Item';

// Use your deployed backend URL
const BACKEND_URL = 'https://e-commerce-backend-plor.onrender.com';

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/newcollections`)
      .then((response) => response.json())
      .then((data) => setNewCollection(data))
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
            image={item.image} // if backend returns only filename, prepend BACKEND_URL
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;

