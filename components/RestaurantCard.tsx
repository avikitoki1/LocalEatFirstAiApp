
import React from 'react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4 transition-transform active:scale-[0.98]">
      <div className="relative h-48 w-full">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-sm">
          {restaurant.cuisine}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-1">{restaurant.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {restaurant.description}
        </p>
        
        {restaurant.mapUrl && (
          <a 
            href={restaurant.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <i className="fa-solid fa-location-dot"></i>
            View on Maps
          </a>
        )}
      </div>
    </div>
  );
};
