import goaImg from "@/assets/goa.jpg";
import manaliImg from "@/assets/manali.jpg";
import rajasthanImg from "@/assets/rajasthan.jpg";
import kashmirImg from "@/assets/kashmir.jpg";
import coorgImg from "@/assets/coorg.jpg";
import ootyImg from "@/assets/ooty.jpg";

export interface TroopMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Troop {
  id: string;
  destination: string;
  image: string;
  dates: string;
  type: "Road Trip" | "Backpacking" | "Group Trip" | "Weekend Getaway";
  description: string;
  maxMembers: number;
  members: TroopMember[];
  organizer: string;
}

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

export const troops: Troop[] = [
  {
    id: "troop-1",
    destination: "Goa",
    image: goaImg,
    dates: "May 15 – May 20, 2026",
    type: "Group Trip",
    description:
      "Beach vibes, sunset parties, and water sports with an amazing group of travel lovers. We'll explore North and South Goa, try local cuisine, and create unforgettable memories.",
    maxMembers: 12,
    members: [
      { id: "m1", name: "Arjun K", avatar: avatarUrl("arjun") },
      { id: "m2", name: "Priya S", avatar: avatarUrl("priya") },
      { id: "m3", name: "Rahul M", avatar: avatarUrl("rahul") },
      { id: "m4", name: "Sneha D", avatar: avatarUrl("sneha") },
      { id: "m5", name: "Vikram R", avatar: avatarUrl("vikram") },
      { id: "m6", name: "Ananya P", avatar: avatarUrl("ananya") },
      { id: "m7", name: "Karthik N", avatar: avatarUrl("karthik") },
    ],
    organizer: "Arjun K",
  },
  {
    id: "troop-2",
    destination: "Manali",
    image: manaliImg,
    dates: "Jun 1 – Jun 7, 2026",
    type: "Road Trip",
    description:
      "An epic road trip from Delhi to Manali through winding mountain roads! We'll stop at Solang Valley, hit Rohtang Pass, and explore Old Manali cafes.",
    maxMembers: 8,
    members: [
      { id: "m8", name: "Deepak T", avatar: avatarUrl("deepak") },
      { id: "m9", name: "Meera J", avatar: avatarUrl("meera") },
      { id: "m10", name: "Sanjay V", avatar: avatarUrl("sanjay") },
      { id: "m11", name: "Nisha K", avatar: avatarUrl("nisha") },
    ],
    organizer: "Deepak T",
  },
  {
    id: "troop-3",
    destination: "Kashmir",
    image: kashmirImg,
    dates: "Jul 10 – Jul 17, 2026",
    type: "Backpacking",
    description:
      "Backpack through paradise — from Dal Lake houseboats to Pahalgam meadows and Gulmarg gondola rides. Minimal luggage, maximum adventure.",
    maxMembers: 6,
    members: [
      { id: "m12", name: "Aditya S", avatar: avatarUrl("aditya") },
      { id: "m13", name: "Kavya R", avatar: avatarUrl("kavya") },
    ],
    organizer: "Aditya S",
  },
  {
    id: "troop-4",
    destination: "Rajasthan",
    image: rajasthanImg,
    dates: "Aug 5 – Aug 12, 2026",
    type: "Group Trip",
    description:
      "Explore the royal heritage of Rajasthan — from Jaipur's forts to Jaisalmer's golden dunes. Desert camping, cultural shows, and royal cuisines await!",
    maxMembers: 15,
    members: [
      { id: "m14", name: "Rohan B", avatar: avatarUrl("rohan") },
      { id: "m15", name: "Isha G", avatar: avatarUrl("isha") },
      { id: "m16", name: "Amit P", avatar: avatarUrl("amit") },
      { id: "m17", name: "Pooja L", avatar: avatarUrl("pooja") },
      { id: "m18", name: "Varun K", avatar: avatarUrl("varun") },
      { id: "m19", name: "Divya M", avatar: avatarUrl("divya") },
      { id: "m20", name: "Nikhil S", avatar: avatarUrl("nikhil") },
      { id: "m21", name: "Ritika A", avatar: avatarUrl("ritika") },
      { id: "m22", name: "Suresh T", avatar: avatarUrl("suresh") },
      { id: "m23", name: "Tanvi R", avatar: avatarUrl("tanvi") },
    ],
    organizer: "Rohan B",
  },
  {
    id: "troop-5",
    destination: "Coorg",
    image: coorgImg,
    dates: "Apr 25 – Apr 28, 2026",
    type: "Weekend Getaway",
    description:
      "A chill weekend in the misty hills of Coorg. Coffee plantations, Abbey Falls, and bonfires under the stars. Perfect for unwinding.",
    maxMembers: 10,
    members: [
      { id: "m24", name: "Lakshmi N", avatar: avatarUrl("lakshmi") },
      { id: "m25", name: "Ganesh R", avatar: avatarUrl("ganesh") },
      { id: "m26", name: "Swathi K", avatar: avatarUrl("swathi") },
      { id: "m27", name: "Harish M", avatar: avatarUrl("harish") },
      { id: "m28", name: "Revathi S", avatar: avatarUrl("revathi") },
      { id: "m29", name: "Prasad D", avatar: avatarUrl("prasad") },
    ],
    organizer: "Lakshmi N",
  },
  {
    id: "troop-6",
    destination: "Ooty",
    image: ootyImg,
    dates: "Sep 12 – Sep 15, 2026",
    type: "Weekend Getaway",
    description:
      "Escape to the Nilgiris for a refreshing weekend — toy train rides, tea gardens, and misty mountain walks with fellow travelers.",
    maxMembers: 8,
    members: [
      { id: "m30", name: "Akash J", avatar: avatarUrl("akash") },
      { id: "m31", name: "Bhavna P", avatar: avatarUrl("bhavna") },
      { id: "m32", name: "Chetan R", avatar: avatarUrl("chetan") },
    ],
    organizer: "Akash J",
  },
];

export const getTroop = (id: string) => troops.find((t) => t.id === id);
