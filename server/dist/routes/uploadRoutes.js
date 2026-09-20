"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dns_1 = __importDefault(require("dns"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Ensure IPv4 first to avoid DNS delays with Cloudinary
dns_1.default.setDefaultResultOrder('verbatim');
const router = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});
// Helper function to upload buffer directly to Cloudinary in folder 'krushi_connect'
const uploadBufferToCloudinary = (buffer, originalname) => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
            return reject(new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.'));
        }
        const ext = path_1.default.extname(originalname).replace('.', '').toLowerCase() || 'jpg';
        const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
        const publicId = `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const uploadOptions = {
            folder: 'krushi_connect',
            resource_type: 'image',
            public_id: publicId,
            format: cleanExt
        };
        if (process.env.CLOUDINARY_UPLOAD_PRESET) {
            uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
        }
        const uploadStream = cloudinary_1.default.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error || !result || !result.secure_url) {
                console.error('Cloudinary upload error:', error);
                const errorMsg = error?.message || 'Failed to upload image to Cloudinary';
                if (errorMsg.includes('missing permissions') || error?.http_code === 403) {
                    return reject(new Error('Cloudinary Permission Error: Your API key is missing "create" permissions. In Cloudinary Console > Settings > Access Keys, edit your key and check "Create" permission, or use your Master API Key.'));
                }
                return reject(new Error(errorMsg));
            }
            resolve(result.secure_url);
        });
        uploadStream.on('error', (err) => {
            console.error('Cloudinary stream network error:', err);
            reject(err);
        });
        uploadStream.end(buffer);
    });
};
// Single or multiple image upload
router.post('/', upload.array('images', 5), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ message: 'No image file uploaded.' });
            return;
        }
        const uploadPromises = files.map(file => uploadBufferToCloudinary(file.buffer, file.originalname));
        const urls = await Promise.all(uploadPromises);
        res.status(200).json({
            success: true,
            url: urls[0],
            urls
        });
    }
    catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: error.message || 'Image upload to Cloudinary failed.' });
    }
});
exports.default = router;
