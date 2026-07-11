export type Priority = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "assigned" | "in_progress" | "resolved";

export interface Incident {
  id: string;
  type: string;
  icon: string;
  location: string;
  priority: Priority;
  status: IncidentStatus;
  reportedBy: string;
  time: string;
  affected: number;
  assignee?: string;
  coords: [number, number]; // 0-100 percent for our map
  description: string;
}

export const incidents: Incident[] = [
  { id: "MED-101", type: "Medical Emergency", icon: "🚑", location: "Sector 14, Coastal Rd", priority: "critical", status: "in_progress", reportedBy: "Rahul S.", time: "2 min ago", affected: 1, assignee: "Dr. Meera K.", coords: [62, 38], description: "Father experiencing chest pain, roads flooded." },
  { id: "FLD-103", type: "Flood", icon: "🌊", location: "Riverbank Village", priority: "critical", status: "assigned", reportedBy: "WhatsApp Bot", time: "4 min ago", affected: 12, assignee: "Rescue Team Alpha", coords: [38, 52], description: "Family of 12 trapped on rooftop." },
  { id: "FIR-220", type: "Fire", icon: "🔥", location: "Market Complex, Block C", priority: "high", status: "in_progress", reportedBy: "Sana M.", time: "12 min ago", affected: 30, assignee: "Fire Dept #4", coords: [54, 28], description: "Two-storey textile shop on fire." },
  { id: "EQK-014", type: "Earthquake", icon: "🌋", location: "Hilltop Residency", priority: "high", status: "open", reportedBy: "SMS", time: "18 min ago", affected: 80, coords: [22, 30], description: "Structural cracks reported on 3 buildings." },
  { id: "CYC-051", type: "Cyclone", icon: "🌀", location: "Eastern Shoreline", priority: "medium", status: "assigned", reportedBy: "Aarav P.", time: "27 min ago", affected: 200, assignee: "NDRF Unit 2", coords: [78, 60], description: "Trees down, shelter evacuation in progress." },
  { id: "LND-008", type: "Landslide", icon: "⛰️", location: "Mountain Pass 4", priority: "medium", status: "open", reportedBy: "Ranger Sam", time: "33 min ago", affected: 6, coords: [12, 70], description: "Road blocked, 2 vehicles stuck." },
  { id: "MED-099", type: "Medical Emergency", icon: "🚑", location: "Shelter Camp A", priority: "low", status: "resolved", reportedBy: "Volunteer", time: "1 hr ago", affected: 1, assignee: "Paramedic Ravi", coords: [45, 65], description: "Diabetic patient stabilised." },
  { id: "FLD-101", type: "Flood", icon: "🌊", location: "Lowland Colony", priority: "high", status: "resolved", reportedBy: "Citizen App", time: "2 hr ago", affected: 45, assignee: "Boat Team B", coords: [30, 75], description: "All evacuated to Shelter B." },
];

export interface Volunteer {
  id: string;
  name: string;
  skill: string;
  distance: string;
  tasks: number;
  status: "available" | "busy" | "offline";
  rating: number;
  avatar: string;
}
export const volunteers: Volunteer[] = [
  { id: "V-01", name: "Dr. Meera K.", skill: "First Aid · Trauma", distance: "0.8 km", tasks: 1, status: "busy", rating: 4.9, avatar: "MK" },
  { id: "V-02", name: "Arjun Reddy", skill: "Boat Rescue", distance: "0.5 km", tasks: 2, status: "busy", rating: 4.7, avatar: "AR" },
  { id: "V-03", name: "Priya Nair", skill: "First Aid", distance: "1.2 km", tasks: 0, status: "available", rating: 4.8, avatar: "PN" },
  { id: "V-04", name: "Hassan Iqbal", skill: "Search & Rescue", distance: "2.1 km", tasks: 0, status: "available", rating: 4.6, avatar: "HI" },
  { id: "V-05", name: "Lakshmi V.", skill: "Logistics", distance: "3.4 km", tasks: 1, status: "busy", rating: 4.5, avatar: "LV" },
  { id: "V-06", name: "Daniel Joseph", skill: "Fire Response", distance: "4.0 km", tasks: 0, status: "available", rating: 4.9, avatar: "DJ" },
];

export interface Resource {
  id: string;
  name: string;
  icon: string;
  available: number;
  inUse: number;
  total: number;
}
export const resources: Resource[] = [
  { id: "R1", name: "Ambulances", icon: "🚑", available: 12, inUse: 8, total: 20 },
  { id: "R2", name: "Hospital Beds", icon: "🛏️", available: 142, inUse: 318, total: 460 },
  { id: "R3", name: "ICU Capacity", icon: "❤️‍🩹", available: 9, inUse: 23, total: 32 },
  { id: "R4", name: "Medical Kits", icon: "🩹", available: 320, inUse: 180, total: 500 },
  { id: "R5", name: "Rescue Boats", icon: "🚤", available: 6, inUse: 9, total: 15 },
  { id: "R6", name: "Food Packets", icon: "🍱", available: 4200, inUse: 1800, total: 6000 },
  { id: "R7", name: "Water Cans (20L)", icon: "💧", available: 950, inUse: 1200, total: 2150 },
  { id: "R8", name: "Rescue Teams", icon: "🧑‍🚒", available: 7, inUse: 11, total: 18 },
];

export const shelters = [
  { id: "S-A", name: "Shelter Camp A", capacity: 500, occupied: 312, distance: "1.4 km", status: "open" },
  { id: "S-B", name: "Govt School Block B", capacity: 300, occupied: 290, distance: "2.6 km", status: "near-full" },
  { id: "S-C", name: "Community Hall C", capacity: 200, occupied: 80, distance: "3.1 km", status: "open" },
  { id: "S-D", name: "Stadium Shelter D", capacity: 1200, occupied: 410, distance: "5.8 km", status: "open" },
];

export const missingPersons = [
  { id: "M1", name: "Ramesh Iyer", age: 64, lastSeen: "Riverbank Village", reportedBy: "Wife - Sita", match: "Possible match in Shelter A", confidence: 86 },
  { id: "M2", name: "Aisha Khan", age: 9, lastSeen: "Sector 14", reportedBy: "Father - Imran", match: "Safe Check-In found 12 min ago", confidence: 97 },
  { id: "M3", name: "Joseph D'Souza", age: 38, lastSeen: "Coastal Rd", reportedBy: "Brother - Mark", match: "Searching…", confidence: 0 },
  { id: "M4", name: "Lakshmi Bai", age: 71, lastSeen: "Lowland Colony", reportedBy: "Son - Vikram", match: "Rescue log: Boat Team B", confidence: 78 },
];

export const smsFeed = [
  { from: "+91 98••• 4421", time: "Just now", text: "SOS Flood family trapped rooftop riverbank village", parsed: { type: "Flood", severity: "Critical", people: 5 }, id: "FLD-110" },
  { from: "+91 99••• 1132", time: "1 min ago", text: "Fire in market block C, smoke heavy, need help", parsed: { type: "Fire", severity: "High", people: 30 }, id: "FIR-221" },
  { from: "+91 90••• 7723", time: "3 min ago", text: "Father chest pain road flooded sector 14", parsed: { type: "Medical", severity: "Critical", people: 1 }, id: "MED-101" },
  { from: "+91 87••• 0091", time: "6 min ago", text: "Safe with family at shelter camp A", parsed: { type: "Check-In", severity: "Safe", people: 4 }, id: "CHK-302" },
];

export const responseTrend = [
  { t: "00:00", incidents: 4, resolved: 2 },
  { t: "03:00", incidents: 6, resolved: 4 },
  { t: "06:00", incidents: 9, resolved: 6 },
  { t: "09:00", incidents: 14, resolved: 10 },
  { t: "12:00", incidents: 22, resolved: 16 },
  { t: "15:00", incidents: 31, resolved: 22 },
  { t: "18:00", incidents: 28, resolved: 26 },
  { t: "21:00", incidents: 18, resolved: 17 },
];

export const priorityColor = (p: Priority) => ({
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-[color:var(--high)] text-white",
  medium: "bg-[color:var(--medium)] text-black",
  low: "bg-[color:var(--low)] text-white",
}[p]);

export const priorityDot = (p: Priority) => ({
  critical: "bg-destructive",
  high: "bg-[color:var(--high)]",
  medium: "bg-[color:var(--medium)]",
  low: "bg-[color:var(--low)]",
}[p]);
