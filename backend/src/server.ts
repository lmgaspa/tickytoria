import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import routes from './routes';
import setupSwagger from './swagger';
import { seedAdmin } from './utils/seedAdmin';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  app.use('/api', routes);
  
  // Swagger Documentation
  setupSwagger(app);
  
  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
};

startServer();
