import { Item, ItemCategory, ItemCondition, ItemStatus, DashboardRequest, RequestStatus, Conversation } from './types';

export const CATEGORIES = Object.values(ItemCategory);
export const CONDITIONS = Object.values(ItemCondition);

export const MOCK_ITEMS: Item[] = [
    {
        id: 1,
        title: "Winter Coats Collection",
        category: ItemCategory.Clothing,
        condition: ItemCondition.GentlyUsed,
        description: "5 warm winter coats, various sizes including children's sizes. All in excellent condition, recently cleaned.",
        images: ["https://picsum.photos/seed/coats/400/300"],
        location: { lat: 40.7128, lng: -74.0060, address: "Manhattan, NY" },
        distance: "1.2 miles",
        donor: { name: "Sarah M.", avatar: "https://i.pravatar.cc/150?u=sarah", rating: 4.8 },
        posted: "2 hours ago",
        views: 23,
        requests: 3
    },
    {
        id: 2,
        title: "Children's Books Bundle",
        category: ItemCategory.Books,
        condition: ItemCondition.GentlyUsed,
        description: "25 assorted children's books, ages 3-8. Includes picture books, early readers, and educational materials.",
        images: ["https://picsum.photos/seed/books2/400/300"],
        location: { lat: 40.7589, lng: -73.9851, address: "Upper West Side, NY" },
        distance: "2.1 miles",
        donor: { name: "Michael R.", avatar: "https://i.pravatar.cc/150?u=michael", rating: 4.9 },
        posted: "4 hours ago",
        views: 45,
        requests: 7
    },
    {
        id: 3,
        title: "Dining Table & Chairs Set",
        category: ItemCategory.Furniture,
        condition: ItemCondition.WellUsed,
        description: "Solid wood dining table with 6 chairs. Some minor scratches but structurally sound. Perfect for family meals.",
        images: ["https://picsum.photos/seed/table/400/300"],
        location: { lat: 40.7282, lng: -73.7949, address: "Queens, NY" },
        distance: "3.5 miles",
        donor: { name: "Lisa K.", avatar: "https://i.pravatar.cc/150?u=lisa", rating: 4.7 },
        posted: "6 hours ago",
        views: 12,
        requests: 2
    },
    {
        id: 4,
        title: "Baby Clothes & Toys",
        category: ItemCategory.Toys,
        condition: ItemCondition.New,
        description: "New baby clothes (0-12 months) and developmental toys. Items were gifts but never used.",
        images: ["https://picsum.photos/seed/baby/400/300"],
        location: { lat: 40.7505, lng: -73.9934, address: "Midtown, NY" },
        distance: "0.8 miles",
        donor: { name: "Jennifer L.", avatar: "https://i.pravatar.cc/150?u=jennifer", rating: 5.0 },
        posted: "8 hours ago",
        views: 67,
        requests: 12
    },
    {
        id: 5,
        title: "Kitchen Appliance Set",
        category: ItemCategory.Kitchen,
        condition: ItemCondition.GentlyUsed,
        description: "Blender, toaster, and coffee maker. All working perfectly, just upgrading to newer models.",
        images: ["https://picsum.photos/seed/kitchen/400/300"],
        location: { lat: 40.7614, lng: -73.9776, address: "Upper East Side, NY" },
        distance: "2.8 miles",
        donor: { name: "David P.", avatar: "https://i.pravatar.cc/150?u=david", rating: 4.6 },
        posted: "12 hours ago",
        views: 34,
        requests: 5
    },
    {
        id: 6,
        title: "Textbook Collection",
        category: ItemCategory.Books,
        condition: ItemCondition.WellUsed,
        description: "College textbooks - Biology, Chemistry, Mathematics. Some highlighting but still very usable for reference.",
        images: ["https://picsum.photos/seed/textbooks/400/300"],
        location: { lat: 40.7831, lng: -73.9712, address: "Upper Manhattan, NY" },
        distance: "4.2 miles",
        donor: { name: "Amanda S.", avatar: "https://i.pravatar.cc/150?u=amanda", rating: 4.5 },
        posted: "1 day ago",
        views: 28,
        requests: 4
    },
    {
      id: 7,
      title: "Mountain Bike",
      category: ItemCategory.Sports,
      condition: ItemCondition.GentlyUsed,
      description: "A 21-speed mountain bike, suitable for trails and city riding. Recently tuned up.",
      images: ["https://picsum.photos/seed/bike/400/300"],
      location: { lat: 40.6782, lng: -73.9442, address: "Brooklyn, NY" },
      distance: "5.5 miles",
      donor: { name: "Chris B.", avatar: "https://i.pravatar.cc/150?u=chris", rating: 4.9 },
      posted: "1 day ago",
      views: 50,
      requests: 8
    }
];

export const MOCK_DASHBOARD_ITEMS: Item[] = [
    { ...MOCK_ITEMS[0], id: 101, status: ItemStatus.Available, requests: 3, views: 23, posted: "2 days ago" },
    { ...MOCK_ITEMS[1], id: 102, status: ItemStatus.Pending, requests: 7, views: 45, posted: "5 days ago" },
    { ...MOCK_ITEMS[2], id: 103, status: ItemStatus.Donated, requests: 2, views: 12, posted: "1 week ago" }
];

export const MOCK_DASHBOARD_REQUESTS: DashboardRequest[] = [
    {
        id: 1,
        item: "Baby Clothes & Toys",
        donor: "Jennifer L.",
        status: RequestStatus.Pending,
        requested: "3 days ago",
        image: "https://picsum.photos/seed/baby/400/300"
    },
    {
        id: 2,
        item: "Kitchen Appliance Set",
        donor: "David P.",
        status: RequestStatus.Approved,
        requested: "1 week ago",
        image: "https://picsum.photos/seed/kitchen/400/300"
    },
    {
        id: 3,
        item: "Textbook Collection",
        donor: "Amanda S.",
        status: RequestStatus.Completed,
        requested: "2 weeks ago",
        image: "https://picsum.photos/seed/textbooks/400/300"
    }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 1,
        name: "Sarah M.",
        lastMessage: "Hi! When can I pick up the coats?",
        time: "2 hours ago",
        unread: true,
        avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        id: 2,
        name: "Lisa K.",
        lastMessage: "Thank you for the dining set!",
        time: "1 day ago",
        unread: false,
        avatar: "https://i.pravatar.cc/150?u=lisa"
    }
];
