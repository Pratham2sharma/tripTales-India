import express from 'express';
import { createCineplace, getAllCineplace, getCineplaceById, updateCineplace, deleteCineplace } from '../controllers/cineplaceController';

const router = express.Router();

router.post('/cineplace', createCineplace);
router.get('/cineplace', getAllCineplace);
router.get('/cineplace/:id', getCineplaceById);
router.put('/cineplace/:id', updateCineplace);
router.delete('/cineplace/:id', deleteCineplace);


export default router;
