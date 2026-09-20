import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import dns from 'dns';
import cloudinary from '../config/cloudinary';

// Ensure IPv4 first to avoid DNS delays with Cloudinary
dns.setDefaultResultOrder('verbatim');

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to upload buffer directly to Cloudinary in folder 'krushi_connect'
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
      return reject(
        new Error(
          'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.'
        )
      );
    }

    const ext = path.extname(originalname).replace('.', '').toLowerCase() || 'jpg';
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
    const publicId = `eq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const uploadOptions: any = {
      folder: 'krushi_connect',
      resource_type: 'image',
      public_id: publicId,
      format: cleanExt
    };

    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result || !result.secure_url) {
          console.error('Cloudinary upload error:', error);
          const errorMsg = error?.message || 'Failed to upload image to Cloudinary';
          if (errorMsg.includes('missing permissions') || error?.http_code === 403) {
            return reject(
              new Error(
                'Cloudinary Permission Error: Your API key is missing "create" permissions. In Cloudinary Console > Settings > Access Keys, edit your key and check "Create" permission, or use your Master API Key.'
              )
            );
          }
          return reject(new Error(errorMsg));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.on('error', (err) => {
      console.error('Cloudinary stream network error:', err);
      reject(err);
    });

    uploadStream.end(buffer);
  });
};

// Single or multiple image upload
router.post('/', upload.array('images', 5), async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    
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
  } catch (error: any) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: error.message || 'Image upload to Cloudinary failed.' });
  }
});

export default router;
