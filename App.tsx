
import React, { useState, useEffect, useCallback } from 'react';
import { findLocalFood } from './services/geminiService';
import { AppState, Restaurant } from './types';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    restaurants: [],
    loading: false,
    error: null,
    location: null,
    query: '',
    aiExplanation: ''
  });

  const [activeFilter, setActiveFilter] = useState('All');

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: "Geolocation is not supported by your browser" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
      },
      (error) => {
        setState(prev => ({ ...prev, error: "Please enable location services to find nearby food." }));
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!state.location) {
      getLocation();
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await findLocalFood(
        state.location.lat,
        state.location.lng,
        state.query || activeFilter
      );
      setState(prev => ({
        ...prev,
        restaurants: result.restaurants,
        aiExplanation: result.explanation,
        loading: false
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Something went wrong"
      }));
    }
  };

  const filters = ['Local Gems', 'Street Food', 'Authentic', 'Hidden Spots', 'Traditional'];

  return (
    <div className="min-h-screen max-w-md mx-auto relative pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black text-emerald-600 tracking-tight">LocalEats AI</h1>
            <p className="text-xs text-slate-500 font-medium">Authentic flavors, intelligently found.</p>
          </div>
          <button 
            onClick={getLocation}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
          >
            <i className="fa-solid fa-crosshairs"></i>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text"
            placeholder="Search for a specific dish or vibe..."
            className="w-full bg-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={state.query}
            onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
          >
            Find
          </button>
        </form>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setState(prev => ({ ...prev, query: filter }));
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeFilter === filter 
                ? 'bg-slate-800 text-white shadow-md' 
                : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Location Warning */}
        {!state.location && !state.error && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <i className="fa-solid fa-circle-info text-amber-500 mt-1"></i>
            <p className="text-sm text-amber-800 font-medium">
              We need your location to find the best nearby food. Tap the target icon above.
            </p>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <i className="fa-solid fa-triangle-exclamation text-rose-500 mt-1"></i>
            <p className="text-sm text-rose-800 font-medium">{state.error}</p>
          </div>
        )}

        {/* AI Insight */}
        {state.aiExplanation && !state.loading && (
          <div className="mb-8 p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
              <i className="fa-solid fa-sparkles"></i>
              AI Insight
            </div>
            <p className="text-slate-700 text-sm leading-relaxed italic">
              "{state.aiExplanation}"
            </p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {state.loading ? 'Finding Flavors...' : 'Nearby Recommendations'}
            </h2>
            <span className="text-xs font-bold text-slate-400">
              {state.restaurants.length} Results
            </span>
          </div>

          {state.loading ? (
            <LoadingSkeleton />
          ) : state.restaurants.length > 0 ? (
            state.restaurants.map((rest, idx) => (
              <RestaurantCard key={idx} restaurant={rest} />
            ))
          ) : (
            !state.error && state.location && (
              <div className="text-center py-12">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <i className="fa-solid fa-bowl-food text-2xl"></i>
                </div>
                <h3 className="text-slate-600 font-bold mb-1">Hungry for something?</h3>
                <p className="text-slate-400 text-sm">Hit search to find local delicacies nearby.</p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Bottom Nav Simulation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900 text-white rounded-3xl p-3 shadow-2xl flex items-center justify-around z-50">
        <button className="flex flex-col items-center gap-1 text-emerald-400">
          <i className="fa-solid fa-house text-lg"></i>
          <span className="text-[10px] font-bold">Discover</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
          <i className="fa-solid fa-bookmark text-lg"></i>
          <span className="text-[10px] font-bold">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
          <i className="fa-solid fa-user text-lg"></i>
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
