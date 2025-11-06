import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MOCK_DASHBOARD_REQUESTS, MOCK_CONVERSATIONS } from '../constants';
import { Item, DashboardRequest, Conversation, ItemStatus, RequestStatus } from '../types';
import Modal from './Modal';
import ItemForm from './ItemForm';
import { MyItemsIcon, MyRequestsIcon, MessagesIcon, ImpactIcon, SettingsIcon, TopDonorIcon, VerifiedDonorIcon, CommunityHelperIcon, MailIcon, CheckIcon, EditIcon, TrashIcon } from './Icons';

declare const echarts: any;

type Tab = 'my-items' | 'my-requests' | 'messages' | 'impact' | 'settings';
type View = 'home' | 'browse' | 'dashboard' | 'donate';

interface DashboardProps {
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    addNotification: (message: string) => void;
    onNavigate: (view: View) => void;
}

// ========= REUSABLE & CUSTOM COMPONENTS ========= //

const StatCard: React.FC<{ label: string; value: string | number; highlighted?: boolean; }> = ({ label, value, highlighted }) => (
    <div className={`rounded-xl p-6 ${highlighted ? 'bg-primary-green text-white' : 'bg-white'}`}>
        <p className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-primary-green'}`}>{value}</p>
        <p className={`mt-1 ${highlighted ? 'text-green-100' : 'text-gray-600'}`}>{label}</p>
    </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; }> = ({ label, checked, onChange }) => (
    <label className="custom-checkbox flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="checkmark">
           <CheckIcon className="w-4 h-4" />
        </span>
        <span className="text-gray-700">{label}</span>
    </label>
);

// ========= TAB CONTENT COMPONENTS ========= //

const MyItemsTab: React.FC<{ items: Item[], onAddItem: () => void, onEditItem: (item: Item) => void, onDeleteItem: (itemId: number) => void, addNotification: (message: string) => void }> = ({ items, onAddItem, onEditItem, onDeleteItem, addNotification }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-charcoal">My Donated Items</h2>
            <button onClick={onAddItem} className="btn-primary px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2">
                <span className="text-xl">+</span> Add New Item
            </button>
        </div>
        <div className="space-y-6">
            {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-5 flex items-center space-x-6">
                    <img src={item.images[0]} alt={item.title} className="w-32 h-32 object-cover rounded-xl"/>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <div>
                                <span className={`status-badge capitalize ${
                                    item.status === ItemStatus.Available ? 'status-available' :
                                    item.status === ItemStatus.Pending ? 'status-pending' : 'status-completed'
                                }`}>{item.status}</span>
                                <h3 className="text-xl font-bold text-charcoal mt-2">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>👁 {item.views} views</span>
                                <span>•</span>
                                <span>📋 {item.requests} requests</span>
                            </div>
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="flex justify-end items-center gap-4">
                            <button onClick={() => addNotification(`New request for "${item.title}"!`)} className="font-semibold text-primary-green hover:underline">View Requests</button>
                            <button onClick={() => onEditItem(item)} className="font-semibold text-gray-600 hover:underline flex items-center gap-1"><EditIcon /> Edit</button>
                            <button onClick={() => onDeleteItem(item.id)} className="font-semibold text-coral hover:underline flex items-center gap-1"><TrashIcon /> Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MyRequestsTab: React.FC<{ requests: DashboardRequest[], addNotification: (message: string) => void }> = ({ requests, addNotification }) => (
     <div>
        <h2 className="text-3xl font-bold text-charcoal mb-6">My Item Requests</h2>
        <div className="space-y-4">
            {requests.map(req => (
                <div key={req.id} className="bg-white rounded-2xl shadow p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                        <img src={req.image} alt={req.item} className="w-24 h-24 object-cover rounded-xl"/>
                        <div>
                            <h3 className="text-xl font-bold text-charcoal">{req.item}</h3>
                            <p className="text-gray-600 mb-2">From {req.donor}</p>
                            <div>
                                <span className={`status-badge capitalize ${
                                    req.status === RequestStatus.Pending ? 'status-pending' :
                                    req.status === RequestStatus.Approved ? 'status-available' : 'status-completed'
                                }`}>{req.status}</span>
                                <span className="text-sm text-gray-500 ml-3">Requested {req.requested}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {req.status === RequestStatus.Approved && (
                           <button onClick={() => addNotification(`Message sent to ${req.donor}!`)} className="btn-primary px-4 py-2 rounded-lg font-semibold w-40 text-center">Contact Donor</button>
                        )}
                        <button onClick={() => addNotification(`Request for "${req.item}" cancelled.`)} className="font-semibold text-coral hover:underline">Cancel Request</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MessagesTab: React.FC = () => {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

    return (
        <div>
            <h2 className="text-3xl font-bold text-charcoal mb-6">Messages</h2>
            <div className="bg-white rounded-2xl shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
                    <div className="md:col-span-1 border-r border-gray-100">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-lg">Conversations</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {MOCK_CONVERSATIONS.map(convo => (
                                <div key={convo.id} onClick={() => setSelectedConversation(convo.id)}
                                    className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-soft-gray ${selectedConversation === convo.id ? 'bg-soft-gray' : ''}`}>
                                    <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-full"/>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-bold">{convo.name}</p>
                                            <p className="text-xs text-gray-500">{convo.time}</p>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm text-gray-600 truncate w-48">{convo.lastMessage}</p>
                                            {convo.unread && <span className="w-2.5 h-2.5 bg-coral rounded-full flex-shrink-0"></span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                        <MailIcon className="w-24 h-24 text-gray-300" />
                        <h3 className="text-xl font-bold text-charcoal mt-4">Select a conversation</h3>
                        <p>Choose one of your conversations to see the messages.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ImpactStatsTab: React.FC = () => {
    const donationsChartRef = useRef<any>(null);
    const categoriesChartRef = useRef<any>(null);

    const initCharts = useCallback(() => {
        const donationsChartEl = document.getElementById('donations-chart');
        if (donationsChartEl && !donationsChartRef.current) {
            donationsChartRef.current = echarts.init(donationsChartEl);
            donationsChartRef.current.setOption({
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], axisLine: { show: false }, axisTick: { show: false } },
                yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
                series: [{ data: [2, 4, 3, 5, 6, 3], type: 'line', smooth: true, itemStyle: { color: '#2D5A3D' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(45, 90, 61, 0.3)' }, { offset: 1, color: 'rgba(45, 90, 61, 0)' }]) }}],
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
            });
        }
        const categoriesChartEl = document.getElementById('categories-chart');
        if (categoriesChartEl && !categoriesChartRef.current) {
            categoriesChartRef.current = echarts.init(categoriesChartEl);
            categoriesChartRef.current.setOption({
                tooltip: { trigger: 'item' },
                legend: { top: 'bottom', left: 'center' },
                series: [{
                    name: 'Impact Categories', type: 'pie', radius: ['40%', '70%'], avoidLabelOverlap: false,
                    label: { show: false, position: 'center' },
                    emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
                    labelLine: { show: false },
                    data: [
                        { value: 8, name: 'Clothing', itemStyle: { color: '#2D5A3D' } },
                        { value: 5, name: 'Books', itemStyle: { color: '#FF6B6B' } },
                        { value: 4, name: 'Furniture', itemStyle: { color: '#F7DC6F' } },
                        { value: 3, name: 'Electronics', itemStyle: { color: '#60a5fa' } },
                        { value: 2, name: 'Other', itemStyle: { color: '#9ca3af' } }
                    ]
                }]
            });
        }
    }, []);

    useEffect(() => {
        initCharts();
        const resizeCharts = () => {
            donationsChartRef.current?.resize();
            categoriesChartRef.current?.resize();
        };
        window.addEventListener('resize', resizeCharts);
        return () => {
            if (donationsChartRef.current) { donationsChartRef.current.dispose(); donationsChartRef.current = null; }
            if (categoriesChartRef.current) { categoriesChartRef.current.dispose(); categoriesChartRef.current = null; }
            window.removeEventListener('resize', resizeCharts);
        };
    }, [initCharts]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-charcoal mb-2">Your Impact Dashboard</h2>
            <p className="text-gray-600 mb-6">Track your contributions and see how you're making a difference</p>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-bold text-charcoal">Donations Over Time</h3>
                    <div id="donations-chart" style={{ height: '300px' }}></div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
                    <h3 className="text-lg font-bold text-charcoal">Impact Categories</h3>
                    <div id="categories-chart" style={{ height: '300px' }}></div>
                </div>
            </div>
             <div className="mt-6 bg-white rounded-2xl shadow p-8">
                <h3 className="text-xl font-bold mb-6 text-charcoal">Community Recognition</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-soft-gray rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <TopDonorIcon className="w-8 h-8 text-golden" />
                        </div>
                        <h4 className="font-bold text-lg text-charcoal">Top Donor</h4>
                        <p className="text-sm text-gray-600">March 2024</p>
                    </div>
                    <div className="bg-soft-gray rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <VerifiedDonorIcon className="w-8 h-8 text-golden" />
                        </div>
                        <h4 className="font-bold text-lg text-charcoal">Verified Donor</h4>
                        <p className="text-sm text-gray-600">Since 2023</p>
                    </div>
                    <div className="bg-soft-gray rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                            <CommunityHelperIcon className="w-8 h-8 text-golden" />
                        </div>
                        <h4 className="font-bold text-lg text-charcoal">Community Helper</h4>
                        <p className="text-sm text-gray-600">Active Member</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsTab: React.FC<{ addNotification: (message: string) => void }> = ({ addNotification }) => {
    const [profile, setProfile] = useState({ fullName: 'Michael Rodriguez', email: 'michael.r@email.com', phone: '+1 (555) 123-4567', location: 'New York, NY'});
    const [notifications, setNotifications] = useState({ newRequests: true, messages: false, weeklySummary: true, newItems: false });
    const [privacy, setPrivacy] = useState({ showProfile: true, allowDirectMessages: true, showImpactStats: false });

    return (
        <div>
            <h2 className="text-3xl font-bold text-charcoal mb-6">Account Settings</h2>
            <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow p-8">
                    <h3 className="text-xl font-bold mb-6 text-charcoal">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input type="text" value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                            <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"/>
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"/>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button onClick={() => addNotification('Profile updated successfully!')} className="btn-primary px-6 py-2.5 rounded-lg font-semibold">Update Profile</button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-8">
                     <h3 className="text-xl font-bold mb-6 text-charcoal">Notification Preferences</h3>
                     <div className="space-y-4">
                        <Checkbox label="Email notifications for new requests" checked={notifications.newRequests} onChange={c => setNotifications({...notifications, newRequests: c})} />
                        <Checkbox label="Push notifications for messages" checked={notifications.messages} onChange={c => setNotifications({...notifications, messages: c})} />
                        <Checkbox label="Weekly impact summary" checked={notifications.weeklySummary} onChange={c => setNotifications({...notifications, weeklySummary: c})} />
                        <Checkbox label="New items in my area" checked={notifications.newItems} onChange={c => setNotifications({...notifications, newItems: c})} />
                     </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-8">
                     <h3 className="text-xl font-bold mb-6 text-charcoal">Privacy Settings</h3>
                     <div className="space-y-4">
                        <Checkbox label="Show my profile to other users" checked={privacy.showProfile} onChange={c => setPrivacy({...privacy, showProfile: c})} />
                        <Checkbox label="Allow direct messages" checked={privacy.allowDirectMessages} onChange={c => setPrivacy({...privacy, allowDirectMessages: c})} />
                        <Checkbox label="Show my impact statistics" checked={privacy.showImpactStats} onChange={c => setPrivacy({...privacy, showImpactStats: c})} />
                     </div>
                </div>
            </div>
        </div>
    );
};


// ========= MAIN DASHBOARD COMPONENT ========= //

const Dashboard: React.FC<DashboardProps> = ({ items, setItems, addNotification, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('my-items');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

    const handleUpdateItem = (updatedItem: Item) => {
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
        addNotification("Item updated successfully!");
        setItemToEdit(null);
    };

    const handleOpenModalForEdit = (item: Item) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = (itemId: number) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        addNotification("Item deleted.");
    };

    const TabButton: React.FC<{ tabId: Tab, icon: React.ReactNode, label: string, count?: number }> = ({ tabId, icon, label, count }) => {
        const isActive = activeTab === tabId;
        const unreadMessages = MOCK_CONVERSATIONS.filter(c => c.unread).length;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold flex items-center transition-all duration-200 relative ${
                    isActive ? 'bg-primary-green/10 text-primary-green' : 'text-charcoal hover:bg-gray-50'
                }`}
            >
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 bg-primary-green rounded-r-full"></span>}
                <span className="mr-3">{icon}</span> {label}
                {count !== undefined && (
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-primary-green text-white' : (tabId === 'messages' && unreadMessages > 0 ? 'bg-coral text-white' : 'bg-gray-200 text-charcoal')
                    }`}>{count}</span>
                )}
            </button>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'my-items': return <MyItemsTab items={items} onAddItem={() => onNavigate('donate')} onEditItem={handleOpenModalForEdit} onDeleteItem={handleDeleteItem} addNotification={addNotification} />;
            case 'my-requests': return <MyRequestsTab requests={MOCK_DASHBOARD_REQUESTS} addNotification={addNotification} />;
            case 'messages': return <MessagesTab />;
            case 'impact': return <ImpactStatsTab />;
            case 'settings': return <SettingsTab addNotification={addNotification} />;
            default: return null;
        }
    };
    
    return (
        <div className="pt-16 bg-soft-gray min-h-screen">
            <header className="py-8">
                 <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <img src="https://i.pravatar.cc/150?u=michael" alt="Profile" className="w-16 h-16 rounded-full mr-5"/>
                            <div>
                                <h1 className="font-display text-4xl font-bold text-charcoal">Welcome back, Michael!</h1>
                                <p className="text-gray-600">Member since January 2023</p>
                            </div>
                        </div>
                         <div>
                            <p className="text-gray-600 text-sm">Your Impact Score</p>
                            <p className="text-5xl font-bold text-primary-green text-right">847</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Items Donated" value={items.length} highlighted />
                        <StatCard label="Families Helped" value={15} />
                        <StatCard label="Items Received" value={8} />
                        <StatCard label="Community Rating" value={4.9} />
                    </div>
                 </div>
            </header>
            <main className="pb-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <aside className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow p-4 sticky top-24">
                                <nav className="space-y-2">
                                    <TabButton tabId="my-items" icon={<MyItemsIcon />} label="My Items" />
                                    <TabButton tabId="my-requests" icon={<MyRequestsIcon />} label="My Requests" />
                                    <TabButton tabId="messages" icon={<MessagesIcon />} label="Messages" count={MOCK_CONVERSATIONS.filter(c=>c.unread).length} />
                                    <TabButton tabId="impact" icon={<ImpactIcon />} label="Impact Stats" />
                                    <TabButton tabId="settings" icon={<SettingsIcon />} label="Settings" />
                                </nav>
                            </div>
                        </aside>
                        <section className="lg:col-span-3">
                            <div key={activeTab} className="animate-fade-in-up">
                               {renderTabContent()}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setItemToEdit(null); }}>
                <ItemForm onAddItem={handleUpdateItem} onClose={() => { setIsModalOpen(false); setItemToEdit(null); }} itemToEdit={itemToEdit} />
            </Modal>
        </div>
    );
};

export default Dashboard;