import { Request, Response } from 'express';
import { Equipment } from '../models/Equipment';

export const getSmartMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, landArea, activity, location, maxBudget, category } = req.body;

    const query: any = { isAvailable: true };

    if (category && category !== 'All') {
      query.category = new RegExp(category, 'i');
    }

    if (maxBudget && Number(maxBudget) > 0) {
      query.pricePerDay = { $lte: Number(maxBudget) };
    }

    const availableEquipment = await Equipment.find(query);

    const matches = availableEquipment.map(eq => {
      let score = 70;
      const matchReasons: string[] = [];

      // Category / Activity matching
      const actLower = String(activity || '').toLowerCase();
      const eqCategoryLower = eq.category.toLowerCase();

      if (actLower.includes('plow') || actLower.includes('land') || actLower.includes('tilling')) {
        if (eqCategoryLower.includes('tractor') || eqCategoryLower.includes('rotavator') || eqCategoryLower.includes('tiller')) {
          score += 15;
          matchReasons.push(`Ideal for ${activity} land preparation operations.`);
        }
      } else if (actLower.includes('harvest') || actLower.includes('cutting')) {
        if (eqCategoryLower.includes('harvester') || eqCategoryLower.includes('thresher')) {
          score += 20;
          matchReasons.push(`High capacity machine specialized for ${crop || 'harvesting'}.`);
        }
      } else if (actLower.includes('seed') || actLower.includes('sowing')) {
        if (eqCategoryLower.includes('seeder') || eqCategoryLower.includes('tractor')) {
          score += 15;
          matchReasons.push(`Precision tool for uniform seed drilling.`);
        }
      }

      // Horsepower / Acreage suitability
      const area = Number(landArea) || 5;
      if (area > 10 && eq.hp >= 45) {
        score += 10;
        matchReasons.push(`${eq.hp} HP engine provides heavy torque for ${area} acres.`);
      } else if (area <= 10 && eq.hp >= 30) {
        score += 8;
        matchReasons.push(`Optimal ${eq.hp} HP fuel efficiency for ${area} acre plot.`);
      }

      // Location match
      if (location && eq.location.toLowerCase().includes(String(location).toLowerCase())) {
        score += 10;
        matchReasons.push(`Located nearby in ${eq.location} for low transport cost.`);
      } else {
        matchReasons.push(`Available for regional transport across state.`);
      }

      // Operator inclusion
      if (eq.operatorIncluded) {
        score += 5;
        matchReasons.push(`Includes experienced machine operator service.`);
      }

      score = Math.min(Math.max(score, 60), 99);

      return {
        equipment: eq.toJSON(),
        matchScore: score,
        matchReasons
      };
    });

    // Sort by highest match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (error: any) {
    console.error('Smart match error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate smart matches.' });
  }
};
