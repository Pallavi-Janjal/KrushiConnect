import { User, Equipment, Booking, Review, Notification, MaintenanceRecord, UsageLog, FarmPlan, MandiPrice, Receipt } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-farmer-1',
    name: 'Ramesh Patel',
    email: 'farmer@krushi.com',
    phone: '+91 98765 43210',
    role: 'FARMER',
    location: 'Anand, Gujarat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'usr-owner-1',
    name: 'Suresh Kumar',
    email: 'owner@krushi.com',
    phone: '+91 98123 45678',
    role: 'EQUIPMENT_OWNER',
    location: 'Karnal, Haryana',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-owner-2',
    name: 'Vikram Singh',
    email: 'vikram.singh@agri.com',
    phone: '+91 97654 32109',
    role: 'EQUIPMENT_OWNER',
    location: 'Ludhiana, Punjab',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    createdAt: '2026-01-20T09:30:00Z'
  }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-101',
    ownerId: 'usr-owner-1',
    ownerName: 'Suresh Kumar',
    ownerPhone: '+91 98123 45678',
    name: 'Mahindra 575 DI 45 HP Heavy Duty Tractor',
    category: 'Tractor',
    brand: 'Mahindra',
    model: '575 DI Power Plus',
    hp: 45,
    fuelType: 'Diesel',
    description: 'High torque 45 HP heavy duty tractor suitable for deep plowing, rotavator operations, and heavy hauling. Well maintained with power steering and smooth hydraulic lift system.',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    pricePerDay: 2800,
    pricePerHour: 450,
    operatorIncluded: true,
    operatorCostPerDay: 600,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1530267981668-8ce35880b07f?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Horsepower': '45 HP',
      'Cylinders': '4 Cylinders',
      'Fuel Capacity': '47 Liters',
      'Lifting Capacity': '1600 kg',
      'PTO HP': '39.8 HP',
      'Transmission': 'Partial Constant Mesh'
    },
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'eq-102',
    ownerId: 'usr-owner-1',
    ownerName: 'Suresh Kumar',
    ownerPhone: '+91 98123 45678',
    name: 'John Deere 5050D 50 HP Dual Clutch Tractor',
    category: 'Tractor',
    brand: 'John Deere',
    model: '5050D PowerPro',
    hp: 50,
    fuelType: 'Diesel',
    description: 'Premium 50 HP tractor with oil-immersed disc brakes and planetary gear reduction. Ideal for large farm acreage and heavy agricultural implements.',
    location: 'Kurukshetra, Haryana',
    state: 'Haryana',
    pricePerDay: 3200,
    pricePerHour: 550,
    operatorIncluded: true,
    operatorCostPerDay: 700,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Horsepower': '50 HP',
      'Cylinders': '3 Cylinders Turbo',
      'Fuel Capacity': '60 Liters',
      'Lifting Capacity': '1600 kg',
      'PTO HP': '42.5 HP',
      'Transmission': 'Collar Shift 8 FWD + 4 REV'
    },
    createdAt: '2026-02-05T12:00:00Z'
  },
  {
    id: 'eq-103',
    ownerId: 'usr-owner-2',
    ownerName: 'Vikram Singh',
    ownerPhone: '+91 97654 32109',
    name: 'Kubota Harvester DC-68G Paddy & Wheat Harvester',
    category: 'Harvester',
    brand: 'Kubota',
    model: 'DC-68G-HK',
    hp: 68,
    fuelType: 'Diesel',
    description: 'High capacity combine harvester equipped with rubber crawler tracks. Perfect for wet paddy fields and dense wheat crops with minimal grain loss.',
    location: 'Ludhiana, Punjab',
    state: 'Punjab',
    pricePerDay: 8500,
    pricePerHour: 1400,
    operatorIncluded: true,
    operatorCostPerDay: 1000,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Engine Power': '68 HP',
      'Cutting Width': '2.0 Meters',
      'Harvest Speed': '1.85 m/s',
      'Grain Tank Capacity': '1200 Liters',
      'Track Width': '500 mm Rubber Crawler'
    },
    createdAt: '2026-02-10T08:00:00Z'
  },
  {
    id: 'eq-104',
    ownerId: 'usr-owner-2',
    ownerName: 'Vikram Singh',
    ownerPhone: '+91 97654 32109',
    name: 'Shaktiman 7 Feet Heavy Duty Rotavator',
    category: 'Rotavator',
    brand: 'Shaktiman',
    model: 'U-Series 7 Ft',
    hp: 40,
    fuelType: 'N/A (PTO Driven)',
    description: '7-feet wide rotary tiller equipped with 48 boron steel L-type blades. Ensures perfect soil pulverization for seedbed preparation.',
    location: 'Jalandhar, Punjab',
    state: 'Punjab',
    pricePerDay: 1500,
    pricePerHour: 250,
    operatorIncluded: false,
    operatorCostPerDay: 0,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Working Width': '7 Feet (2.1m)',
      'Number of Blades': '48 L-Blades',
      'PTO Speed': '540 RPM',
      'Weight': '460 kg',
      'Required Tractor HP': '40-55 HP'
    },
    createdAt: '2026-02-12T11:00:00Z'
  },
  {
    id: 'eq-105',
    ownerId: 'usr-owner-1',
    ownerName: 'Suresh Kumar',
    ownerPhone: '+91 98123 45678',
    name: 'Fieldking Automatic 9-Tyne Seed Drill & Fertilizer Inserter',
    category: 'Seeder',
    brand: 'Fieldking',
    model: 'FK-SD-9',
    hp: 35,
    fuelType: 'N/A (PTO Driven)',
    description: 'Precision seed cum fertilizer drill. Allows simultaneous seed planting and fertilizer application with adjustable seed depth control.',
    location: 'Karnal, Haryana',
    state: 'Haryana',
    pricePerDay: 1800,
    pricePerHour: 300,
    operatorIncluded: false,
    operatorCostPerDay: 0,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Tynes': '9 Tynes',
      'Row to Row Distance': '7 to 9 inches (Adjustable)',
      'Seed Capacity': '60 kg',
      'Fertilizer Capacity': '65 kg',
      'Required Tractor HP': '35+ HP'
    },
    createdAt: '2026-02-15T14:00:00Z'
  },
  {
    id: 'eq-106',
    ownerId: 'usr-owner-2',
    ownerName: 'Vikram Singh',
    ownerPhone: '+91 97654 32109',
    name: 'Aspee 600 Liter Tractor Mounted Boom Sprayer',
    category: 'Sprayer',
    brand: 'Aspee',
    model: 'HTP-600 Boom',
    hp: 30,
    fuelType: 'PTO Driven',
    description: '600L capacity chemical & pesticide boom sprayer with 12m folding spray arms. Uniform coverage for cotton, sugarcane, wheat, and vegetable crops.',
    location: 'Ludhiana, Punjab',
    state: 'Punjab',
    pricePerDay: 2200,
    pricePerHour: 350,
    operatorIncluded: true,
    operatorCostPerDay: 500,
    rating: 5.0,
    reviewCount: 0,
    isAvailable: true,
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: {
      'Tank Capacity': '600 Liters Polyethylene',
      'Boom Width': '12 Meters (24 Nozzles)',
      'Pump Type': 'Triple Piston HTP',
      'Pressure': '40 Bar',
      'Required Tractor HP': '30+ HP'
    },
    createdAt: '2026-02-18T09:00:00Z'
  }
];

// Clean empty arrays for transactions (0 fake data)
export const INITIAL_BOOKINGS: Booking[] = [];
export const INITIAL_RECEIPTS: Receipt[] = [];
export const INITIAL_REVIEWS: Review[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [];
export const INITIAL_USAGE_LOGS: UsageLog[] = [];
export const INITIAL_FARM_PLANS: FarmPlan[] = [];

export const INITIAL_MANDI_PRICES: MandiPrice[] = [
  {
    id: 'mandi-1',
    commodity: 'Wheat (Kanak)',
    mandiName: 'Karnal APMC Market',
    state: 'Haryana',
    currentPrice: 2275,
    previousPrice: 2220,
    changePercent: 2.47,
    unit: '₹ / Quintal',
    updatedAt: '2026-09-02',
    trendHistory: [
      { date: 'Aug 27', price: 2180 },
      { date: 'Aug 28', price: 2195 },
      { date: 'Aug 29', price: 2210 },
      { date: 'Aug 30', price: 2220 },
      { date: 'Aug 31', price: 2240 },
      { date: 'Sep 01', price: 2260 },
      { date: 'Sep 02', price: 2275 }
    ]
  },
  {
    id: 'mandi-2',
    commodity: 'Paddy Basmati 1509',
    mandiName: 'Khanna Grain Market',
    state: 'Punjab',
    currentPrice: 3850,
    previousPrice: 3790,
    changePercent: 1.58,
    unit: '₹ / Quintal',
    updatedAt: '2026-09-02',
    trendHistory: [
      { date: 'Aug 27', price: 3650 },
      { date: 'Aug 28', price: 3700 },
      { date: 'Aug 29', price: 3720 },
      { date: 'Aug 30', price: 3760 },
      { date: 'Aug 31', price: 3790 },
      { date: 'Sep 01', price: 3820 },
      { date: 'Sep 02', price: 3850 }
    ]
  },
  {
    id: 'mandi-3',
    commodity: 'Cotton (Kapas)',
    mandiName: 'Rajkot APMC Mandi',
    state: 'Gujarat',
    currentPrice: 7420,
    previousPrice: 7500,
    changePercent: -1.06,
    unit: '₹ / Quintal',
    updatedAt: '2026-09-02',
    trendHistory: [
      { date: 'Aug 27', price: 7600 },
      { date: 'Aug 28', price: 7580 },
      { date: 'Aug 29', price: 7550 },
      { date: 'Aug 30', price: 7520 },
      { date: 'Aug 31', price: 7500 },
      { date: 'Sep 01', price: 7460 },
      { date: 'Sep 02', price: 7420 }
    ]
  },
  {
    id: 'mandi-4',
    commodity: 'Yellow Soybean',
    mandiName: 'Indore Mandi',
    state: 'Madhya Pradesh',
    currentPrice: 4680,
    previousPrice: 4610,
    changePercent: 1.51,
    unit: '₹ / Quintal',
    updatedAt: '2026-09-02',
    trendHistory: [
      { date: 'Aug 27', price: 4520 },
      { date: 'Aug 28', price: 4550 },
      { date: 'Aug 29', price: 4580 },
      { date: 'Aug 30', price: 4600 },
      { date: 'Aug 31', price: 4610 },
      { date: 'Sep 01', price: 4650 },
      { date: 'Sep 02', price: 4680 }
    ]
  }
];
