export interface CategoryExample {
  name: string;
  brand: string;
  model: string;
  hp: number;
  suggestions: string[];
}

export const CATEGORY_EXAMPLES: Record<string, CategoryExample> = {
  Tractor: {
    name: 'Mahindra 575 DI XP Plus (47 HP Tractor)',
    brand: 'Mahindra',
    model: '575 DI XP Plus',
    hp: 47,
    suggestions: [
      'Mahindra 575 DI XP Plus (47 HP)',
      'John Deere 5310 PowerTech 4WD (55 HP)',
      'Swaraj 744 FE 48 HP',
      'Sonalika DI 745 III Sikander (50 HP)',
      'Massey Ferguson 241 DI Maha Shakti (42 HP)',
      'Kubota MU4501 2WD (45 HP)',
      'Eicher 485 Super DI (45 HP)'
    ]
  },
  Harvester: {
    name: 'Preet 987 Combine Harvester (AC Cabin, 101 HP)',
    brand: 'Preet',
    model: '987 Deluxe AC',
    hp: 101,
    suggestions: [
      'Preet 987 Combine Harvester (101 HP)',
      'Claas Crop Tiger 30 Wheel (60 HP)',
      'Dasmesh 912 Combine Harvester',
      'Kartar 4000 Self Propelled Combine Harvester',
      'John Deere W70 Grain Harvester (100 HP)'
    ]
  },
  Seeder: {
    name: 'Shaktiman Super Seeder 9-Row (Paddy & Wheat)',
    brand: 'Shaktiman',
    model: 'SS-9R Multi-Crop',
    hp: 50,
    suggestions: [
      'Shaktiman Super Seeder 9-Row',
      'Dasmesh 913 Super Seeder Multi-Speed',
      'Landforce Super Seeder 8-Row',
      'Fieldking Happy Seeder 10-Row',
      'Jagjit Super Seeder Heavy Duty'
    ]
  },
  Sprayer: {
    name: 'Mitra Bullet 600L Tractor Mounted Boom Sprayer',
    brand: 'Mitra',
    model: 'Bullet 600L',
    hp: 35,
    suggestions: [
      'Mitra Bullet 600L Tractor Boom Sprayer',
      'ASPEE HTP Tractor Mounted Sprayer 500L',
      'KisanKraft KK-BPS-500 Power Sprayer',
      'Balwan Tractor Mounted HTP 600L Sprayer',
      'Agrimate Power Agro Sprayer 500L'
    ]
  },
  Rotavator: {
    name: 'Shaktiman Semi-Champion Rotavator (7 Feet, 48 Blades)',
    brand: 'Shaktiman',
    model: 'Semi-Champion 7 Ft',
    hp: 45,
    suggestions: [
      'Shaktiman Semi-Champion Rotavator 7 Feet (48 Blades)',
      'Fieldking Regular Multi-Speed Rotavator 6 Feet',
      'Maschio Gaspardo Virat 205 Rotavator',
      'Swan Agro Multi-Speed Rotavator 7 Feet',
      'Mahindra Heavy Duty Rotavator 6 Feet'
    ]
  },
  Cultivator: {
    name: 'Fieldking Heavy Duty 9-Tyne Spring Loaded Cultivator',
    brand: 'Fieldking',
    model: 'FKHDSTC-9',
    hp: 40,
    suggestions: [
      'Fieldking Heavy Duty 9-Tyne Spring Loaded Cultivator',
      'Mahindra Rigid 9-Tyne Cultivator',
      'Soil Master 11-Tyne Duckfoot Cultivator',
      'Universal Spring Loaded 9-Tyne Tiller Cultivator'
    ]
  },
  Tiller: {
    name: 'VST Shakti 130 DI Power Tiller (13 HP Diesel, Electric Start)',
    brand: 'VST Shakti',
    model: '130 DI Electric',
    hp: 13,
    suggestions: [
      'VST Shakti 130 DI Power Tiller (13 HP)',
      'Kamco KMB 200 Power Tiller (12 HP)',
      'Kirloskar Mega T 15 HP Power Tiller',
      'Honda F300 Rotary Power Weeder / Tiller',
      'Greaves Cotton GS 14 DI Power Tiller'
    ]
  },
  Balers: {
    name: 'New Holland BC5060 Small Square Hay Baler',
    brand: 'New Holland',
    model: 'BC5060 Square Baler',
    hp: 55,
    suggestions: [
      'New Holland BC5060 Small Square Hay Baler',
      'Claas Markant 65 High-Density Baler',
      'John Deere 459 Round Baler',
      'Sonalika Square Straw Baler'
    ]
  },
  Thresher: {
    name: 'Dasmesh 641 Multi-Crop Tokree Model Thresher',
    brand: 'Dasmesh',
    model: '641 Auto-Feed',
    hp: 35,
    suggestions: [
      'Dasmesh 641 Multi-Crop Tokree Thresher',
      'Punjab Tokree Model Multi-Crop Thresher',
      'National Multi-Crop Thresher 35 HP',
      'Gurmukh Auto Feeding Paddy & Wheat Thresher'
    ]
  },
  Other: {
    name: 'Laser Land Leveler with Dual Slope Transmitter & 7ft Scraper',
    brand: 'Garud',
    model: 'Dual Slope Pro 7-Feet',
    hp: 50,
    suggestions: [
      'Laser Land Leveler with Dual Slope Transmitter',
      'Post Hole Digger Heavy Duty (Tractor Operated)',
      'Sugarcane Stubble Shaver / Loader',
      'Automatic Potato Planter 2-Row',
      'Tractor Mounted Front End Dozer / Loader'
    ]
  }
};

export const getCategoryExample = (category: string): CategoryExample => {
  return CATEGORY_EXAMPLES[category] || CATEGORY_EXAMPLES['Tractor'];
};
