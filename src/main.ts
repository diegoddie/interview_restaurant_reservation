import express from 'express';
import dotenv from 'dotenv';
import usersRoutes from './routes/users';   
import reservationsRoutes from './routes/reservations';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swaggerConfig';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.json({ 
        message: "Restaurant Reservation API is running!",
        documentation: `API documentation available at http://localhost:${process.env.PORT || 3000}/docs`
    });
});

app.use('/api/users', usersRoutes);
app.use('/api/reservations', reservationsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. API docs at http://localhost:${PORT}/docs`);
});
