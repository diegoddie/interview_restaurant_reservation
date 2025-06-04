import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { reservationSchema, querySchema } from '../lib/zod';
import { OPEN_HOUR, CLOSE_HOUR, TOTAL_TABLES } from '../lib/constants';

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { email, seats, date } = reservationSchema.parse(req.body);
    const reservationDate = new Date(date);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // 🔄 Normalize the time to minute 00 (e.g., 19:32 → 19:00)
    reservationDate.setMinutes(0, 0, 0);

    const now = new Date();
    if (reservationDate < now) {
      res.status(400).json({ error: 'Cannot make a reservation in the past' });
    }

    const hour = reservationDate.getHours();
    if (hour < OPEN_HOUR || hour >= CLOSE_HOUR) {
      res.status(400).json({ error: `Reservations allowed only between ${OPEN_HOUR}:00 and ${CLOSE_HOUR}:00` });
    }

    const reservationsAtThatTime = await prisma.reservation.findMany({
      where: { date: reservationDate },
    });

    if (reservationsAtThatTime.length >= TOTAL_TABLES) {
      res.status(409).json({ error: 'No available tables at this time' });
    }

    // Create a Set of table numbers that are already reserved at the selected time
    const occupied = new Set(reservationsAtThatTime.map(r => r.tableNumber));

    // Find the first available table number 
    const tableNumber = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1).find(t => !occupied.has(t));

    if (!tableNumber) {
      res.status(409).json({ error: 'No available table found' });
    }

    const newReservation = await prisma.reservation.create({
      data: { userId: user.id, seats, date: reservationDate, tableNumber: tableNumber! },
    });

    res.status(201).json(newReservation);
  } catch (err) {
    if (err instanceof z.ZodError)
      res.status(400).json({ error: err.errors });

    res.status(500).json({ error: 'Server error' });
  }
};

export const getReservations = async (req: Request, res: Response) => {
  try {
    const { from, to, page, limit } = querySchema.parse(req.query);

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (fromDate > toDate) {
      res.status(400).json({ error: "'from' date must be before 'to' date" });
      return;
    }

    const totalItems = await prisma.reservation.count({
      where: {
        date: { gte: fromDate, lte: toDate },
      },
    });

    // Calculate how many pages are needed for pagination
    const totalPages = Math.ceil(totalItems / limit);

    // Get the reservations for the given date range
    const reservations = await prisma.reservation.findMany({
      where: {
        date: { gte: fromDate, lte: toDate },
      },
      orderBy: { date: 'asc' },
      skip: (page - 1) * limit, // Skip items from previous pages
      take: limit, // Take only the number of items for the current page
      include: { user: true }, 
    });

    res.json({
      currentPage: page,
      totalPages,
      totalItems,
      reservations,
    });
  } catch (err) {
    if (err instanceof z.ZodError){
      res.status(400).json({ error: err.errors });
      return;
    }

    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.reservation.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Reservation not found' });
    }

    res.status(500).json({ error: 'Server error' });
  }
};
