"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
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
// Helper function to upload buffer to Cloudinary or encode as base64 data URL as fallback
// Base64 is stored directly in MongoDB and never lost on server restarts (unlike local disk)
const uploadBufferToCloudinary = (buffer, originalname) => {
    return new Promise((resolve) => {
        const mimeType = originalname.match(/\.(png)$/i)
            ? 'image/png'
            : originalname.match(/\.(gif)$/i)
                ? 'image/gif'
                : originalname.match(/\.(webp)$/i)
                    ? 'image/webp'
                    : 'image/jpeg';
        const saveAsBase64 = () => {
            // Store as base64 data URL — persists in MongoDB, no disk dependency
            const base64 = buffer.toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64}`;
            console.log(`Saving image as base64 data URL (${Math.round(buffer.length / 1024)}KB)`);
            return resolve(dataUrl);
        };
        // Try Cloudinary if keys exist
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                resource_type: 'image',
                public_id: `krushiconnect/eq_${Date.now()}_${Math.random().toString(36).substring(7)}`
            }, (error, result) => {
                if (error || !result || !result.secure_url) {
                    console.warn('Cloudinary upload failed, falling back to base64:', error?.message || 'Upload failed');
                    return saveAsBase64();
                }
                console.log('Image uploaded to Cloudinary:', result.secure_url);
                resolve(result.secure_url);
            });
            uploadStream.on('error', () => saveAsBase64());
            uploadStream.end(buffer);
        }
        else {
            console.log('Cloudinary not configured, saving as base64 data URL');
            saveAsBase64();
        }
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
        res.status(500).json({ message: error.message || 'Image upload failed.' });
    }
});
exports.default = router;
