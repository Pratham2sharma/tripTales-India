import express from 'express';
import { createDestination, getAllDestinations, getBasicDestinations, getDestinationById, updateDestination, deleteDestination, getDestinationsByState } from '../controllers/destinationController';

const router = express.Router();

router.post('/destinations', createDestination);
router.get('/destinations/basic', getBasicDestinations);
router.get('/destinations', getAllDestinations);
router.get('/destinations/:id', getDestinationById);
router.put('/destinations/:id', updateDestination);
router.delete('/destinations/:id', deleteDestination);
router.get('/destinations/state/:state', getDestinationsByState);

export default router;
