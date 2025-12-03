import express from 'express';
import { bookWarehouse, getWarehouseById, getWarehouses, registerWarehouse } from '../controllers/warehouseController';
import { uploadMultipleImages } from '../middleware/uploadMiddleware';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Here, uploadMultipleImages middleware will process the files before the controller
router.post('/register', uploadMultipleImages, registerWarehouse);
router.get('/', getWarehouses);
router.get('/:id', getWarehouseById);
router.put('/:id/book', protect, bookWarehouse);

export default router;