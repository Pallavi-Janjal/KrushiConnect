import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// Helper regexes
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s'.]{2,50}$/;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    // Check presence of required fields
    if (!name || !email || !password || !phone || !role || !location) {
      res.status(400).json({ message: 'Please fill in all required fields: name, email, phone, location, role, and password.' });
      return;
    }

    // Name constraint
    const trimmedName = String(name).trim();
    if (!NAME_REGEX.test(trimmedName)) {
      res.status(400).json({ message: 'Name must be between 2 and 50 characters and contain only letters and spaces.' });
      return;
    }

    // Email constraint
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      res.status(400).json({ message: 'Please provide a valid email address (e.g. user@example.com).' });
      return;
    }

    // Phone constraint: strip +91, spaces, dashes, parentheses
    const sanitizedPhone = String(phone).replace(/^(\+91|91)/, '').replace(/[\s\-\(\)]/g, '').trim();
    if (!PHONE_REGEX.test(sanitizedPhone)) {
      res.status(400).json({ message: 'Mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.' });
      return;
    }

    // Location constraint
    const trimmedLocation = String(location).trim();
    if (trimmedLocation.length < 2) {
      res.status(400).json({ message: 'Please enter a valid location/district name (at least 2 characters).' });
      return;
    }

    // Password constraint
    const passStr = String(password);
    if (passStr.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }
    if (!/[A-Za-z]/.test(passStr) || !/\d/.test(passStr)) {
      res.status(400).json({ message: 'Password must contain at least one letter and one number.' });
      return;
    }

    // Role constraint
    const upperRole = String(role).toUpperCase();
    if (!['FARMER', 'EQUIPMENT_OWNER'].includes(upperRole)) {
      res.status(400).json({ message: 'Role must be either FARMER or EQUIPMENT_OWNER.' });
      return;
    }

    // Check existing email in database
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      res.status(400).json({ message: 'An account with this email address already exists. Please login instead.' });
      return;
    }

    // Check existing phone in database
    const existingPhone = await User.findOne({ phone: sanitizedPhone });
    if (existingPhone) {
      res.status(400).json({ message: 'An account with this mobile number already exists.' });
      return;
    }

    // Hash password & create user in MongoDB
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passStr, salt);

    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      role: upperRole as any,
      phone: sanitizedPhone,
      location: trimmedLocation,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`
    });

    const token = generateToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email
    });

    res.status(201).json({
      user: newUser.toJSON(),
      token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Registration failed due to a server error.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please enter both email and password.' });
      return;
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      res.status(400).json({ message: 'Please enter a valid email address format.' });
      return;
    }

    // Query database entry by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(400).json({ message: 'No registered user found with this email. Please check your email or register.' });
      return;
    }

    // Match password hash from database
    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect password. Please verify your credentials and try again.' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email
    });

    res.json({
      user: user.toJSON(),
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Login failed due to a server error.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found in database.' });
      return;
    }

    res.json({ user: user.toJSON() });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch current user' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
};

