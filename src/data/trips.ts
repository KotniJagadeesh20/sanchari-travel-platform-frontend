import ootyImg from "@/assets/ooty.jpg";
import goaImg from "@/assets/goa.jpg";
import coorgImg from "@/assets/coorg.jpg";
import kashmirImg from "@/assets/kashmir.jpg";
import manaliImg from "@/assets/manali.jpg";
import rajasthanImg from "@/assets/rajasthan.jpg";

export interface Place {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface Trip {
  id: string;
  name: string;
  image: string;
  description: string;
  bestTime: string;
  duration: string;
  places: Place[];
}

export interface Package {
  id: string;
  tripId: string;
  title: string;
  price: number;
  duration: string;
  planner: string;
  places: string[];
  popular: boolean;
  description: string;
  features: string[];
  priceBreakdown: { item: string; cost: number }[];
}

export const trips: Trip[] = [
  {
    id: "ooty",
    name: "Ooty",
    image: ootyImg,
    description: "The Queen of Hill Stations — misty hills, tea gardens, and cool breeze await.",
    bestTime: "October – June",
    duration: "3–5 Days",
    places: [
      { id: "ooty-lake", name: "Ooty Lake", image: ootyImg, description: "A serene lake perfect for boating amid lush greenery." },
      { id: "botanical-garden", name: "Botanical Garden", image: ootyImg, description: "Home to over 1,000 species of plants and a fossilized tree." },
      { id: "doddabetta", name: "Doddabetta Peak", image: ootyImg, description: "The highest peak in the Nilgiris at 2,637 meters." },
      { id: "tea-factory", name: "Tea Factory", image: ootyImg, description: "Watch tea being processed and enjoy fresh Nilgiri tea." },
    ],
  },
  {
    id: "goa",
    name: "Goa",
    image: goaImg,
    description: "Sun, sand, and vibrant nightlife — India's party capital on the coast.",
    bestTime: "November – February",
    duration: "4–7 Days",
    places: [
      { id: "baga-beach", name: "Baga Beach", image: goaImg, description: "Famous for water sports, nightlife, and beachside shacks." },
      { id: "fort-aguada", name: "Fort Aguada", image: goaImg, description: "A 17th-century Portuguese fort with panoramic ocean views." },
      { id: "dudhsagar", name: "Dudhsagar Falls", image: goaImg, description: "A majestic four-tiered waterfall on the Mandovi River." },
      { id: "old-goa", name: "Old Goa Churches", image: goaImg, description: "UNESCO heritage churches with stunning baroque architecture." },
    ],
  },
  {
    id: "coorg",
    name: "Coorg",
    image: coorgImg,
    description: "The Scotland of India — coffee plantations, waterfalls, and misty mountains.",
    bestTime: "October – March",
    duration: "3–4 Days",
    places: [
      { id: "abbey-falls", name: "Abbey Falls", image: coorgImg, description: "A beautiful waterfall surrounded by coffee and spice plantations." },
      { id: "raja-seat", name: "Raja's Seat", image: coorgImg, description: "A scenic viewpoint where kings once watched sunsets." },
      { id: "talacauvery", name: "Talacauvery", image: coorgImg, description: "The sacred origin of the river Cauvery." },
      { id: "namdroling", name: "Namdroling Monastery", image: coorgImg, description: "A stunning Tibetan Buddhist monastery with golden statues." },
    ],
  },
  {
    id: "kashmir",
    name: "Kashmir",
    image: kashmirImg,
    description: "Paradise on Earth — snow-capped peaks, houseboats, and blooming gardens.",
    bestTime: "March – October",
    duration: "5–7 Days",
    places: [
      { id: "dal-lake", name: "Dal Lake", image: kashmirImg, description: "Iconic lake with shikaras and floating markets." },
      { id: "gulmarg", name: "Gulmarg", image: kashmirImg, description: "Asia's highest gondola ride and pristine ski slopes." },
      { id: "pahalgam", name: "Pahalgam", image: kashmirImg, description: "Valley of Shepherds — perfect for trekking and fishing." },
      { id: "mughal-gardens", name: "Mughal Gardens", image: kashmirImg, description: "Terraced gardens with fountains and Chinar trees." },
    ],
  },
  {
    id: "manali",
    name: "Manali",
    image: manaliImg,
    description: "Adventure awaits — snow peaks, river rafting, and mountain passes.",
    bestTime: "October – June",
    duration: "4–6 Days",
    places: [
      { id: "rohtang", name: "Rohtang Pass", image: manaliImg, description: "A high mountain pass with breathtaking snow views." },
      { id: "solang", name: "Solang Valley", image: manaliImg, description: "Adventure hub for paragliding, skiing, and zorbing." },
      { id: "hadimba", name: "Hadimba Temple", image: manaliImg, description: "An ancient cave temple surrounded by cedar forests." },
      { id: "old-manali", name: "Old Manali", image: manaliImg, description: "Charming village with cafes, shops, and river views." },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    image: rajasthanImg,
    description: "Royal heritage — majestic forts, golden deserts, and vibrant culture.",
    bestTime: "October – March",
    duration: "7–10 Days",
    places: [
      { id: "jaipur", name: "Jaipur", image: rajasthanImg, description: "The Pink City — Amber Fort, Hawa Mahal, and City Palace." },
      { id: "udaipur", name: "Udaipur", image: rajasthanImg, description: "City of Lakes with romantic palaces and sunset views." },
      { id: "jaisalmer", name: "Jaisalmer", image: rajasthanImg, description: "The Golden City with desert safaris and sand dunes." },
      { id: "jodhpur", name: "Jodhpur", image: rajasthanImg, description: "The Blue City with the mighty Mehrangarh Fort." },
    ],
  },
];

export const packages: Package[] = [
  // Ooty
  { id: "ooty-1", tripId: "ooty", title: "Ooty Heritage Explorer", price: 8999, duration: "3 Days / 2 Nights", planner: "Wanderlust Travels", places: ["Ooty Lake", "Botanical Garden", "Tea Factory"], popular: true, description: "Experience the charm of Ooty's colonial heritage with guided tours of botanical wonders and tea estates.", features: ["Hotel stay", "Breakfast included", "Guided tours", "Transport included"], priceBreakdown: [{ item: "Accommodation", cost: 4000 }, { item: "Transport", cost: 2000 }, { item: "Entry fees & Guide", cost: 1500 }, { item: "Meals", cost: 1499 }] },
  { id: "ooty-2", tripId: "ooty", title: "Nilgiri Adventure Pack", price: 12499, duration: "4 Days / 3 Nights", planner: "Peak Adventures", places: ["Doddabetta Peak", "Ooty Lake", "Tea Factory", "Botanical Garden"], popular: false, description: "Trek to Doddabetta, explore tea factories, and enjoy the scenic beauty of the Nilgiris.", features: ["Resort stay", "All meals", "Trekking gear", "Personal guide"], priceBreakdown: [{ item: "Resort", cost: 6000 }, { item: "Transport", cost: 2500 }, { item: "Activities", cost: 2000 }, { item: "Meals", cost: 1999 }] },
  { id: "ooty-3", tripId: "ooty", title: "Romantic Ooty Getaway", price: 15999, duration: "3 Days / 2 Nights", planner: "Couple Escapes", places: ["Ooty Lake", "Botanical Garden"], popular: true, description: "A romantic escape with candlelit dinners, lake boating, and garden walks.", features: ["Premium resort", "Candlelit dinner", "Private boat ride", "Spa session"], priceBreakdown: [{ item: "Premium Resort", cost: 8000 }, { item: "Experiences", cost: 4000 }, { item: "Dining", cost: 2500 }, { item: "Transport", cost: 1499 }] },
  // Goa
  { id: "goa-1", tripId: "goa", title: "Goa Beach Bliss", price: 11999, duration: "5 Days / 4 Nights", planner: "Beach Bums Co.", places: ["Baga Beach", "Fort Aguada", "Old Goa Churches"], popular: true, description: "Soak in the sun with beach parties, historical forts, and Goan cuisine.", features: ["Beach resort", "Water sports", "Nightlife tour", "Breakfast"], priceBreakdown: [{ item: "Beach Resort", cost: 5500 }, { item: "Water Sports", cost: 2500 }, { item: "Tours", cost: 2000 }, { item: "Meals", cost: 1999 }] },
  { id: "goa-2", tripId: "goa", title: "Adventure Goa", price: 14999, duration: "4 Days / 3 Nights", planner: "Thrill Seekers", places: ["Dudhsagar Falls", "Baga Beach", "Fort Aguada"], popular: false, description: "Jeep safari to Dudhsagar, water sports at Baga, and fort exploration.", features: ["All transport", "Jeep safari", "Scuba diving", "All meals"], priceBreakdown: [{ item: "Accommodation", cost: 5000 }, { item: "Jeep Safari", cost: 3500 }, { item: "Water Sports", cost: 3500 }, { item: "Meals", cost: 2999 }] },
  // Coorg
  { id: "coorg-1", tripId: "coorg", title: "Coorg Coffee Trail", price: 9499, duration: "3 Days / 2 Nights", planner: "Green Escapes", places: ["Abbey Falls", "Raja's Seat", "Talacauvery"], popular: true, description: "Walk through aromatic coffee plantations, witness waterfalls, and enjoy misty sunsets.", features: ["Homestay", "Coffee tour", "Nature walks", "Local cuisine"], priceBreakdown: [{ item: "Homestay", cost: 3500 }, { item: "Activities", cost: 2500 }, { item: "Transport", cost: 2000 }, { item: "Meals", cost: 1499 }] },
  { id: "coorg-2", tripId: "coorg", title: "Spiritual Coorg", price: 7999, duration: "2 Days / 1 Night", planner: "Soul Journeys", places: ["Namdroling Monastery", "Talacauvery", "Raja's Seat"], popular: false, description: "A spiritual journey through monasteries and sacred rivers.", features: ["Hotel stay", "Guided meditation", "Temple visits", "Vegetarian meals"], priceBreakdown: [{ item: "Hotel", cost: 3000 }, { item: "Transport", cost: 2000 }, { item: "Guide", cost: 1500 }, { item: "Meals", cost: 1499 }] },
  // Kashmir
  { id: "kashmir-1", tripId: "kashmir", title: "Kashmir Paradise Tour", price: 24999, duration: "6 Days / 5 Nights", planner: "Himalayan Dreams", places: ["Dal Lake", "Gulmarg", "Pahalgam", "Mughal Gardens"], popular: true, description: "The complete Kashmir experience — houseboats, gondola rides, and garden walks.", features: ["Houseboat + Hotel", "Shikara ride", "Gondola ticket", "All meals"], priceBreakdown: [{ item: "Houseboat & Hotels", cost: 12000 }, { item: "Transport", cost: 5000 }, { item: "Activities", cost: 4500 }, { item: "Meals", cost: 3499 }] },
  { id: "kashmir-2", tripId: "kashmir", title: "Kashmir Adventure Trek", price: 18999, duration: "5 Days / 4 Nights", planner: "Peak Adventures", places: ["Gulmarg", "Pahalgam"], popular: false, description: "Trekking, skiing, and horse riding through Kashmir's stunning valleys.", features: ["Camping + Hotel", "Trek gear", "Horse riding", "Meals included"], priceBreakdown: [{ item: "Accommodation", cost: 7000 }, { item: "Trek equipment", cost: 4000 }, { item: "Activities", cost: 5000 }, { item: "Meals", cost: 2999 }] },
  // Manali
  { id: "manali-1", tripId: "manali", title: "Manali Snow Adventure", price: 13999, duration: "5 Days / 4 Nights", planner: "Snow Peaks Travel", places: ["Rohtang Pass", "Solang Valley", "Old Manali"], popular: true, description: "Snow activities, river adventures, and mountain charm in one package.", features: ["Hotel stay", "Rohtang permit", "Paragliding", "All meals"], priceBreakdown: [{ item: "Hotel", cost: 5500 }, { item: "Transport & Permits", cost: 3500 }, { item: "Activities", cost: 3000 }, { item: "Meals", cost: 1999 }] },
  // Rajasthan
  { id: "rajasthan-1", tripId: "rajasthan", title: "Royal Rajasthan Circuit", price: 29999, duration: "8 Days / 7 Nights", planner: "Heritage India Tours", places: ["Jaipur", "Udaipur", "Jaisalmer", "Jodhpur"], popular: true, description: "A grand tour of Rajasthan's most iconic cities, forts, and palaces.", features: ["Heritage hotels", "Desert safari", "Cultural shows", "All meals & transport"], priceBreakdown: [{ item: "Heritage Hotels", cost: 14000 }, { item: "Transport", cost: 6000 }, { item: "Activities", cost: 5500 }, { item: "Meals", cost: 4499 }] },
  { id: "rajasthan-2", tripId: "rajasthan", title: "Jaipur & Udaipur Escape", price: 16999, duration: "5 Days / 4 Nights", planner: "Royal Getaways", places: ["Jaipur", "Udaipur"], popular: false, description: "Explore the Pink City's forts and the romantic lakes of Udaipur.", features: ["Boutique hotels", "Guided tours", "Boat ride", "Breakfast"], priceBreakdown: [{ item: "Hotels", cost: 8000 }, { item: "Transport", cost: 3500 }, { item: "Tours & Activities", cost: 3500 }, { item: "Meals", cost: 1999 }] },
];

export const getTrip = (id: string) => trips.find((t) => t.id === id);
export const getPackagesForTrip = (tripId: string) => packages.filter((p) => p.tripId === tripId);
export const getPackage = (id: string) => packages.find((p) => p.id === id);
export const getPlace = (tripId: string, placeId: string) => {
  const trip = getTrip(tripId);
  return trip?.places.find((p) => p.id === placeId);
};
