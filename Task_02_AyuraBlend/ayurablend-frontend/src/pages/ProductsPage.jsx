import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import { getAllProducts } from '../services/productService';

const CATEGORIES = [
  'Essential Oils',
  'Aromatherapy',
  'Skincare',
  'Supplements',
  'Bundles'
];

export default function ProductsPage({ addToCart }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  
  // Mobile filter drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    // 400ms Debounce for text inputs (search and price range) to prevent API spamming
    const delayDebounceFn = setTimeout(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const params = {};
          if (search.trim()) params.search = search.trim();
          if (category) params.category = category;
          if (sort) params.sort = sort;
          if (minPrice) params.minPrice = minPrice;
          if (maxPrice) params.maxPrice = maxPrice;

          const data = await getAllProducts(params);
          setProductList(data);
          setLoading(false);
          setError(false);
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      };

      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort, minPrice, maxPrice]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  const SidebarContent = () => (
    <div className="flex flex-col gap-8">
      {/* Search Input */}
      <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Search Products</h3>
        <div className="relative">
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type search terms..."
            className="w-full border border-gray-300 rounded-lg p-2.5 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all text-text"
          />
          <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category List */}
      <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Category</h3>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-text font-medium">
            <input 
              type="radio" 
              name="category"
              checked={category === ''}
              onChange={() => setCategory('')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded-full"
            />
            All Categories
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-text-light hover:text-primary transition-colors font-medium">
              <input 
                type="radio" 
                name="category"
                checked={category === cat}
                onChange={() => setCategory(cat)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded-full"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm text-center text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <button 
        onClick={handleClearFilters}
        className="w-full border border-gray-300 text-text hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Our Collection</h1>
        <p className="text-text-light text-base md:text-lg">Explore pure extracts, wellness sets, and traditional remedies engineered to create equilibrium in your mind and body.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        {/* Desktop Sidebar (visible on LG screens and up) */}
        <aside className="hidden lg:block lg:w-1/4 shrink-0 bg-surface p-6 rounded-xl border border-gray-100 shadow-sm self-start">
          <SidebarContent />
        </aside>

        {/* Products Grid Content Area */}
        <div className="flex-grow">
          {/* Controls Bar */}
          <div className="flex justify-between items-center mb-6 bg-surface p-4 rounded-xl border border-gray-100 shadow-sm">
            <span className="text-sm text-text-light font-medium">
              Showing <span className="font-semibold text-text">{productList.length}</span> {productList.length === 1 ? 'product' : 'products'}
            </span>
            
            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger */}
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 border border-gray-300 px-3.5 py-2 rounded-lg text-sm font-medium text-text bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-text-light uppercase tracking-wider font-semibold">Sort By:</span>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text font-medium"
                >
                  <option value="newest">Newest Arrival</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Cards List */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-28 bg-surface rounded-xl border border-gray-50 shadow-sm">
               <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <div className="text-primary font-medium text-base tracking-wide animate-pulse">Filtering remedies...</div>
             </div>
          ) : error ? (
             <div className="flex items-center justify-center py-20 bg-surface rounded-xl border border-gray-50 shadow-sm">
               <div className="bg-red-50 border border-red-100 text-red-700 px-8 py-6 rounded-xl text-center max-w-md flex flex-col items-center">
                 <svg className="w-8 h-8 mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span className="font-semibold text-base mb-1">Connection Refused</span>
                 <p className="text-xs opacity-90">We're unable to fetch products from our database. Check backend connection.</p>
               </div>
             </div>
          ) : (
             <ProductList products={productList} addToCart={addToCart} />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop shadow */}
          <div 
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          ></div>
          
          {/* Drawer content */}
          <div className="relative flex flex-col w-80 max-w-full bg-white h-full p-6 shadow-xl z-10 transition-transform duration-300 ease-out translate-x-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-primary">Filters</h2>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-gray-400 hover:text-text p-1 cursor-pointer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-1">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
