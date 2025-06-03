import express from 'express';
import { createReservation, deleteReservation } from '../controllers/reservationController';
import { getReservations } from '../controllers/reservationController';

const router = express.Router();

router.post('/', createReservation);
router.get('/', getReservations);
router.delete('/:id', deleteReservation);

export default router;
