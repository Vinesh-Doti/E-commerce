import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import { getImageUrl } from '../../utils/getImageUrl'   // ✅ import util
import BASE_URL from '../../utils/getImageUrl'          // ✅ reuse backend url

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/allproducts`);
      const data = await res.json();
      setAllProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_Product = async (id) => {
    try {
      await fetch(`${BASE_URL}/removeproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      await fetchInfo();
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <React.Fragment key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img
                src={getImageUrl(product.image)}   // ✅ clean usage
                alt={product.name}
                className='listproduct-product-icon'
              />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img
                onClick={() => remove_Product(product.id)}
                src={cross_icon}
                alt="remove"
                className='listproduct-remove-icon'
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default ListProduct
