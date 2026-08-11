import express from 'express';
import {
  getApprovers,
  createApprover,
  getApproverById,
  updateApprover,
  toggleApproverStatus
} from '../controllers/approverController.js';

const router = express.Router();

router.get('/', getApprovers);
router.post('/', createApprover);
router.get('/:id', getApproverById);
router.put('/:id', updateApprover);
router.patch('/:id/status', toggleApproverStatus);

export default router;
