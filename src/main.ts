import express from 'express';
import dotenv from 'dotenv';
import usersRoutes from './routes/users';   
import reservationsRoutes from './routes/reservations';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/reservations', reservationsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
