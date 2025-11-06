import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './components/Header';
import ItemCard from './components/ItemCard';
import FilterBar from './components/FilterBar';
import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import DonationForm from './components/DonationForm';
import { Item, Notification, ItemStatus } from './types';
import { MOCK_ITEMS, MOCK_DASHBOARD_ITEMS } from './constants';
import { SearchIcon, BellIcon, XIcon } from './components/Icons';

// ECharts, Leaflet, p5.js etc. are loaded from CDN, declare them to TypeScript
declare const anime: any;
declare const echarts: any;
declare const Splide: any;
declare const L: any;
declare const p5: any;

type View = 'home' | 'browse' | 'dashboard' | 'donate';

// ========= HOME PAGE COMPONENTS ========= //

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || typeof p5 === 'undefined') return;

    const sketch = (p: any) => {
      let particles: any[] = [];
      const numParticles = window.innerWidth > 768 ? 80 : 30;

      class Particle {
        pos: any;
        vel: any;
        maxSpeed = 0.5;

        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p5.Vector.random2D();
          this.vel.mult(p.random(0.2, this.maxSpeed));
        }

        update() {
          this.pos.add(this.vel);
          this.edges();
        }

        edges() {
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.y > p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
        }

        show() {
          p.noStroke();
          p.fill('rgba(255, 255, 255, 0.4)');
          p.circle(this.pos.x, this.pos.y, 3);
        }
      }

      p.setup = () => {
        p.createCanvas(canvasRef.current!.offsetWidth, canvasRef.current!.offsetHeight).parent(canvasRef.current!);
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        p.clear();
        for (const particle of particles) {
          particle.update();
          particle.show();
        }

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            if (d < 150) {
              p.stroke(`rgba(255, 255, 255, ${p.map(d, 0, 150, 0.2, 0)})`);
              p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
          }
        }
      };
      p.windowResized = () => {
        if (canvasRef.current) {
          p.resizeCanvas(canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        }
      };
    };

    const myp5 = new p5(sketch);
    return () => {
      myp5.remove();
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 z-0"></div>;
};


const FloatingShapes = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] h-16 w-16 animate-float rounded-full bg-golden opacity-10"></div>
        <div className="absolute top-[60%] right-[15%] h-12 w-12 animate-float rounded-full bg-coral opacity-10" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[30%] left-[20%] h-20 w-20 animate-float rounded-full bg-white opacity-10" style={{ animationDelay: '4s' }}></div>
    </div>
);


const Hero = ({ onDonateNow, onFindItems }: { onDonateNow: () => void, onFindItems: () => void; }) => (
    <section className="hero-bg min-h-screen flex items-center pt-16">
        <ParticleCanvas />
        <FloatingShapes />
        <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white">
                    <h1 className="font-display text-5xl lg:text-6xl font-bold mb-6">
                        <span className="inline-block overflow-hidden whitespace-nowrap border-r-[3px] border-r-golden animate-typewriter">Give New Life</span>
                        <br />to Your Items
                    </h1>
                    <p className="text-xl mb-8 opacity-90">
                        Connect with families in need and donate your gently-used clothes, books, furniture, and more. Join our community of givers making a real difference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={onDonateNow} className="btn-primary px-8 py-4 rounded-full font-semibold text-lg">
                            Start Donating
                        </button>
                        <button onClick={onFindItems} className="btn-secondary px-8 py-4 rounded-full font-semibold text-lg text-center">
                           Find Items
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <img src="https://picsum.photos/seed/community/600/400" alt="Community Impact" className="rounded-2xl shadow-2xl w-full" />
                </div>
            </div>
        </div>
    </section>
);

const ImpactStats = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-primary-green mb-4">Our Community Impact</h2>
                </div>
                <div id="impact-chart" style={{ width: '100%', height: '400px' }}></div>
            </div>
        </section>
    );
};


// ========= BROWSE PAGE COMPONENTS ========= //

const MapView = ({ items }: { items: Item[] }) => {
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('items-map').setView([40.7128, -74.0060], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }
        
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        items.forEach(item => {
            const marker = L.marker([item.location.lat, item.location.lng])
                .addTo(mapRef.current)
                .bindPopup(`<b>${item.title}</b><br>${item.distance} away`);
            markersRef.current.push(marker);
        });
    }, [items]);

    return <div id="items-map" className="map-container rounded-2xl shadow-lg" style={{height: '80vh'}}></div>
}

const BrowsePage = () => {
    const [filters, setFilters] = useState<any>({ view: 'grid', categories: new Set(['all']), conditions: new Set(['all']), distance: 10, sortBy: 'distance'});
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const handleViewDetails = (item: Item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const filteredItems = useMemo(() => {
        let items = MOCK_ITEMS.filter(item => {
            const searchMatch = searchTerm === '' || 
                                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const categoryMatch = filters.categories.has('all' as any) || filters.categories.has(item.category);
            const conditionMatch = filters.conditions.has('all' as any) || filters.conditions.has(item.condition);
            const distanceMatch = parseFloat(item.distance) <= filters.distance;

            return searchMatch && categoryMatch && conditionMatch && distanceMatch;
        });

        // Sorting
        items.sort((a, b) => {
            const getTimeValue = (timeString: string) => {
                if (timeString.includes('hour')) return parseInt(timeString) * 60;
                if (timeString.includes('day')) return parseInt(timeString) * 24 * 60;
                return 0;
            }
            switch (filters.sortBy) {
                case 'distance': return parseFloat(a.distance) - parseFloat(b.distance);
                case 'newest': return getTimeValue(b.posted) - getTimeValue(a.posted);
                case 'oldest': return getTimeValue(a.posted) - getTimeValue(b.posted);
                case 'condition': 
                    const conditionOrder = { 'new': 0, 'gently-used': 1, 'well-used': 2 };
                    return conditionOrder[a.condition] - conditionOrder[b.condition];
                default: return 0;
            }
        });

        return items;
    }, [filters, searchTerm]);
    
    return (
        <div className="pt-16">
            <section className="pt-12 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-4xl font-bold text-primary-green mb-4">Browse Available Items</h1>
                        <p className="text-xl text-gray-600">Find gently-used items from your community</p>
                    </div>
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input w-full px-6 py-4 rounded-full text-lg pr-12" placeholder="Search for items..."/>
                            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-green">
                                <SearchIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <FilterBar onFilterChange={setFilters} />
                        <div className="lg:col-span-3">
                             <p className="text-gray-600 mb-6">Showing <b>{filteredItems.length}</b> items near you</p>
                             {filters?.view === 'grid' ? (
                                <div className="item-grid">
                                    {filteredItems.map(item => <ItemCard key={item.id} item={item} onViewDetails={handleViewDetails} />)}
                                </div>
                             ) : (
                                <MapView items={filteredItems} />
                             )}
                        </div>
                    </div>
                </div>
            </section>

             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedItem && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img src={selectedItem.images[0]} alt={selectedItem.title} className="w-full h-64 object-cover rounded-lg mb-4"/>
                        </div>
                        <div>
                            <div className="flex items-center mb-4">
                                <img src={selectedItem.donor.avatar} alt={selectedItem.donor.name} className="w-12 h-12 rounded-full mr-4"/>
                                <div>
                                    <h4 className="font-bold text-lg">{selectedItem.donor.name}</h4>
                                    <p className="text-sm text-gray-600">⭐ {selectedItem.donor.rating} • {selectedItem.posted}</p>
                                </div>
                            </div>
                            <h2 className="font-display text-3xl font-bold text-primary-green mb-4">{selectedItem.title}</h2>
                             <div className="flex gap-2 mb-4">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                    {selectedItem.condition.replace('-', ' ')}
                                </span>
                                <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {selectedItem.distance}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-6">{selectedItem.description}</p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold mb-2">Pickup Location</h4>
                                <p className="text-gray-600">{selectedItem.location.address}</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="btn-primary px-6 py-3 rounded-lg font-semibold flex-1">Request Item</button>
                                <button className="border-2 border-primary-green text-primary-green px-6 py-3 rounded-lg font-semibold">Message Donor</button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

// ========= NOTIFICATION COMPONENT ========= //
const NotificationToast: React.FC<{ notification: Notification, onClose: () => void }> = ({ notification, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-24 right-5 bg-white rounded-xl shadow-2xl p-4 w-80 z-[2000] animate-fade-in-up">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
                        <BellIcon className="h-6 w-6 text-primary-green" />
                    </div>
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">New Notification</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onClose} className="inline-flex text-gray-400 hover:text-gray-500">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ========= MAIN APP COMPONENT ========= //

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dashboardItems, setDashboardItems] = useState<Item[]>(MOCK_DASHBOARD_ITEMS);
    const chartRef = useRef<any>(null);

    const addNotification = useCallback((message: string) => {
        const newNotification: Notification = { id: Date.now(), message };
        setNotifications(prev => [...prev, newNotification]);
    }, []);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleNavigate = (newView: View) => {
        setView(newView);
        window.scrollTo(0, 0);
    };

    const handleDonationSubmit = (formData: Omit<Item, 'id' | 'images' | 'location' | 'distance' | 'donor' | 'posted' | 'views' | 'requests' | 'status'> & { location: string }) => {
        const newItem: Item = {
            id: Date.now(),
            ...formData,
            images: ["https://picsum.photos/seed/new-item/400/300"],
            location: { lat: 40.7128, lng: -74.0060, address: formData.location },
            distance: "0.1 miles",
            donor: { name: "Michael R.", avatar: "https://i.pravatar.cc/150?u=michael", rating: 4.9 },
            posted: "Just now",
            views: 0,
            requests: 0,
            status: ItemStatus.Available,
        };

        setDashboardItems(prev => [newItem, ...prev]);
        addNotification(`Your item "${newItem.title}" has been listed!`);
        handleNavigate('dashboard');
    };
    
    const initChart = useCallback(() => {
        if (view === 'home' && !chartRef.current) {
            const chartElement = document.getElementById('impact-chart');
            if (chartElement) {
                chartRef.current = echarts.init(chartElement);
                const initialData = {
                    items: [180, 195, 210, 225, 240, 255, 270, 285],
                    families: [12, 13, 14, 15, 16, 17, 18, 19]
                };
                const option = {
                    title: { text: 'Monthly Donations Impact', left: 'center', textStyle: { color: '#2D5A3D', fontSize: 18, fontWeight: 'bold' } },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['Items Donated', 'Families Helped'], bottom: 10 },
                    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
                    yAxis: [ { type: 'value', name: 'Items' }, { type: 'value', name: 'Families' } ],
                    series: [
                        { name: 'Items Donated', type: 'bar', data: initialData.items, itemStyle: { color: '#2D5A3D' } },
                        { name: 'Families Helped', type: 'line', yAxisIndex: 1, data: initialData.families, itemStyle: { color: '#FF6B6B' } }
                    ]
                };
                chartRef.current.setOption(option);

                // Simulate real-time updates
                const interval = setInterval(() => {
                    initialData.items.push(initialData.items[initialData.items.length - 1] + Math.floor(Math.random() * 10));
                    initialData.families.push(initialData.families[initialData.families.length - 1] + Math.floor(Math.random() * 2));
                    initialData.items.shift();
                    initialData.families.shift();
                    chartRef.current.setOption({
                        series: [
                            { data: initialData.items },
                            { data: initialData.families }
                        ]
                    });
                }, 3000);
                
                return () => clearInterval(interval);
            }
        }
    }, [view]);

    useEffect(() => {
       const cleanupChart = initChart();
       
       if (view === 'home') {
           const splideEl = document.getElementById('featured-carousel');
           if (splideEl && !(splideEl as any).splide) { // check if splide is not already initialized
               new Splide('#featured-carousel', { 
                   type: 'loop', 
                   perPage: 3, 
                   gap: '2rem',
                   autoplay: true,
                   interval: 4000,
                   pauseOnHover: true,
                   breakpoints: { 1024: { perPage: 2 }, 768: { perPage: 1 } } 
                }).mount();
           }
       }

       return () => {
            if (cleanupChart) cleanupChart();
            if (chartRef.current && chartRef.current.dispose) {
               chartRef.current.dispose();
               chartRef.current = null;
           }
       };

    }, [view, initChart]);

    const Footer = () => (
         <footer className="bg-primary-green text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 className="font-display text-2xl font-bold mb-4">GiveAwayHub</h3>
                <p className="text-lg mb-6">Connecting communities through the power of giving</p>
                <p className="text-sm opacity-75">© 2024 GiveAwayHub. All rights reserved.</p>
            </div>
        </footer>
    );

    const CommunityStoryCard = ({ avatar, name, role, story }: { avatar: string, name: string, role: string, story: string }) => (
        <div className="card-hover bg-gray-50 rounded-2xl p-8">
            <div className="flex items-center mb-6">
                <img src={avatar} alt={name} className="w-16 h-16 rounded-full mr-4"/>
                <div>
                    <h4 className="font-bold text-lg">{name}</h4>
                    <p className="text-gray-600">{role}</p>
                </div>
            </div>
            <p className="text-gray-700 italic">"{story}"</p>
        </div>
    );

    const renderView = () => {
        switch (view) {
            case 'browse':
                return <BrowsePage />;
            case 'dashboard':
                return <Dashboard items={dashboardItems} setItems={setDashboardItems} addNotification={addNotification} onNavigate={handleNavigate} />;
            case 'donate':
                 return <DonationForm onDonate={handleDonationSubmit} />;
            case 'home':
            default:
                return (
                    <>
                        <Hero onDonateNow={() => handleNavigate('donate')} onFindItems={() => handleNavigate('browse')} />
                        <ImpactStats />
                        <section className="py-20 bg-white">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="text-center mb-12">
                                    <h2 className="font-display text-4xl font-bold text-primary-green mb-4">Recently Added Items</h2>
                                </div>
                                <div className="splide" id="featured-carousel">
                                    <div className="splide__track">
                                        <ul className="splide__list">
                                          {MOCK_ITEMS.slice(0,5).map(item => (
                                            <li key={item.id} className="splide__slide p-2">
                                                <ItemCard item={item} onViewDetails={() => { handleNavigate('browse'); }} />
                                            </li>
                                          ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="py-20 bg-gray-50">
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="text-center mb-16">
                                  <h2 className="font-display text-4xl font-bold text-primary-green mb-4">Stories from Our Community</h2>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <CommunityStoryCard name="Sarah M." role="Donor since 2022" avatar="https://i.pravatar.cc/150?u=sarah" story="I've donated over 50 items and received heartfelt thank you messages from families. It's amazing to see how my children's outgrown clothes can bring joy to others."/>
                                <CommunityStoryCard name="Maria L." role="Recipient" avatar="https://i.pravatar.cc/150?u=maria" story="As a single mom, this platform has been a lifesaver. My kids have warm coats for winter and books to read. The generosity of this community is incredible."/>
                                <CommunityStoryCard name="Robert K." role="Volunteer Coordinator" avatar="https://i.pravatar.cc/150?u=robert" story="Coordinating pickups between donors and recipients has shown me the best of humanity. People genuinely want to help each other."/>
                              </div>
                          </div>
                        </section>
                    </>
                );
        }
    };

    return (
        <>
            <Header onNavigate={handleNavigate} />
            <main>
                {renderView()}
            </main>
            <Footer />
            <div className="fixed top-0 right-0 z-[2000] p-4 space-y-4">
              {notifications.map(notification => (
                  <NotificationToast key={notification.id} notification={notification} onClose={() => removeNotification(notification.id)} />
              ))}
            </div>
        </>
    );
};

export default App;