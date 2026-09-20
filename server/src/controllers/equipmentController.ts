import { Request, Response } from 'express';
import { Equipment } from '../models/Equipment';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getAllEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, category, state, location, minPrice, maxPrice, hp, isAvailable, sortBy } = req.query;

    const conditions: any[] = [];

    if (query && String(query).trim() !== '') {
      const searchRegex = new RegExp(String(query).trim(), 'i');
      conditions.push({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { model: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { state: searchRegex }
        ]
      });
    }

    if (category && category !== 'All' && category !== 'all') {
      conditions.push({ category: new RegExp(`^${category}$`, 'i') });
    }

    if (state && state !== 'All' && state !== 'all') {
      const stateRegex = new RegExp(String(state).trim(), 'i');
      conditions.push({
        $or: [
          { state: stateRegex },
          { location: stateRegex }
        ]
      });
    }

    if (location && location !== 'All' && location !== 'all') {
      const locRegex = new RegExp(String(location).trim(), 'i');
      conditions.push({
        $or: [
          { location: locRegex },
          { state: locRegex }
        ]
      });
    }

    if (minPrice || maxPrice) {
      const priceCond: any = {};
      if (minPrice) priceCond.$gte = Number(minPrice);
      if (maxPrice && Number(maxPrice) > 0) priceCond.$lte = Number(maxPrice);
      conditions.push({ pricePerDay: priceCond });
    }

    if (hp) {
      conditions.push({ hp: { $gte: Number(hp) } });
    }

    if (isAvailable !== undefined && isAvailable !== null && isAvailable !== '') {
      conditions.push({ isAvailable: String(isAvailable) === 'true' });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};

    let sort: any = { createdAt: -1 };
    if (sortBy === 'rating') sort = { rating: -1, reviewCount: -1 };
    if (sortBy === 'price_asc' || sortBy === 'priceLowToHigh' || sortBy === 'priceAsc') sort = { pricePerDay: 1 };
    if (sortBy === 'price_desc' || sortBy === 'priceHighToLow' || sortBy === 'priceDesc') sort = { pricePerDay: -1 };
    if (sortBy === 'newest') sort = { createdAt: -1 };

    const equipmentList = await Equipment.find(filter).sort(sort);
    res.json(equipmentList.map(e => e.toJSON()));
  } catch (error: any) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch equipment listings.' });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }
    res.json(item.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch equipment details.' });
  }
};

export const getOwnerEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerId } = req.params;
    const list = await Equipment.find({ ownerId }).sort({ createdAt: -1 });
    res.json(list.map(e => e.toJSON()));
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch owner equipment.' });
  }
};

const getDefaultCategoryImage = (category: string = ''): string => {
  const cat = category.toLowerCase();
  if (cat.includes('harvester')) {
    return 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('spray')) {
    return 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('seed') || cat.includes('drill') || cat.includes('planter')) {
    return 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('rotavator') || cat.includes('cultivator') || cat.includes('tiller') || cat.includes('vakar') || cat.includes('plough')) {
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80';
};

export const createEquipment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      name,
      category,
      brand,
      model,
      hp,
      fuelType,
      description,
      location,
      state,
      district,
      taluka,
      village,
      pricePerDay,
      pricePerHour,
      pricePerHectare,
      pricingUnit = 'PER_HECTARE',
      operatorIncluded,
      operatorCostPerDay,
      operatorCostPerHour,
      images,
      specifications
    } = req.body;

    const resolvedPrice = Number(pricePerHectare || pricePerDay || pricePerHour);
    if (!name || !category || !brand || !resolvedPrice || !description) {
      res.status(400).json({ message: 'Please fill in all required equipment fields including rate.' });
      return;
    }

    const owner = await User.findById(req.user.userId);
    if (!owner) {
      res.status(404).json({ message: 'Owner user profile not found' });
      return;
    }

    // Build location string: Village, Taluka, District, State
    const locParts = [village, taluka, district, state].filter(Boolean).map((s: string) => s.trim()).filter(Boolean);
    const resolvedLocation = location || (locParts.length > 0 ? locParts.join(', ') : owner.location || 'India');

    const newEquipment = await Equipment.create({
      ownerId: owner._id,
      ownerName: owner.name,
      ownerPhone: owner.phone,
      name: name.trim(),
      category: category.trim(),
      brand: brand.trim(),
      model: model ? model.trim() : `${brand} Standard`,
      hp: Number(hp) || 45,
      fuelType: fuelType || 'Diesel',
      description: description.trim(),
      location: resolvedLocation,
      state: state || 'Maharashtra',
      district: district ? district.trim() : '',
      taluka: taluka ? taluka.trim() : '',
      village: village ? village.trim() : '',
      pricePerDay: resolvedPrice,
      pricePerHectare: pricePerHectare ? Number(pricePerHectare) : resolvedPrice,
      pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
      pricingUnit: pricingUnit || (pricePerHour && !pricePerHectare ? 'PER_HOUR' : 'PER_HECTARE'),
      operatorIncluded: Boolean(operatorIncluded),
      operatorCostPerDay: operatorIncluded ? Number(operatorCostPerDay || 0) : 0,
      operatorCostPerHour: operatorIncluded ? Number(operatorCostPerHour || 0) : 0,
      rating: 0,
      reviewCount: 0,
      isAvailable: true,
      images: images && Array.isArray(images) && images.length > 0 ? images : [getDefaultCategoryImage(category)],
      specifications: specifications || { Horsepower: `${hp || 45} HP`, Fuel: fuelType || 'Diesel' }
    });

    res.status(201).json(newEquipment.toJSON());
  } catch (error: any) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ message: error.message || 'Failed to create equipment listing.' });
  }
};

export const updateEquipment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await Equipment.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }

    if (item.ownerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden. You do not own this equipment.' });
      return;
    }

    Object.assign(item, req.body);
    await item.save();

    res.json(item.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update equipment.' });
  }
};

export const deleteEquipment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await Equipment.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }

    if (item.ownerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden. You do not own this equipment.' });
      return;
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment listing deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete equipment.' });
  }
};

export const toggleAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await Equipment.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Equipment not found' });
      return;
    }

    if (item.ownerId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json(item.toJSON());
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to toggle availability.' });
  }
};
