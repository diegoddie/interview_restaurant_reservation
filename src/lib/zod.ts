import { z } from "zod";
import { SEATS_PER_TABLE } from "./constants";

export const reservationSchema = z.object({
    email: z.string().email(),
    seats: z.number().int().min(1).max(SEATS_PER_TABLE),
    date: z.string().datetime(),
});
  
export const querySchema = z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
    page: z.string().optional().transform(Number).default('1'),
    limit: z.string().optional().transform(Number).default('10'),
});