import express from 'express';
import {
  getPersonnel,
  createPersonnel,
  getPersonnelById,
  updatePersonnel,
  togglePersonnelStatus
} from '../controllers/personnelController.js';

const router = express.Router();

router.get('/', getPersonnel);
router.post('/', createPersonnel);
router.get('/:id', getPersonnelById);
router.put('/:id', updatePersonnel);
router.patch('/:id/status', togglePersonnelStatus);

export default router;
