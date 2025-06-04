import express from 'express';
import { createReservation, deleteReservation, getReservations } from '../controllers/reservationController';

const router = express.Router();

/**
 * @openapi
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - seats
 *               - date
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@example.com
 *               seats:
 *                 type: integer
 *                 example: 4
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-06-04T20:00:00Z
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Validation error or invalid date/time
 *       404:
 *         description: User not found
 *       409:
 *         description: No available tables at this time
 *       500:
 *         description: Internal server error
 */
router.post('/', createReservation);

/**
 * @openapi
 * /reservations:
 *   get:
 *     summary: Get reservations by date range with pagination
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: from
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-06-01
 *       - name: to
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: 2025-06-30
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of reservations
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', getReservations);

/**
 * @openapi
 * /reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags:
 *       - Reservations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteReservation);

export default router;
