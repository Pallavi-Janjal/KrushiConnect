import { Equipment, SmartMatchCriteria, SmartMatchResult } from '../types';

export interface FarmingActivityConfig {
  id: string;
  name: string;
  marathi: string;
  hindi: string;
  primaryCategories: string[];
  secondaryCategories: string[];
  keywords: string[];
}

export const FARMING_ACTIVITIES_CONFIG: FarmingActivityConfig[] = [
  {
    id: 'land_prep',
    name: 'Land Preparation & Deep Plowing',
    marathi: 'नांगरणी',
    hindi: 'जुताई / गहरी जुताई',
    primaryCategories: ['tractor', 'rotavator', 'cultivator', 'tiller'],
    secondaryCategories: [],
    keywords: ['plow', 'plough', 'tilling', 'tillage', 'deep plowing', 'rotavator', 'cultivator', 'tiller', 'vakar', 'disc harrow', 'mouldboard', 'land preparation', 'nangarni']
  },
  {
    id: 'seedbed',
    name: 'Seedbed Tilling & Rotavator Pass',
    marathi: 'रोटाव्हेटर / मशागत',
    hindi: 'रोटावेटर / मिट्टी भुरभुरी करना',
    primaryCategories: ['rotavator', 'tiller', 'cultivator'],
    secondaryCategories: ['tractor'],
    keywords: ['rotavator', 'rotary', 'tiller', 'seedbed', 'pulveriz', 'tilling', 'fine tilth', 'mashagat']
  },
  {
    id: 'sowing',
    name: 'Precision Sowing & Fertilizing',
    marathi: 'पेरणी व खत टाकणे',
    hindi: 'बुवाई एवं खाद डालना',
    primaryCategories: ['seeder'],
    secondaryCategories: ['tractor'],
    keywords: ['seeder', 'seed drill', 'planter', 'sowing', 'drilling', 'seed cum fertilizer', 'pneumatic planter', 'perani', 'buwai']
  },
  {
    id: 'spraying',
    name: 'Crop Spraying & Chemical Application',
    marathi: 'फवारणी',
    hindi: 'छिड़काव एवं कीटनाशक',
    primaryCategories: ['sprayer'],
    secondaryCategories: ['tractor'],
    keywords: ['sprayer', 'boom sprayer', 'chemical', 'pesticide', 'fungicide', 'htp', 'mist blower', 'fogger', 'fawarani', 'spray']
  },
  {
    id: 'harvesting',
    name: 'Harvesting & Grain Threshing',
    marathi: 'कापणी व मळणी',
    hindi: 'कटाई एवं मड़ाई',
    primaryCategories: ['harvester', 'thresher'],
    secondaryCategories: ['tractor'],
    keywords: ['harvester', 'combine', 'thresher', 'reaper', 'grain cutting', 'paddy cutting', 'wheat harvesting', 'kapani', 'malani', 'katai']
  },
  {
    id: 'weeding',
    name: 'Weeding & Inter-row Cultivation',
    marathi: 'खुरपणी / कोळपणी',
    hindi: 'निराई-गुड़ाई',
    primaryCategories: ['cultivator', 'tiller', 'rotavator'],
    secondaryCategories: ['tractor'],
    keywords: ['weeding', 'weeder', 'inter-row', 'cultivator', 'kolpa', 'aeration', 'ridger', 'khurpani', 'kolpani']
  },
  {
    id: 'baling',
    name: 'Baling & Crop Residue Management',
    marathi: 'बेलिंग व पेंढा व्यवस्थापन',
    hindi: 'पुआल प्रबंधन एवं बेलिंग',
    primaryCategories: ['balers'],
    secondaryCategories: ['tractor'],
    keywords: ['baler', 'baling', 'straw', 'residue', 'stubble', 'shredder', 'mulcher']
  },
  {
    id: 'irrigation',
    name: 'Irrigation & Water Pumping',
    marathi: 'पाणी उपसा व सिंचन',
    hindi: 'सिंचाई एवं जल पम्पिंग',
    primaryCategories: ['sprayer', 'tractor'],
    secondaryCategories: [],
    keywords: ['pump', 'water pump', 'irrigation', 'diesel pump', 'sprinkler', 'drip', 'pani upasa']
  }
];

// Helper to normalize location strings and extract potential parts
const normalizeStr = (s?: string) => (s || '').trim().toLowerCase();

export const calculateSmartMatch = (
  equipmentList: Equipment[],
  criteria: SmartMatchCriteria
): SmartMatchResult[] => {
  const userVillage = normalizeStr(criteria.village);
  const userTaluka = normalizeStr(criteria.taluka);
  const userDistrict = normalizeStr(criteria.district);
  const userState = normalizeStr(criteria.state);
  const userGeneralLoc = normalizeStr(criteria.location);

  const effectiveActivityRaw = (
    criteria.activity === 'Other' && criteria.customActivity
      ? criteria.customActivity
      : criteria.activity || ''
  );
  const effectiveActivity = normalizeStr(effectiveActivityRaw);

  // Find matching activity configuration if standard
  const matchedActConfig = FARMING_ACTIVITIES_CONFIG.find(act => 
    effectiveActivity.includes(act.id) ||
    effectiveActivity.includes(normalizeStr(act.name)) ||
    effectiveActivity.includes(normalizeStr(act.marathi)) ||
    act.keywords.some(kw => effectiveActivity.includes(kw))
  );

  const results = equipmentList.map(eq => {
    let baseScore = 25;
    let locationScore = 0;
    let locationTier = 0; // 4: Village, 3: Taluka, 2: District, 1: State, 0: Other
    let activityScore = 0;
    let isActivityMatch = true;
    let hpScore = 0;
    let budgetScore = 0;
    let bonusScore = 0;
    const matchReasons: string[] = [];

    const eqVillage = normalizeStr(eq.village);
    const eqTaluka = normalizeStr(eq.taluka);
    const eqDistrict = normalizeStr(eq.district);
    const eqState = normalizeStr(eq.state);
    const eqLocation = normalizeStr(eq.location);
    const catLower = normalizeStr(eq.category);
    const nameLower = normalizeStr(eq.name);
    const descLower = normalizeStr(eq.description);
    const combinedEqText = `${catLower} ${nameLower} ${descLower} ${eqLocation} ${Object.values(eq.specifications || {}).join(' ').toLowerCase()}`;

    // ── 1. Granular Proximity Location Matching (Village > Taluka > District > State) ──
    if (userVillage && (eqVillage.includes(userVillage) || eqLocation.includes(userVillage))) {
      locationTier = 4;
      locationScore = 35;
      matchReasons.push(`🎯 Exact Village Match: Located in ${eq.village || criteria.village}`);
    } else if (userTaluka && userTaluka !== 'other' && userTaluka !== 'all talukas' && (eqTaluka.includes(userTaluka) || eqLocation.includes(userTaluka))) {
      locationTier = 3;
      locationScore = 26;
      matchReasons.push(`📍 Local Taluka Match: Located in ${eq.taluka || criteria.taluka} Tehsil`);
    } else if (userDistrict && (eqDistrict.includes(userDistrict) || eqLocation.includes(userDistrict) || (userDistrict.includes('chhatrapati') && eqLocation.includes('aurangabad')))) {
      locationTier = 2;
      locationScore = 18;
      matchReasons.push(`📍 District Match: Located in ${eq.district || criteria.district} District`);
    } else if (userState && (eqState.includes(userState) || eqLocation.includes(userState))) {
      locationTier = 1;
      locationScore = 10;
      matchReasons.push(`📍 Regional Match: Available in ${eq.state || criteria.state}`);
    } else if (userGeneralLoc && (eqLocation.includes(userGeneralLoc) || userGeneralLoc.includes(eqLocation))) {
      locationTier = 1;
      locationScore = 8;
      matchReasons.push(`📍 Proximity Match: Located nearby in ${eq.location}`);
    }

    // ── 2. Farming Activity Compatibility Matching ──
    if (matchedActConfig) {
      const isPrimary = matchedActConfig.primaryCategories.includes(catLower);
      const isSecondary = matchedActConfig.secondaryCategories.includes(catLower);
      const hasKeyword = matchedActConfig.keywords.some(kw => combinedEqText.includes(kw));

      if (isPrimary) {
        activityScore = 35;
        isActivityMatch = true;
        matchReasons.push(`🌟 Specialized machinery for ${matchedActConfig.name} (${matchedActConfig.marathi})`);
      } else if (isSecondary || (catLower === 'tractor' && hasKeyword)) {
        activityScore = 24;
        isActivityMatch = true;
        matchReasons.push(`🚜 Adaptable tractor with implements for ${matchedActConfig.name}`);
      } else if (hasKeyword) {
        activityScore = 18;
        isActivityMatch = true;
        matchReasons.push(`⚡ Compatible implement for ${matchedActConfig.name}`);
      } else {
        // Incompatible machine for this activity (e.g., Seeder for Land Preparation)
        activityScore = -35;
        isActivityMatch = false;
        matchReasons.push(`⚠️ Not standardly configured for ${matchedActConfig.name}`);
      }
    } else if (effectiveActivity) {
      // Custom written farming activity
      const keywords = effectiveActivity.split(/\s+/).filter(w => w.length > 2);
      const matchCount = keywords.filter(w => combinedEqText.includes(w)).length;
      if (matchCount > 0 || combinedEqText.includes(effectiveActivity)) {
        activityScore = 30;
        isActivityMatch = true;
        matchReasons.push(`⚡ Matches custom activity requirement: "${effectiveActivityRaw}"`);
      } else if (catLower === 'tractor') {
        activityScore = 15;
        isActivityMatch = true;
        matchReasons.push('Multi-purpose tractor adaptable with custom farming attachments');
      } else {
        activityScore = -20;
        isActivityMatch = false;
      }
    }

    // ── 3. Horsepower vs Plot Area Suitability ──
    const plotAcreage = criteria.landArea || 10;
    if (plotAcreage > 15) {
      if (eq.hp >= 50) {
        hpScore = 12;
        matchReasons.push(`Heavy-duty ${eq.hp} HP engine handles large ${plotAcreage}-acre plot with ease`);
      } else if (eq.hp >= 40) {
        hpScore = 8;
        matchReasons.push(`Adequate ${eq.hp} HP power for ${plotAcreage}-acre acreage`);
      }
    } else {
      if (eq.hp >= 35) {
        hpScore = 10;
        matchReasons.push(`Sufficient ${eq.hp} HP engine power for ${plotAcreage}-acre plot`);
      }
    }

    // ── 4. Daily Budget Fit ──
    if (criteria.maxBudget && criteria.maxBudget > 0) {
      if (eq.pricePerDay <= criteria.maxBudget) {
        budgetScore = 8;
        matchReasons.push(`Fits within daily budget (₹${eq.pricePerDay.toLocaleString('en-IN')}/day ≤ ₹${criteria.maxBudget.toLocaleString('en-IN')})`);
      } else {
        budgetScore = -15;
      }
    }

    // ── 5. Rating Bonus ──
    if (eq.rating >= 4.5) {
      bonusScore = 5;
      matchReasons.push(`Highly rated owner equipment (${eq.rating} ★)`);
    }

    // ── 6. Operator inclusion ──
    if (eq.operatorIncluded) {
      bonusScore += 3;
      matchReasons.push('Includes experienced machine operator');
    }

    // Availability Check
    if (!eq.isAvailable) {
      return {
        equipment: eq,
        matchScore: 0,
        matchReasons: ['Currently unavailable / booked on selected dates'],
        _locationTier: -1,
        _isActivityMatch: false
      };
    }

    const totalRaw = baseScore + locationScore + activityScore + hpScore + budgetScore + bonusScore;
    const finalScore = Math.min(99, Math.max(15, totalRaw));

    return {
      equipment: eq,
      matchScore: finalScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Standard agricultural match'],
      _locationTier: locationTier,
      _isActivityMatch: isActivityMatch
    };
  });

  // Filter out 0 score and sort:
  // 1st priority: Valid Activity Match (Compatible machines ALWAYS rank above incompatible machines)
  // 2nd priority: Location Proximity Tier (Village #1 > Taluka #2 > District #3 > State #4)
  // 3rd priority: Overall Match Score descending
  // 4th priority: Owner Rating descending
  return results
    .filter(r => r.matchScore > 0)
    .sort((a, b) => {
      // Primary: Activity match comes first
      if (b._isActivityMatch !== a._isActivityMatch) {
        return (b._isActivityMatch ? 1 : 0) - (a._isActivityMatch ? 1 : 0);
      }
      // Secondary: Nearest location proximity tier
      if (b._locationTier !== a._locationTier) {
        return b._locationTier - a._locationTier;
      }
      // Tertiary: Match Score
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // Quaternary: Rating
      return (b.equipment.rating || 0) - (a.equipment.rating || 0);
    })
    .map(({ equipment, matchScore, matchReasons }) => ({ equipment, matchScore, matchReasons }));
};
