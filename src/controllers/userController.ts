import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { userSchema } from '../lib/zod';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = userSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(409).json({ error: 'User already exists' });
            return;
        }

        const user = await prisma.user.create({ data: { name, email } });

        res.status(201).json(user);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: err.errors });
            return;
        }
        res.status(500).json({ error: 'Server error' });
    }
}