import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onViewDetails: (item: Item) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails }) => {
  return (
    <div 
        className="item-card card-hover bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(item)}
    >
        <div className="relative">
            <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
                    {item.condition.replace('-', ' ')}
                </span>
            </div>
            <div className="absolute top-4 right-4">
                <span className="bg-primary-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.distance}
                </span>
            </div>
        </div>
        <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">{item.title}</h3>
            <p className="text-gray-600 mb-4 h-10 overflow-hidden text-ellipsis">{item.description}</p>
            <div className="flex items-center mb-4">
                <img src={item.donor.avatar} alt={item.donor.name} className="w-8 h-8 rounded-full mr-3" />
                <div>
                    <p className="text-sm font-semibold text-gray-700">{item.donor.name}</p>
                    <p className="text-xs text-gray-500">⭐ {item.donor.rating} • {item.posted}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    <span>👁 {item.views} views</span>
                    <span className="ml-2">📋 {item.requests} requests</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onViewDetails(item); }}
                    className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
                >
                    Request Item
                </button>
            </div>
        </div>
    </div>
  );
};

export default ItemCard;
