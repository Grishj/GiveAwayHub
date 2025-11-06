import { Item, ItemCategory, ItemCondition, ItemStatus, DashboardRequest, RequestStatus, Conversation, ChatMessage, Requester, ItemRequest } from './types';

export const CATEGORIES = Object.values(ItemCategory);
export const CONDITIONS = Object.values(ItemCondition);

export const CURRENT_USER: Requester = {
  name: "Jane Doe",
  phone: "+1 (555) 987-6543",
  avatar: "https://i.pravatar.cc/150?u=janedoe",
  address: "456 Oak Avenue, Brooklyn, NY 11201",
  email: "jane.doe@example.com",
};

const MOCK_REQUESTERS: Requester[] = [
    { name: "Alex Johnson", phone: "+1 (555) 111-2222", avatar: "https://i.pravatar.cc/150?u=alex", address: "123 Pine Street, Manhattan, NY 10001", email: "alex@example.com" },
    { name: "Maria Garcia", phone: "+1 (555) 333-4444", avatar: "https://i.pravatar.cc/150?u=mariag", address: "789 Maple Drive, Queens, NY 11354", email: "maria@example.com" },
];

const MOCK_ITEM_REQUESTS: ItemRequest[] = [
    { id: 1001, requester: MOCK_REQUESTERS[0], date: "2024-07-28T14:30:00Z", requestAddress: "123 Pine Street, Manhattan, NY 10001" },
    { id: 1002, requester: MOCK_REQUESTERS[1], date: "2024-07-29T09:15:00Z", requestAddress: "789 Maple Drive, Queens, NY 11354" },
];

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
        requests: 2,
        itemRequests: MOCK_ITEM_REQUESTS,
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
        requests: 12,
        itemRequests: [
          { id: 1003, requester: MOCK_REQUESTERS[0], date: "2024-07-29T11:00:00Z", requestAddress: "123 Pine Street, Manhattan, NY 10001" }
        ],
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
    { ...MOCK_ITEMS[0], id: 101, status: ItemStatus.Available, requests: 2, views: 23, posted: "2 days ago", itemRequests: MOCK_ITEM_REQUESTS },
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

export const MOCK_MESSAGES: { [key: number]: ChatMessage[] } = {
  1: [
    { id: 1, text: "Hi! When can I pick up the coats?", sender: "Sarah M.", timestamp: "10:30 AM" },
    { id: 2, text: "Hi Sarah! How about tomorrow afternoon around 2 PM?", sender: "me", timestamp: "10:32 AM" },
    { id: 3, text: "That works for me! See you then.", sender: "Sarah M.", timestamp: "10:33 AM" },
    { id: 4, text: "Perfect. I'll have them ready for you.", sender: "me", timestamp: "10:34 AM" }
  ],
  2: [
    { id: 1, text: "Thank you for the dining set!", sender: "Lisa K.", timestamp: "Yesterday" },
    { id: 2, text: "You're very welcome, Lisa! I'm glad it found a new home.", sender: "me", timestamp: "Yesterday" },
    { id: 3, text: "It's perfect for our family. We really appreciate it!", sender: "Lisa K.", timestamp: "Yesterday" }
  ]
};