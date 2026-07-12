import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, addToCart }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-text-light">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
}
