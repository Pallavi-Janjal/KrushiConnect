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

// Helper function to upload buffer to Cloudinary or encode as base64 data URL as fallback
// Base64 is stored directly in MongoDB and never lost on server restarts (unlike local disk)
const uploadBufferToCloudinary = (buffer: Buffer, originalname: string): Promise<string> => {
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
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: `krushiconnect/eq_${Date.now()}_${Math.random().toString(36).substring(7)}`
        },
        (error, result) => {
          if (error || !result || !result.secure_url) {
            console.warn('Cloudinary upload failed, falling back to base64:', error?.message || 'Upload failed');
            return saveAsBase64();
          }
          console.log('Image uploaded to Cloudinary:', result.secure_url);
          resolve(result.secure_url);
        }
      );

      uploadStream.on('error', () => saveAsBase64());
      uploadStream.end(buffer);
    } else {
      console.log('Cloudinary not configured, saving as base64 data URL');
      saveAsBase64();
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
