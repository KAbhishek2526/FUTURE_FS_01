import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Cloudinary CDN Asset Links
const logoImg = "https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841313/ayurablend_products/ayur_blend_logo.png";
const spiceImg = "https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841305/ayurablend_products/ayur_moringa_spice.jpg";
const vitalImg = "https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841308/ayurablend_products/ayur_moringa_vital.jpg";
const pureImg = "https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841311/ayurablend_products/ayur_moringa_pure.jpg";

const EXACT_PRODUCTS = [
  {
    id: '60d5ec499b17ac1111111111',
    name: 'Ayur Moringa Spice',
    tagline: 'Traditional Andhra Moringa Spice Powder',
    shortDesc: 'A flavorful spice blend made with moringa and traditional Andhra ingredients. Enjoy it with hot rice, ghee, idli, dosa, chapati, or your favorite South Indian meals.',
    fullDesc: 'Ayura Moringa Spice combines premium moringa with carefully selected traditional spices to create a delicious and versatile condiment. Inspired by authentic Andhra recipes, it brings together taste and natural ingredients in a convenient everyday spice mix.',
    price: 249,
    weight: '100g',
    image: spiceImg,
    highlights: [
      '🌿 Traditional Andhra Recipe',
      '🍚 Perfect with Rice & Ghee',
      '🥥 Great for Idli, Dosa & Chapati',
      '🌱 Made with Natural Ingredients',
      '❤️ Homemade Taste',
      '🇮🇳 Made in India'
    ],
    suggestedUse: 'Sprinkle over hot rice with ghee or serve alongside idli, dosa, chapati, or other meals.'
  },
  {
    id: '60d5ec499b17ac1111111112',
    name: 'Ayur Moringa Vital',
    tagline: 'Moringa + Amla Wellness Blend',
    shortDesc: 'A carefully crafted blend of moringa and amla that combines nutrient-rich moringa with naturally vitamin C-rich amla for a refreshing addition to your daily wellness routine.',
    fullDesc: 'Ayura Moringa Vital brings together two traditional superfoods—moringa and amla—in one convenient blend. Moringa provides a variety of naturally occurring nutrients, while amla is well known as a natural source of vitamin C and antioxidants. Together, they make a wholesome addition to a balanced lifestyle.',
    price: 399,
    weight: '100g',
    image: vitalImg,
    highlights: [
      '🌿 Premium Moringa + Amla Blend',
      '🍋 Naturally Rich in Vitamin C',
      '🛡️ Rich in Natural Antioxidants',
      '💚 Supports Everyday Wellness',
      '🌱 No Artificial Preservatives',
      '🇮🇳 Made in India'
    ],
    suggestedUse: 'Mix one teaspoon with warm water or your preferred beverage every morning.'
  },
  {
    id: '60d5ec499b17ac1111111113',
    name: 'Ayur Moringa Pure',
    tagline: '100% Pure Moringa Leaf Powder',
    shortDesc: 'Premium-quality moringa leaf powder made from carefully selected leaves. Naturally rich in vitamins, minerals, antioxidants, and plant-based nutrients, it is an easy way to add natural nutrition to your daily routine.',
    fullDesc: 'Ayura Moringa Pure is made from carefully harvested moringa leaves that are cleaned, naturally dried, and finely ground to preserve their natural goodness. Moringa has long been valued as a nutrient-rich superfood. Add one teaspoon to warm water, smoothies, juices, or your favorite recipes to conveniently include moringa in your everyday lifestyle.',
    price: 349,
    weight: '250g',
    image: pureImg,
    highlights: [
      '🌿 100% Pure Moringa Leaf Powder',
      '🌱 No Artificial Colors or Preservatives',
      '💚 Naturally Rich in Vitamins & Minerals',
      '🛡️ Rich Source of Antioxidants',
      '🌾 Vegetarian & Natural',
      '🇮🇳 Made in India'
    ],
    suggestedUse: 'Mix 1 teaspoon with warm water, smoothies, soups, or juices. Can also be added to everyday cooking.'
  }
];

export default function Storefront({ addToCart, cartCount }) {
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    setAddingId(product.id);
    setTimeout(() => {
      addToCart({
        _id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: "Superfoods",
        stock: 100
      });
      setAddingId(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA]/30 text-neutral-800 font-sans antialiased selection:bg-[#2C4A3E]/10">
      
      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-16 text-center space-y-4">
        <div className="inline-block">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#2C4A3E] bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
            Clean Food Supplements &amp; Condiments
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C4A3E] font-medium max-w-3xl mx-auto leading-tight">
          Nutritional support crafted for your daily routine.
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 max-w-xl mx-auto font-light leading-relaxed">
          Naturally rich in nutrients, vitamins, and antioxidants. Free from artificial colors, fillers, or regulatory gray areas. Just pure dietary wellness.
        </p>
      </header>

      {/* 3-Product Dynamic Grid */}
      <main id="collection" className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {EXACT_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white border border-neutral-200/70 rounded-lg shadow-xs overflow-hidden flex flex-col justify-between hover:border-neutral-300 transition-all">
              
              {/* Product Card Visual Area */}
              <div className="bg-neutral-50/60 h-80 flex flex-col justify-between border-b border-neutral-100 relative overflow-hidden">
                <span className="text-[9px] font-mono tracking-wider text-neutral-400 bg-white px-2 py-1 rounded border border-neutral-200/40 self-start m-4 z-10">
                  {product.weight} Pack
                </span>
                
                {/* Visual Image Render */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="text-center pb-3 bg-gradient-to-t from-white/90 to-transparent pt-12 px-4 z-10">
                  <span className="text-xs font-bold text-[#2C4A3E] tracking-wide block">
                    {product.tagline}
                  </span>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium text-neutral-800">{product.name}</h3>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {product.shortDesc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-baseline border-t border-neutral-100 pt-3">
                    <span className="text-xs text-neutral-400">Maximum Retail Price</span>
                    <span className="text-lg font-bold text-[#2C4A3E]">₹{product.price}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded transition-all text-center border border-neutral-200/60 cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product.id}
                      className="bg-[#2C4A3E] hover:bg-[#1f352c] disabled:bg-[#2C4A3E]/60 text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded transition-all cursor-pointer text-center border-0"
                    >
                      {addingId === product.id ? 'Adding...' : 'Add To Bag'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Common Features Trust Section */}
        <section className="bg-white border border-neutral-200/60 rounded-xl p-8 md:p-12 text-center space-y-8">
          <div className="space-y-1">
            <img src={logoImg} alt="AyuraBlend Logo" className="h-16 w-16 mx-auto object-contain rounded-full mb-2" />
            <h2 className="font-serif text-2xl text-[#2C4A3E] font-medium">Why Choose Ayur Moringa?</h2>
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Our Production Standard</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs font-medium text-neutral-700">
            {['🌿 Premium Ingredients', '🧼 Hygienically Prepared', '🌱 No Artificial Colors', '🚫 No Preservatives', '📦 Freshly Packed', '🇮🇳 Proudly Made in India', '❤️ Prepared with Care'].map((feat, index) => (
              <div key={index} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center text-center">
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Global Product Context Modal (Slide-out detail view) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-xl h-full rounded-xl shadow-xl p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-12 h-12 object-cover rounded-md border" />
                  <div>
                    <h2 className="font-serif text-2xl text-[#2C4A3E] font-medium leading-none">{selectedProduct.name}</h2>
                    <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-1">{selectedProduct.tagline}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-neutral-400 hover:text-neutral-700 font-mono text-xl p-1 cursor-pointer bg-transparent border-0"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Product Information</h4>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{selectedProduct.fullDesc}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Product Highlights</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProduct.highlights.map((highlight, idx) => (
                    <span key={idx} className="text-xs text-neutral-700 font-medium bg-neutral-50 p-2 rounded border border-neutral-100">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#2C4A3E]/5 border border-[#2C4A3E]/10 p-4 rounded-lg space-y-1">
                <h4 className="text-xs uppercase tracking-wider text-[#2C4A3E] font-bold">Suggested Use</h4>
                <p className="text-xs text-neutral-700 leading-relaxed">{selectedProduct.suggestedUse}</p>
              </div>
            </div>

            {/* Bottom Disclaimer Requirement */}
            <div className="pt-6 border-t border-neutral-100 space-y-4">
              <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                <strong>Disclaimer:</strong> This product is a natural food supplement and is not intended to diagnose, treat, cure, or prevent any disease. Consume as part of a balanced diet and healthy lifestyle. If you are pregnant, nursing, taking medication, or have a medical condition, consult your healthcare professional before use.
              </p>
              <button
                onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-[#2C4A3E] text-white text-xs uppercase tracking-widest font-semibold py-3 rounded transition-all text-center cursor-pointer border-0"
              >
                Add {selectedProduct.name} To Bag — ₹{selectedProduct.price}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Page Footer with Disclaimer */}
      <footer className="bg-white border-t border-neutral-200/60 mt-16 py-8 px-4 text-center space-y-4">
        <img src={logoImg} alt="AyuraBlend Logo" className="h-12 w-12 mx-auto object-contain rounded-full" />
        <p className="text-[10px] text-neutral-400 max-w-3xl mx-auto leading-relaxed">
          <strong>Disclaimer:</strong> These products are natural food supplements and are not intended to diagnose, treat, cure, or prevent any disease. Consume as part of a balanced diet and healthy lifestyle.
        </p>
        <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
          © 2026 AyuraBlend Apothecary Private Ltd. Cultivated and handled safely.
        </p>
      </footer>

    </div>
  );
}
