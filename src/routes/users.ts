import express from 'express';
import { createUser } from '../controllers/userController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management operations
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Creates a new user with a name and a unique email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email of the user.
 *                 example: john.doe@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input (e.g. missing or invalid fields)
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */

router.post('/', createUser);

export default router;
