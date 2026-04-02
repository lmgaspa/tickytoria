import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import { monitoringMiddleware, metricsRegistry, healthCheckMetrics } from './middlewares/monitoring.middleware';
import prom from 'prom-client';

dotenv.config();

const app: Application = express();

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

app.use(cors({
  origin: [
    'http://localhost:5173',           // Vite
    'http://localhost:8080',           // Vue CLI
    'https://www.tickytoria.com' // Produção
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Middleware de monitoramento (deve vir antes das rotas)
app.use(monitoringMiddleware);

// Endpoint de métricas para Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prom.register.contentType);
  res.end(await prom.register.metrics());
});

// Endpoint de healthcheck
app.get('/health', (req, res) => {
  res.status(200).json(healthCheckMetrics());
});

app.use('/api', routes);

export default app;