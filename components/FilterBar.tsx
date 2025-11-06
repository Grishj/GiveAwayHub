import React, { useState, useEffect, useCallback } from 'react';
import { ItemCategory, ItemCondition } from '../types';
import { CATEGORIES, CONDITIONS } from '../constants';
import { GridViewIcon, MapViewIcon } from './Icons';

interface Filters {
    view: 'grid' | 'map';
    categories: Set<ItemCategory>;
    conditions: Set<ItemCondition>;
    distance: number;
    sortBy: 'distance' | 'newest' | 'oldest' | 'condition';
}

interface FilterBarProps {
    onFilterChange: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [view, setView] = useState<'grid' | 'map'>('grid');
    const [categories, setCategories] = useState<Set<ItemCategory>>(new Set(['all' as any]));
    const [conditions, setConditions] = useState<Set<ItemCondition>>(new Set(['all' as any]));
    const [distance, setDistance] = useState(10);
    const [sortBy, setSortBy] = useState<'distance' | 'newest' | 'oldest' | 'condition'>('distance');

    const handleCategoryToggle = (cat: ItemCategory | 'all') => {
        setCategories(prev => {
            const newCats = new Set(prev);
            if (cat === 'all') {
                return new Set(['all' as any]);
            }
            newCats.delete('all' as any);
            if (newCats.has(cat)) {
                newCats.delete(cat);
            } else {
                newCats.add(cat);
            }
            if (newCats.size === 0) return new Set(['all' as any]);
            return newCats;
        });
    };
    
    const handleConditionToggle = (con: ItemCondition | 'all') => {
        setConditions(prev => {
            const newCons = new Set(prev);
            if (con === 'all') {
                return new Set(['all' as any]);
            }
            newCons.delete('all' as any);
            if (newCons.has(con)) {
                newCons.delete(con);
            } else {
                newCons.add(con);
            }
            if (newCons.size === 0) return new Set(['all' as any]);
            return newCons;
        });
    };

    const clearAllFilters = () => {
        setView('grid');
        setCategories(new Set(['all' as any]));
        setConditions(new Set(['all' as any]));
        setDistance(10);
        setSortBy('distance');
    };

    const memoizedOnFilterChange = useCallback(onFilterChange, []);

    useEffect(() => {
        memoizedOnFilterChange({ view, categories, conditions, distance, sortBy });
    }, [view, categories, conditions, distance, sortBy, memoizedOnFilterChange]);

    const categoryEmojis = { clothing: '👕', books: '📚', furniture: '🪑', electronics: '📱', kitchen: '🍳', toys: '🧸', sports: '⚽', other: '📦' };

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button onClick={clearAllFilters} className="text-sm text-coral hover:underline">Clear All</button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">View Mode</label>
                    <div className="flex gap-2">
                        <button onClick={() => setView('grid')} className={`view-toggle px-4 py-2 rounded-lg text-sm font-semibold flex items-center ${view === 'grid' ? 'active' : ''}`}>
                            <GridViewIcon className="mr-2" /> Grid
                        </button>
                        <button onClick={() => setView('map')} className={`view-toggle px-4 py-2 rounded-lg text-sm font-semibold flex items-center ${view === 'map' ? 'active' : ''}`}>
                            <MapViewIcon className="mr-2" /> Map
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Categories</label>
                    <div className="flex flex-wrap gap-2">
                         <div onClick={() => handleCategoryToggle('all')} className={`filter-chip px-3 py-2 rounded-lg text-sm ${categories.has('all' as any) ? 'active' : ''}`}>All Items</div>
                        {CATEGORIES.filter(c => c !== 'other').map(cat => (
                           <div key={cat} onClick={() => handleCategoryToggle(cat)} className={`filter-chip px-3 py-2 rounded-lg text-sm ${categories.has(cat) ? 'active' : ''}`}>
                               {categoryEmojis[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                           </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Condition</label>
                    <div className="flex flex-wrap gap-2">
                        <div onClick={() => handleConditionToggle('all')} className={`filter-chip px-3 py-2 rounded-lg text-sm ${conditions.has('all' as any) ? 'active' : ''}`}>All</div>
                        {CONDITIONS.map(con => (
                           <div key={con} onClick={() => handleConditionToggle(con)} className={`filter-chip px-3 py-2 rounded-lg text-sm capitalize ${conditions.has(con) ? 'active' : ''}`}>{con.replace('-', ' ')}</div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Distance</label>
                    <div className="px-2">
                        <input type="range" id="distance-slider" className="distance-slider w-full" min="1" max="50" value={distance} onChange={e => setDistance(Number(e.target.value))} />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>1 mile</span>
                            <span id="distance-value">{distance} miles</span>
                            <span>50 miles</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent">
                        <option value="distance">Distance</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="condition">Condition</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
