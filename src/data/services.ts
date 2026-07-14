import goaImg from "@/assets/goa.jpg";
import manaliImg from "@/assets/manali.jpg";
import kashmirImg from "@/assets/kashmir.jpg";
import coorgImg from "@/assets/coorg.jpg";
import ootyImg from "@/assets/ooty.jpg";
import rajasthanImg from "@/assets/rajasthan.jpg";

export type ServiceCategory = "Stays" | "Transport" | "Food" | "Guides";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  image: string;
  location: string;
  price: string;
  rating: number;
  description: string;
  contact: string;
  features: string[];
}

export const services: Service[] = [
  // Stays
  {
    id: "svc-1",
    name: "Misty Meadows Homestay",
    category: "Stays",
    image: coorgImg,
    location: "Coorg",
    price: "₹2,500/night",
    rating: 4.8,
    description:
      "A cozy homestay nestled in Coorg's coffee plantations. Wake up to misty mountain views, enjoy homemade Coorgi cuisine, and relax by the bonfire.",
    contact: "+91 98765 43210",
    features: ["Free WiFi", "Breakfast included", "Bonfire", "Coffee tour"],
  },
  {
    id: "svc-2",
    name: "Beachside Resort Goa",
    category: "Stays",
    image: goaImg,
    location: "Goa",
    price: "₹4,200/night",
    rating: 4.5,
    description:
      "Steps from Baga Beach — pool, sea-view rooms, and a rooftop restaurant with live music every evening.",
    contact: "+91 99887 65432",
    features: ["Pool", "Sea view", "Restaurant", "Live music"],
  },
  {
    id: "svc-3",
    name: "Dal Lake Houseboat",
    category: "Stays",
    image: kashmirImg,
    location: "Kashmir",
    price: "₹5,500/night",
    rating: 4.9,
    description:
      "A traditional Kashmiri houseboat on Dal Lake with carved walnut interiors, Shikara rides, and Wazwan meals.",
    contact: "+91 94567 12345",
    features: ["Shikara ride", "Wazwan dinner", "Lake view", "Heritage decor"],
  },
  {
    id: "svc-4",
    name: "Mountain View Hotel",
    category: "Stays",
    image: manaliImg,
    location: "Manali",
    price: "₹3,000/night",
    rating: 4.3,
    description:
      "A charming hotel in Old Manali with pine-forest views, a riverside garden, and warm hospitality.",
    contact: "+91 98123 45678",
    features: ["River view", "Garden", "Room heater", "Parking"],
  },
  // Transport
  {
    id: "svc-5",
    name: "Royal Rides Rajasthan",
    category: "Transport",
    image: rajasthanImg,
    location: "Rajasthan",
    price: "₹3,500/day",
    rating: 4.6,
    description:
      "AC SUVs and vintage jeeps for your Rajasthan circuit. Experienced drivers who double as local guides.",
    contact: "+91 97654 32100",
    features: ["AC vehicle", "Driver-guide", "Inter-city", "24/7 support"],
  },
  {
    id: "svc-6",
    name: "Goa Bike Rentals",
    category: "Transport",
    image: goaImg,
    location: "Goa",
    price: "₹500/day",
    rating: 4.4,
    description:
      "Scooty, Bullet, and Activa rentals delivered to your hotel. Helmets included, GPS optional.",
    contact: "+91 98765 11223",
    features: ["Delivery", "Helmet included", "GPS available", "Insurance"],
  },
  {
    id: "svc-7",
    name: "Manali Tempo Traveller",
    category: "Transport",
    image: manaliImg,
    location: "Manali",
    price: "₹6,000/day",
    rating: 4.2,
    description:
      "12-seater tempo travellers for group road trips. Perfect for Delhi-Manali routes with experienced hill drivers.",
    contact: "+91 99001 22334",
    features: ["12-seater", "Hill driver", "Music system", "Luggage space"],
  },
  // Food
  {
    id: "svc-8",
    name: "Spice Garden Restaurant",
    category: "Food",
    image: coorgImg,
    location: "Coorg",
    price: "₹800/meal",
    rating: 4.7,
    description:
      "Authentic Coorgi cuisine — pandi curry, akki roti, and bamboo shoot dishes in a plantation-side setting.",
    contact: "+91 94321 56789",
    features: ["Local cuisine", "Plantation view", "Veg options", "Group dining"],
  },
  {
    id: "svc-9",
    name: "Fisherman's Wharf",
    category: "Food",
    image: goaImg,
    location: "Goa",
    price: "₹1,200/meal",
    rating: 4.6,
    description:
      "Fresh seafood with river views. Known for Goan fish curry, prawn balchão, and bebinca dessert.",
    contact: "+91 98765 98765",
    features: ["Seafood", "River view", "Live music", "Bar"],
  },
  {
    id: "svc-10",
    name: "Chai & Chapati – Ooty",
    category: "Food",
    image: ootyImg,
    location: "Ooty",
    price: "₹400/meal",
    rating: 4.3,
    description:
      "Cozy hill station café with Nilgiri tea, fresh baked goods, and simple Indian meals with mountain views.",
    contact: "+91 94567 00112",
    features: ["Nilgiri tea", "Bakery", "Mountain view", "Budget-friendly"],
  },
  // Guides
  {
    id: "svc-11",
    name: "Kashmir Heritage Walks",
    category: "Guides",
    image: kashmirImg,
    location: "Kashmir",
    price: "₹2,000/day",
    rating: 4.8,
    description:
      "Local Kashmiri guides who take you beyond tourist spots — through old Srinagar lanes, artisan workshops, and hidden gardens.",
    contact: "+91 97654 55667",
    features: ["Local expert", "Heritage focus", "Photography spots", "Flexible hours"],
  },
  {
    id: "svc-12",
    name: "Rajasthan Cultural Guide",
    category: "Guides",
    image: rajasthanImg,
    location: "Rajasthan",
    price: "₹2,500/day",
    rating: 4.7,
    description:
      "Expert guides for fort tours, desert expeditions, and cultural immersions across Rajasthan's royal cities.",
    contact: "+91 98001 33445",
    features: ["Multi-city", "Fort specialist", "Desert safari", "Multi-lingual"],
  },
];

export const getService = (id: string) => services.find((s) => s.id === id);
