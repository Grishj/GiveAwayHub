import React, { useState } from 'react';
import { ItemCategory, ItemCondition } from '../types';
import { CONDITIONS } from '../constants';
import { ClothingIcon, BooksIcon, FurnitureIcon, ElectronicsIcon, KitchenIcon, ToysIcon, SportsIcon, OtherIcon } from './Icons';

type FormData = {
    category: ItemCategory | '';
    title: string;
    description: string;
    condition: ItemCondition | '';
    quantity: number;
    address: string;
    city: string;
    state: string;
    zip: string;
}

interface DonationFormProps {
    onDonate: (data: {
        category: ItemCategory;
        title: string;
        description: string;
        condition: ItemCondition;
        quantity: number;
        location: string;
    }) => void;
}

const ProgressBar: React.FC<{ step: number }> = ({ step }) => {
    const progress = (step / 4) * 100;
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-600">Step {step} of 4</span>
                <span className="text-sm font-semibold text-gray-600">{progress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}

const CategorySelector: React.FC<{ onSelect: (category: ItemCategory) => void, selectedCategory: ItemCategory | '' }> = ({ onSelect, selectedCategory }) => {
    const categories = [
        { name: ItemCategory.Clothing, icon: <ClothingIcon /> },
        { name: ItemCategory.Books, icon: <BooksIcon /> },
        { name: ItemCategory.Furniture, icon: <FurnitureIcon /> },
        { name: ItemCategory.Electronics, icon: <ElectronicsIcon /> },
        { name: ItemCategory.Kitchen, icon: <KitchenIcon /> },
        { name: ItemCategory.Toys, icon: <ToysIcon /> },
        { name: ItemCategory.Sports, icon: <SportsIcon /> },
        { name: ItemCategory.Other, icon: <OtherIcon /> },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ name, icon }) => (
                <div key={name} 
                     onClick={() => onSelect(name)}
                     className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-28
                        ${selectedCategory === name ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:border-primary-green hover:bg-green-50/50'}`}>
                    <div className={`mb-2 ${selectedCategory === name ? 'text-primary-green' : 'text-gray-500'}`}>{icon}</div>
                    <span className={`font-semibold capitalize ${selectedCategory === name ? 'text-primary-green' : 'text-gray-700'}`}>{name}</span>
                </div>
            ))}
        </div>
    )
}


const DonationForm: React.FC<DonationFormProps> = ({ onDonate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        title: '',
        description: '',
        condition: '',
        quantity: 1,
        address: '',
        city: '',
        state: '',
        zip: '',
    });

    const handleNext = () => setStep(prev => prev < 4 ? prev + 1 : prev);
    const handlePrev = () => setStep(prev => prev > 1 ? prev - 1 : prev);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = () => {
        if (!formData.category || !formData.condition) return;
        
        onDonate({
            category: formData.category,
            title: formData.title,
            description: formData.description,
            condition: formData.condition,
            quantity: Number(formData.quantity),
            location: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
        });
    }

    return (
        <div className="bg-soft-gray py-20 pt-32">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="font-display text-4xl font-bold text-primary-green mb-2">Donate in 4 Simple Steps</h1>
                    <p className="text-lg text-gray-600">Your gently-used items can change someone's life</p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <ProgressBar step={step} />
                    <div className="mt-8">
                        {step === 1 && (
                            <div>
                                <h2 className="text-2xl font-bold text-center text-charcoal mb-6">What would you like to donate?</h2>
                                <CategorySelector selectedCategory={formData.category} onSelect={cat => setFormData({...formData, category: cat})} />
                                <div className="flex justify-end mt-8">
                                    <button onClick={handleNext} disabled={!formData.category} className="btn-primary px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed">Next Step</button>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                             <div>
                                <h2 className="text-2xl font-bold text-center text-charcoal mb-6">Tell us about your items</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Item Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="e.g., Winter Coats Collection" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="Describe your items in detail..."></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
                                            <select name="condition" value={formData.condition} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg">
                                                <option value="">Select condition</option>
                                                {CONDITIONS.map(c => <option key={c} value={c} className="capitalize">{c.replace('-', ' ')}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                                            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required min="1" className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="Number of items" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-8">
                                    <button onClick={handlePrev} className="px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50">Previous</button>
                                    <button onClick={handleNext} className="btn-primary px-8 py-3 rounded-lg font-semibold">Next Step</button>
                                </div>
                            </div>
                        )}
                         {step === 3 && (
                             <div>
                                <h2 className="text-2xl font-bold text-center text-charcoal mb-6">Where are you located?</h2>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="Enter your address for pickup" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="City" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                                            <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="State" />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">ZIP Code</label>
                                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg" placeholder="ZIP" />
                                        </div>
                                    </div>
                                 </div>
                                <div className="flex justify-between mt-8">
                                    <button onClick={handlePrev} className="px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50">Previous</button>
                                    <button onClick={handleNext} className="btn-primary px-8 py-3 rounded-lg font-semibold">Next Step</button>
                                </div>
                            </div>
                        )}
                        {step === 4 && (
                            <div>
                                <h2 className="text-2xl font-bold text-center text-charcoal mb-6">Review your donation</h2>
                                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Category:</span> <span className="text-gray-800 capitalize">{formData.category}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Title:</span> <span className="text-gray-800">{formData.title}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Condition:</span> <span className="text-gray-800 capitalize">{formData.condition?.replace('-', ' ')}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Quantity:</span> <span className="text-gray-800">{formData.quantity}</span></div>
                                    <div className="flex justify-between"><span className="font-semibold text-gray-600">Location:</span> <span className="text-gray-800 text-right">{`${formData.address}, ${formData.city}, ${formData.state}`}</span></div>
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-6">By submitting, you agree to our terms of service and privacy policy.</p>
                                <div className="flex justify-between mt-8">
                                    <button onClick={handlePrev} className="px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50">Previous</button>
                                    <button onClick={handleSubmit} className="btn-primary px-8 py-3 rounded-lg font-semibold">Submit Donation</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationForm;