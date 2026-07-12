import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import { getAllProducts } from '../services/productService';

export default function HomePage({ addToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts({ featured: true });
        setFeaturedProducts(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div>
      <section className="bg-bg py-24 px-8 text-center flex flex-col justify-center items-center">
        <h1 className="text-5xl md:text-7xl font-serif text-primary mb-6">AyuraBlend</h1>
        <p className="text-xl md:text-2xl text-text-light max-w-2xl mx-auto mb-10">Mindful living, naturally curated.</p>
        <Link to="/products" className="bg-primary text-white text-lg px-8 py-3 rounded-md hover:bg-primary-dim transition-colors inline-block">
          Shop the Collection
        </Link>
      </section>

      <section className="py-16 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-primary mb-10 text-center">Featured Products</h2>
        
        {loading ? (
          <p className="text-center text-text-light">Loading top picks...</p>
        ) : error ? (
           <p className="text-center text-red-500 font-medium">Unable to load featured products. Please check connection.</p>
        ) : (
          <ProductList products={featuredProducts} addToCart={addToCart} />
        )}
        
        <div className="text-center mt-12">
          <Link to="/products" className="text-primary font-medium hover:text-primary-dim border-b border-primary pb-1 transition-colors">
            View All Products &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
