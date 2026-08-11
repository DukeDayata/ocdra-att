import express from 'express';
import {
  createATT,
  getATTRecords,
  getATTStats,
  getATTByReferenceNo,
  getATTById,
  updateATT,
  updateATTStatus,
  archiveATT
} from '../controllers/attController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createATTSchema, updateATTStatusSchema } from '../validators/attValidators.js';

const router = express.Router();

router.get('/stats', getATTStats);
router.get('/reference/:referenceNo', getATTByReferenceNo);
router.get('/', getATTRecords);
router.post('/', validateRequest(createATTSchema), createATT);
router.get('/:id', getATTById);
router.put('/:id', updateATT);
router.patch('/:id/status', validateRequest(updateATTStatusSchema), updateATTStatus);
router.patch('/:id/archive', archiveATT);

export default router;
