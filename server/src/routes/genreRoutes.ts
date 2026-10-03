import { Router } from 'express';
import { GenreController } from '../controllers/GenreController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();
const gc = new GenreController();

router.get('/', gc.getAll);                                          
router.post('/', authMiddleware, adminMiddleware, gc.create);        
router.put('/:id', authMiddleware, adminMiddleware, gc.update);     
router.delete('/:id', authMiddleware, adminMiddleware, gc.remove);   

export default router;
