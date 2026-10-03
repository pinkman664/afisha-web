import { Router } from 'express';
import { MovieController } from '../controllers/MovieController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import multer from 'multer';

import path from 'path';
import fs from 'fs';

const router = Router();
const mc = new MovieController();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'coverImage' ? 'uploads/posters' : 'uploads/trailers';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

router.get('/', mc.getAll);
router.get('/:id', mc.getOne);
router.get('/:id/trailer', mc.getTrailer);
router.get('/:id/poster', mc.getPoster);

router.post('/', 
  authMiddleware, 
  adminMiddleware, 
  upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), 
  mc.create
);

router.put('/:id', 
  authMiddleware, 
  adminMiddleware, 
  upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'trailer', maxCount: 1 }]), 
  mc.update
);

router.delete('/:id', authMiddleware, adminMiddleware, mc.delete);

export default router;
