import { Equipment, SmartMatchCriteria, SmartMatchResult } from '../types';

export const calculateSmartMatch = (
  equipmentList: Equipment[],
  criteria: SmartMatchCriteria
): SmartMatchResult[] => {
  const results: SmartMatchResult[] = equipmentList.map(eq => {
    let score = 50; // base score
    const matchReasons: string[] = [];

    // 1. Category & Activity Match
    const activityLower = criteria.activity.toLowerCase();
    const catLower = eq.category.toLowerCase();

    if (
      (activityLower.includes('plow') || activityLower.includes('tilling') || activityLower.includes('prep')) &&
      (catLower === 'tractor' || catLower === 'rotavator' || catLower === 'tiller' || catLower === 'cultivator')
    ) {
      score += 25;
      matchReasons.push('Optimal machine type for land preparation & tilling');
    } else if (
      (activityLower.includes('sow') || activityLower.includes('seed') || activityLower.includes('plant')) &&
      (catLower === 'seeder' || catLower === 'tractor')
    ) {
      score += 25;
      matchReasons.push('Perfect precision implement for sowing & fertilizing');
    } else if (
      (activityLower.includes('harvest') || activityLower.includes('reap')) &&
      (catLower === 'harvester' || catLower === 'thresher')
    ) {
      score += 25;
      matchReasons.push('High efficiency harvester for crop harvesting');
    } else if (
      (activityLower.includes('spray') || activityLower.includes('pest')) &&
      (catLower === 'sprayer')
    ) {
      score += 25;
      matchReasons.push('Uniform chemical & liquid fertilizer coverage');
    } else if (criteria.equipmentCategory && catLower === criteria.equipmentCategory.toLowerCase()) {
      score += 20;
      matchReasons.push(`Matches requested ${eq.category} category`);
    }

    // 2. Horsepower vs Land Area Fit
    if (criteria.landArea > 15) {
      if (eq.hp >= 50) {
        score += 15;
        matchReasons.push(`Heavy-duty ${eq.hp} HP engine handles large ${criteria.landArea}-acre plot effortlessly`);
      } else if (eq.hp >= 40) {
        score += 8;
        matchReasons.push(`Adequate ${eq.hp} HP power for medium-to-large farm acreage`);
      }
    } else {
      if (eq.hp >= 35) {
        score += 12;
        matchReasons.push(`Sufficient ${eq.hp} HP engine power for ${criteria.landArea}-acre plot`);
      }
    }

    // 3. Budget Fit
    if (criteria.maxBudget && criteria.maxBudget > 0) {
      if (eq.pricePerDay <= criteria.maxBudget) {
        score += 10;
        matchReasons.push(`Fits within daily budget (₹${eq.pricePerDay.toLocaleString('en-IN')}/day ≤ ₹${criteria.maxBudget.toLocaleString('en-IN')})`);
      } else {
        score -= 15;
      }
    }

    // 4. Location Match
    if (criteria.location && criteria.location.trim() !== '') {
      const locLower = criteria.location.toLowerCase();
      const eqLocLower = eq.location.toLowerCase();
      const eqStateLower = eq.state.toLowerCase();

      if (eqLocLower.includes(locLower) || locLower.includes(eqLocLower) || eqStateLower.includes(locLower)) {
        score += 10;
        matchReasons.push(`Proximity match: Located nearby in ${eq.location}`);
      }
    }

    // 5. Rating Bonus
    if (eq.rating >= 4.8) {
      score += 8;
      matchReasons.push(`Highly rated owner equipment (${eq.rating} ★)`);
    }

    // 6. Availability Check
    if (!eq.isAvailable) {
      score = 0;
      matchReasons.length = 0;
      matchReasons.push('Currently unavailable on selected dates');
    }

    // Normalize final score between 0 and 99%
    const finalScore = Math.min(98, Math.max(0, score));

    return {
      equipment: eq,
      matchScore: finalScore,
      matchReasons: matchReasons.length > 0 ? matchReasons : ['Standard agricultural match']
    };
  });

  // Filter out 0 score and sort descending
  return results
    .filter(r => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
};
