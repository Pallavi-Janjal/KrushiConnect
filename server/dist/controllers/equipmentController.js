"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAvailability = exports.deleteEquipment = exports.updateEquipment = exports.createEquipment = exports.getOwnerEquipment = exports.getEquipmentById = exports.getAllEquipment = void 0;
const Equipment_1 = require("../models/Equipment");
const User_1 = require("../models/User");
const getAllEquipment = async (req, res) => {
    try {
        const { query, category, state, location, minPrice, maxPrice, hp, isAvailable, sortBy } = req.query;
        const conditions = [];
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
            const priceCond = {};
            if (minPrice)
                priceCond.$gte = Number(minPrice);
            if (maxPrice && Number(maxPrice) > 0)
                priceCond.$lte = Number(maxPrice);
            conditions.push({ pricePerDay: priceCond });
        }
        if (hp) {
            conditions.push({ hp: { $gte: Number(hp) } });
        }
        if (isAvailable !== undefined && isAvailable !== null && isAvailable !== '') {
            conditions.push({ isAvailable: String(isAvailable) === 'true' });
        }
        const filter = conditions.length > 0 ? { $and: conditions } : {};
        let sort = { createdAt: -1 };
        if (sortBy === 'rating')
            sort = { rating: -1, reviewCount: -1 };
        if (sortBy === 'price_asc' || sortBy === 'priceLowToHigh' || sortBy === 'priceAsc')
            sort = { pricePerDay: 1 };
        if (sortBy === 'price_desc' || sortBy === 'priceHighToLow' || sortBy === 'priceDesc')
            sort = { pricePerDay: -1 };
        if (sortBy === 'newest')
            sort = { createdAt: -1 };
        const equipmentList = await Equipment_1.Equipment.find(filter).sort(sort);
        res.json(equipmentList.map(e => e.toJSON()));
    }
    catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch equipment listings.' });
    }
};
exports.getAllEquipment = getAllEquipment;
const getEquipmentById = async (req, res) => {
    try {
        const item = await Equipment_1.Equipment.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: 'Equipment not found' });
            return;
        }
        res.json(item.toJSON());
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch equipment details.' });
    }
};
exports.getEquipmentById = getEquipmentById;
const getOwnerEquipment = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const list = await Equipment_1.Equipment.find({ ownerId }).sort({ createdAt: -1 });
        res.json(list.map(e => e.toJSON()));
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to fetch owner equipment.' });
    }
};
exports.getOwnerEquipment = getOwnerEquipment;
const createEquipment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { name, category, brand, model, hp, fuelType, description, location, state, pricePerDay, pricePerHour, operatorIncluded, operatorCostPerDay, images, specifications } = req.body;
        if (!name || !category || !brand || !pricePerDay || !description) {
            res.status(400).json({ message: 'Please fill in all required equipment fields.' });
            return;
        }
        const owner = await User_1.User.findById(req.user.userId);
        if (!owner) {
            res.status(404).json({ message: 'Owner user profile not found' });
            return;
        }
        const newEquipment = await Equipment_1.Equipment.create({
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
            location: location || owner.location || 'India',
            state: state || 'Haryana',
            pricePerDay: Number(pricePerDay),
            pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
            operatorIncluded: Boolean(operatorIncluded),
            operatorCostPerDay: operatorIncluded ? Number(operatorCostPerDay || 0) : 0,
            rating: 0,
            reviewCount: 0,
            isAvailable: true,
            images: images && Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'],
            specifications: specifications || { Horsepower: `${hp || 45} HP`, Fuel: fuelType || 'Diesel' }
        });
        res.status(201).json(newEquipment.toJSON());
    }
    catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ message: error.message || 'Failed to create equipment listing.' });
    }
};
exports.createEquipment = createEquipment;
const updateEquipment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const item = await Equipment_1.Equipment.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to update equipment.' });
    }
};
exports.updateEquipment = updateEquipment;
const deleteEquipment = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const item = await Equipment_1.Equipment.findById(req.params.id);
        if (!item) {
            res.status(404).json({ message: 'Equipment not found' });
            return;
        }
        if (item.ownerId.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Forbidden. You do not own this equipment.' });
            return;
        }
        await Equipment_1.Equipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Equipment listing deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to delete equipment.' });
    }
};
exports.deleteEquipment = deleteEquipment;
const toggleAvailability = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const item = await Equipment_1.Equipment.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Failed to toggle availability.' });
    }
};
exports.toggleAvailability = toggleAvailability;
