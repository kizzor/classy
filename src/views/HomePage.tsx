import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { useApp } from '../context/AppContext';
import { Smartphone, Armchair, Bike, Shirt, Compass, AlertCircle, Grid, Navigation, Loader2 } from 'lucide-react';
import { getCurrentLocation, calculateDistance, formatDistance } from '../services/geolocation';
import { GeoLocation } from '../types';

const CATEGORIES = [
  { name: 'All', icon: Grid },
  { name: 'Electronics', icon: Smartphone },
  { name: 'Furniture', icon: Armchair },
  { name: 'Sports & Outdoors', icon: Bike },
  { name: 'Fashion', icon: Shirt },
  { name: 'Others', icon: Compass },
];

const DISTANCE_OPTIONS = [
  { label: 'Any Distance', value: 0 },
  { label: 'Within 5km', value: 5 },
  { label: 'Within 10km', value: 10 },
  { label: 'Within 25km', value: 25 },
  { label: 'Within 50km', value: 50 },
  { label: 'Within 100km', value: 100 },
];

export const HomePage: React.FC = () => {
  const { listings, loading, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useApp();
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);
  const [maxDistance, setMaxDistance] = useState(0);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Try to detect location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch {
        // Location not available, that's okay
      }
    };
    detectLocation();
  }, []);

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      alert('Could not detect your location. Please enable location services.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Filter listings based on search, category, and distance
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // Distance filter
    let matchesDistance = true;
    if (maxDistance > 0 && userLocation && item.latitude && item.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude
      );
      matchesDistance = distance <= maxDistance;
    }

    return matchesSearch && matchesCategory && matchesDistance;
  });

  return (
    <div className="bg-slate-50 min-h-screen" id="home-view">
      {/* Visual Hero Banner */}
      <section className="bg-slate-900 text-white py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
            Find local deals, buy and sell <span className="text-emerald-400">instantly</span>.
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Connecting 1.2M+ buyers and sellers locally. Zero transaction fees, 100% peer-to-peer communication.
          </p>
        </div>
      </section>

      {/* Main Browse Shell */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Category Filters Bar */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Browse by Category</h2>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none" id="categories-list">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location & Distance Filter */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location:</span>
          </div>
          
          {userLocation ? (
            <span className="text-xs text-emerald-600 font-medium">
              Detected: {userLocation.latitude.toFixed(2)}, {userLocation.longitude.toFixed(2)}
            </span>
          ) : (
            <button
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting...
                </>
              ) : (
                'Detect my location'
              )}
            </button>
          )}

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {DISTANCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listings Header info */}
        <div className="flex justify-between items-baseline border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Featured Listings</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Verified offline handshake connections</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-md border border-slate-200">
            {filteredListings.length} match{filteredListings.length !== 1 && 'es'}
          </span>
        </div>

        {/* Dynamic Grid Rendering */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
            <span className="text-slate-500 text-xs font-semibold">Updating database feed...</span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 max-w-xl mx-auto p-8 space-y-4" id="empty-listings-state">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">No classifieds found</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              We couldn't find any listings matching "{searchQuery}" in category "{selectedCategory}". Try adjusting your filters!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxDistance(0);
              }}
              className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="product-listings-grid">
            {filteredListings.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};