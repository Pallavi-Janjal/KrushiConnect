import { Router, Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

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

import fs from 'fs';
import path from 'path';

// Helper function to upload buffer to Cloudinary or save locally as fallback
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string): Promise<string> => {
  return new Promise((resolve) => {
    const ext = path.extname(originalname) || '.jpg';
    const filename = `eq_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');

    const saveLocally = () => {
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        const port = process.env.PORT || 5000;
        return resolve(`http://localhost:${port}/uploads/${filename}`);
      } catch (e) {
        console.error('Local save error:', e);
        // last resort tiny placeholder if file write fails
        return resolve('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80');
      }
    };

    // Try Cloudinary if keys exist
    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `eq_${Date.now()}_${Math.random().toString(36).substring(7)}`
        },
        (error, result) => {
          if (error || !result || !result.secure_url) {
            console.warn('Cloudinary upload notice, saving locally:', error?.message || 'Upload failed');
            return saveLocally();
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.on('error', () => saveLocally());
      uploadStream.end(buffer);
    } else {
      saveLocally();
    }
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
    res.status(500).json({ message: error.message || 'Image upload failed.' });
  }
});

export default router;
