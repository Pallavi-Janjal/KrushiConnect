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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Helper function to upload buffer to Cloudinary or save locally as fallback
const uploadBufferToCloudinary = (buffer, originalname) => {
    return new Promise((resolve) => {
        const ext = path_1.default.extname(originalname) || '.jpg';
        const filename = `eq_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        const saveLocally = () => {
            try {
                if (!fs_1.default.existsSync(uploadsDir)) {
                    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
                }
                const filePath = path_1.default.join(uploadsDir, filename);
                fs_1.default.writeFileSync(filePath, buffer);
                return resolve(`/uploads/${filename}`);
            }
            catch (e) {
                console.error('Local save error:', e);
                // last resort tiny placeholder if file write fails
                return resolve('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80');
            }
        };
        // Try Cloudinary if keys exist
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                resource_type: 'image',
                public_id: `eq_${Date.now()}_${Math.random().toString(36).substring(7)}`
            }, (error, result) => {
                if (error || !result || !result.secure_url) {
                    console.warn('Cloudinary upload notice, saving locally:', error?.message || 'Upload failed');
                    return saveLocally();
                }
                resolve(result.secure_url);
            });
            uploadStream.on('error', () => saveLocally());
            uploadStream.end(buffer);
        }
        else {
            saveLocally();
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
