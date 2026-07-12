import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';

export default function ProductDetailPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 px-8 text-center flex flex-col justify-center items-center h-full">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl text-primary font-medium animate-pulse">Gathering formula details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 px-8 text-center flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-serif text-primary mb-4">Product Not Found</h1>
        <p className="text-xl text-text-light mb-10">We couldn't find the product you're looking for, or the connection failed.</p>
        <Link to="/products" className="bg-primary text-white text-lg px-8 py-3 rounded-md hover:bg-primary-dim transition-colors inline-block">
          Return to Products
        </Link>
      </div>
    );
  }

  // Safely extract attributes with default clean fallbacks
  const attributes = product.attributes || {};
  const ingredients = attributes.ingredients || [];
  const benefits = attributes.benefits || [];
  const hasAttributes = Object.keys(attributes).length > 0;

  // Star rating helper
  const renderStars = (ratingNum = 0) => {
    const stars = [];
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} className="h-5 w-5 text-amber-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <svg className="h-5 w-5 text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <svg className="h-5 w-5 text-amber-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      } else {
        stars.push(
          <svg key={i} className="h-5 w-5 text-gray-300 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto overflow-hidden">
      <Link to="/products" className="text-text-light hover:text-primary mb-6 md:mb-8 inline-block transition-colors font-medium">
        &larr; Back to Products
      </Link>
      
      {/* Product Summary Grid */}
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16 mt-4">
        {/* Left Side: Product Image */}
        <div className="md:w-1/2 w-full">
          <img 
            src={product.image} 
            alt={product.name} 
            onError={(e) => { e.target.onerror = null; e.target.src="https://picsum.photos/400"; }}
            className="w-full h-auto md:h-[480px] object-cover rounded-xl shadow-md border border-gray-100"
          />
        </div>
        
        {/* Right Side: Product Details */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          {/* Category Badge */}
          <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-2 bg-primary/10 px-3 py-1 rounded-full self-start">
            {product.category}
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-primary mb-3 leading-tight">
            {product.name}
          </h1>

          {/* Rating Summary */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-text-light font-medium">
                {product.rating} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}
          
          {/* Pricing Info */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-semibold text-text">₹{product.price}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-text-light line-through">₹{product.compareAtPrice}</span>
            )}
          </div>
          
          <div className="w-16 h-1 bg-primary/30 mb-6 rounded-full"></div>
          
          {/* Short description or summary */}
          <p className="text-text-light mb-8 leading-relaxed text-base">
            {product.description.split('.')[0]}. {product.description.split('.')[1] || ''}
          </p>

          {/* Low Stock indicator */}
          {product.stock <= 15 && product.stock > 0 && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-lg text-sm mb-6 font-medium inline-flex items-center gap-2 self-start animate-pulse">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Only {product.stock} units remaining in stock!
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-red-50 text-red-800 border border-red-200 px-3.5 py-2 rounded-lg text-sm mb-6 font-medium inline-flex items-center gap-2 self-start">
              Out of Stock
            </div>
          )}
          
          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className={`min-h-[44px] text-white w-full py-4 rounded-lg text-base sm:text-lg font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dim cursor-pointer'}`}
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Tabs Section for Detailed Product Specifications */}
      {hasAttributes && (
        <div className="mt-16 bg-surface border border-gray-100 rounded-xl shadow-xs overflow-hidden">
          {/* Tab Header bar */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${activeTab === 'description' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-light hover:text-text'}`}
            >
              Description & Usage
            </button>
            {ingredients.length > 0 && (
              <button 
                onClick={() => setActiveTab('ingredients')}
                className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${activeTab === 'ingredients' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-light hover:text-text'}`}
              >
                Ingredients
              </button>
            )}
            {benefits.length > 0 && (
              <button 
                onClick={() => setActiveTab('benefits')}
                className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${activeTab === 'benefits' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-light hover:text-text'}`}
              >
                Benefits
              </button>
            )}
            <button 
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${activeTab === 'specs' ? 'border-primary text-primary bg-white' : 'border-transparent text-text-light hover:text-text'}`}
            >
              Specifications
            </button>
          </div>

          {/* Tab Body Contents */}
          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif text-primary mb-2.5">About this product</h3>
                  <p className="text-text-light leading-relaxed">{product.description}</p>
                </div>
                {attributes.howToUse && (
                  <div>
                    <h3 className="text-lg font-serif text-primary mb-2.5">How to Use</h3>
                    <p className="text-text-light leading-relaxed bg-bg p-4 rounded-lg border border-gray-100 italic">{attributes.howToUse}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="text-lg font-serif text-primary mb-4">Key Formulation Ingredients</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text-light">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'benefits' && (
              <div>
                <h3 className="text-lg font-serif text-primary mb-4">Core Health Benefits</h3>
                <ul className="space-y-3 text-text-light">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Net Weight / Volume</span>
                  <span className="font-semibold text-text">{attributes.weight || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Product Dimensions</span>
                  <span className="font-semibold text-text">{attributes.dimensions || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Brand Partner</span>
                  <span className="font-semibold text-text">{attributes.brand || 'AyuraBlend'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Country of Origin</span>
                  <span className="font-semibold text-text">{attributes.origin || 'India'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Category Segment</span>
                  <span className="font-semibold text-text">{product.category}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-text-light font-medium">Stock Status</span>
                  <span className="font-semibold text-text">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
