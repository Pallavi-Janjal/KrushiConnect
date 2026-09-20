import { Equipment, SmartMatchCriteria, SmartMatchResult } from '../types';

export const calculateSmartMatch = (
  equipmentList: Equipment[],
  criteria: SmartMatchCriteria
): SmartMatchResult[] => {
  const userVillage = (criteria.village || '').trim().toLowerCase();
  const userTaluka = (criteria.taluka || '').trim().toLowerCase();
  const userDistrict = (criteria.district || '').trim().toLowerCase();
  const userState = (criteria.state || '').trim().toLowerCase();
  const userGeneralLoc = (criteria.location || '').trim().toLowerCase();

  const effectiveActivity = (
    criteria.activity === 'Other' && criteria.customActivity
      ? criteria.customActivity
      : criteria.activity || ''
  ).toLowerCase().trim();

  const results = equipmentList.map(eq => {
    let baseScore = 30;
    let locationScore = 0;
    let locationTier = 0; // 4: Village, 3: Taluka, 2: District, 1: State, 0: Other
    let activityScore = 0;
    let hpScore = 0;
    let budgetScore = 0;
    let bonusScore = 0;
    const matchReasons: string[] = [];

    const eqVillage = (eq.village || '').trim().toLowerCase();
    const eqTaluka = (eq.taluka || '').trim().toLowerCase();
    const eqDistrict = (eq.district || '').trim().toLowerCase();
    const eqState = (eq.state || '').trim().toLowerCase();
    const eqLocation = (eq.location || '').trim().toLowerCase();
    const catLower = eq.category.toLowerCase();
    const nameLower = eq.name.toLowerCase();
    const descLower = eq.description.toLowerCase();
    const combinedEqText = `${catLower} ${nameLower} ${descLower} ${eqLocation} ${Object.values(eq.specifications || {}).join(' ').toLowerCase()}`;

    // ── 1. Hierarchical Location Proximity Matching (Village > Taluka > District > State) ──
    if (userVillage && (eqVillage.includes(userVillage) || eqLocation.includes(userVillage))) {
      locationTier = 4;
      locationScore = 35;
      matchReasons.push(`🎯 Exact Village Match: Located right in ${eq.village || criteria.village}`);
    } else if (userTaluka && userTaluka !== 'other' && (eqTaluka.includes(userTaluka) || eqLocation.includes(userTaluka))) {
      locationTier = 3;
      locationScore = 26;
      matchReasons.push(`📍 Local Taluka Match: Located in ${eq.taluka || criteria.taluka} Tehsil`);
    } else if (userDistrict && (eqDistrict.includes(userDistrict) || eqLocation.includes(userDistrict))) {
      locationTier = 2;
      locationScore = 18;
      matchReasons.push(`📍 District Match: Located in ${eq.district || criteria.district} District`);
    } else if (userState && (eqState.includes(userState) || eqLocation.includes(userState))) {
      locationTier = 1;
      locationScore = 10;
      matchReasons.push(`📍 Regional Match: Available in ${eq.state || criteria.state}`);
    } else if (userGeneralLoc && (eqLocation.includes(userGeneralLoc) || userGeneralLoc.includes(eqLocation))) {
      locationTier = 1;
      locationScore = 10;
      matchReasons.push(`📍 Proximity Match: Located nearby in ${eq.location}`);
    }

    // ── 2. Farming Activity Matching ──
    if (
      (effectiveActivity.includes('plow') || effectiveActivity.includes('tilling') || effectiveActivity.includes('prep') || effectiveActivity.includes('rotavator') || effectiveActivity.includes('cultivat')) &&
      (catLower === 'tractor' || catLower === 'rotavator' || catLower === 'tiller' || catLower === 'cultivator')
    ) {
      activityScore = 25;
      matchReasons.push('Optimal machine type for land preparation & tilling');
    } else if (
      (effectiveActivity.includes('sow') || effectiveActivity.includes('seed') || effectiveActivity.includes('plant')) &&
      (catLower === 'seeder' || catLower === 'tractor')
    ) {
      activityScore = 25;
      matchReasons.push('Perfect precision implement for sowing & planting');
    } else if (
      (effectiveActivity.includes('harvest') || effectiveActivity.includes('reap') || effectiveActivity.includes('thresh') || effectiveActivity.includes('grain')) &&
      (catLower === 'harvester' || catLower === 'thresher' || catLower === 'tractor')
    ) {
      activityScore = 25;
      matchReasons.push('High efficiency machinery for crop harvesting & threshing');
    } else if (
      (effectiveActivity.includes('spray') || effectiveActivity.includes('pest') || effectiveActivity.includes('chemical') || effectiveActivity.includes('fertiliz')) &&
      (catLower === 'sprayer')
    ) {
      activityScore = 25;
      matchReasons.push('Uniform chemical & liquid fertilizer coverage');
    } else if (
      (effectiveActivity.includes('weed') || effectiveActivity.includes('inter-cultivation')) &&
      (catLower === 'cultivator' || catLower === 'rotavator' || catLower === 'tiller')
    ) {
      activityScore = 25;
      matchReasons.push('Ideal equipment for inter-row weeding & aeration');
    } else if (
      (effectiveActivity.includes('bale') || effectiveActivity.includes('residue') || effectiveActivity.includes('straw')) &&
      (catLower === 'balers' || catLower === 'tractor')
    ) {
      activityScore = 25;
      matchReasons.push('Specialized baling & crop residue management');
    } else if (
      (effectiveActivity.includes('pump') || effectiveActivity.includes('irrigat') || effectiveActivity.includes('water')) &&
      (combinedEqText.includes('pump') || combinedEqText.includes('water') || catLower === 'sprayer' || catLower === 'tractor')
    ) {
      activityScore = 25;
      matchReasons.push('Suitable for irrigation & water pumping');
    } else if (effectiveActivity) {
      // Custom typed farming activity: keyword matching
      const keywords = effectiveActivity.split(/\s+/).filter(w => w.length > 2);
      const matched = keywords.filter(w => combinedEqText.includes(w));
      if (matched.length > 0 || combinedEqText.includes(effectiveActivity)) {
        activityScore = 25;
        matchReasons.push(`⚡ Matches custom activity requirements for "${criteria.customActivity || criteria.activity}"`);
      } else if (catLower === 'tractor') {
        activityScore = 15;
        matchReasons.push('Multi-purpose tractor adaptable with custom farming implements');
      }
    }

    // ── 3. Horsepower vs Plot Area Fit ──
    if (criteria.landArea > 15) {
      if (eq.hp >= 50) {
        hpScore = 12;
        matchReasons.push(`Heavy-duty ${eq.hp} HP engine handles large ${criteria.landArea}-acre plot effortlessly`);
      } else if (eq.hp >= 40) {
        hpScore = 8;
        matchReasons.push(`Adequate ${eq.hp} HP power for ${criteria.landArea}-acre acreage`);
      }
    } else {
      if (eq.hp >= 35) {
        hpScore = 10;
        matchReasons.push(`Sufficient ${eq.hp} HP engine power for ${criteria.landArea}-acre plot`);
      }
    }

    // ── 4. Budget Fit ──
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

    // ── 6. Availability Check ──
    if (!eq.isAvailable) {
      return {
        equipment: eq,
        matchScore: 0,
        matchReasons: ['Currently unavailable on selected dates'],
        _locationTier: -1
      };
    }

    const totalRaw = baseScore + locationScore + activityScore + hpScore + budgetScore + bonusScore;
    const finalScore = Math.min(99, Math.max(10, totalRaw));

    return {
      equipment: eq,
      matchScore: finalScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Standard agricultural match'],
      _locationTier: locationTier
    };
  });

  // Filter out 0 score and sort:
  // 1st priority: Location proximity tier (Village > Taluka > District > State > Other)
  // 2nd priority: Overall Match Score descending
  // 3rd priority: Owner rating descending
  return results
    .filter(r => r.matchScore > 0)
    .sort((a, b) => {
      if (b._locationTier !== a._locationTier) {
        return b._locationTier - a._locationTier;
      }
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return b.equipment.rating - a.equipment.rating;
    })
    .map(({ equipment, matchScore, matchReasons }) => ({ equipment, matchScore, matchReasons }));
};
