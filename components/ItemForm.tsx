import React, { useState, useRef, useEffect } from 'react';
import { Item, ItemCategory, ItemCondition } from '../types';
import { CATEGORIES, CONDITIONS } from '../constants';
import { UploadIcon, MapPinIcon } from './Icons';
import Modal from './Modal';

declare const L: any;

interface ItemFormProps {
  onAddItem: (itemData: any) => void;
  onClose: () => void;
  itemToEdit?: Item | null;
}

const LocationPicker: React.FC<{ onLocationSelect: (loc: string) => void, onClose: () => void }> = ({ onLocationSelect, onClose }) => {
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('location-picker-map').setView([40.7128, -74.0060], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

            mapRef.current.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                if (markerRef.current) {
                    markerRef.current.setLatLng(e.latlng);
                } else {
                    markerRef.current = L.marker(e.latlng).addTo(mapRef.current);
                }
                // Simulate reverse geocoding
                onLocationSelect(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
            });
        }
        // Invalidate size to ensure map renders correctly in modal
        setTimeout(() => mapRef.current?.invalidateSize(), 100);
    }, [onLocationSelect]);
    
    return (
      <div>
        <h3 className="font-bold text-lg mb-2">Select Pickup Location</h3>
        <p className="text-sm text-gray-500 mb-4">Click on the map to set the location.</p>
        <div id="location-picker-map" style={{ height: '400px', borderRadius: '8px' }}></div>
        <div className="flex justify-end mt-4">
            <button onClick={onClose} className="btn-primary px-6 py-2 rounded-lg font-semibold">Confirm Location</button>
        </div>
      </div>
    )
}

const ItemForm: React.FC<ItemFormProps> = ({ onAddItem, onClose, itemToEdit }) => {
    const [title, setTitle] = useState(itemToEdit?.title || '');
    const [category, setCategory] = useState<ItemCategory | ''>(itemToEdit?.category || '');
    const [condition, setCondition] = useState<ItemCondition | ''>(itemToEdit?.condition || '');
    const [description, setDescription] = useState(itemToEdit?.description || '');
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState(itemToEdit?.location.address || '');
    const [imagePreview, setImagePreview] = useState<string | null>(itemToEdit?.images[0] || null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLocationSelect = (loc: string) => {
        setLocation(loc);
        setMapModalOpen(false); // Close modal after selection
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem = {
            id: itemToEdit?.id || Date.now(),
            title,
            category,
            condition,
            description,
            quantity,
            location: { address: location },
            images: [imagePreview || 'https://picsum.photos/seed/newitem/400/300'],
            distance: '0.1 miles',
            donor: { name: 'Michael R.', avatar: 'https://i.pravatar.cc/150?u=michael', rating: 4.9 },
            posted: 'Just now',
            views: 0,
            requests: 0,
            status: 'available'
        };
        onAddItem(newItem);
        onClose();
    };

    return (
        <>
            <h2 className="font-display text-3xl font-bold text-primary-green mb-6">{itemToEdit ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Photo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                      ) : (
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-green hover:text-primary-green/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-green">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Item Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" placeholder="e.g., Winter Coat Collection" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value as ItemCategory)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent">
                            <option value="">Select category</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                        <select value={condition} onChange={(e) => setCondition(e.target.value as ItemCondition)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent">
                            <option value="">Select condition</option>
                            {CONDITIONS.map(con => <option key={con} value={con} className="capitalize">{con.replace('-', ' ')}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" placeholder="Describe your item in detail..."></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent" placeholder="Number of items" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Location</label>
                         <div className="relative">
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent pr-24" placeholder="e.g., Manhattan, NY" />
                            <button type="button" onClick={() => setMapModalOpen(true)} className="absolute right-1 top-1/2 -translate-y-1/2 text-primary-green text-sm font-semibold hover:underline flex items-center gap-1 px-2">
                                <MapPinIcon />
                                From Map
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="btn-primary px-6 py-3 rounded-lg font-semibold flex-1">{itemToEdit ? 'Save Changes' : 'Add Item'}</button>
                </div>
            </form>

            <Modal isOpen={isMapModalOpen} onClose={() => setMapModalOpen(false)}>
                <LocationPicker onLocationSelect={handleLocationSelect} onClose={() => setMapModalOpen(false)} />
            </Modal>
        </>
    );
};

export default ItemForm;