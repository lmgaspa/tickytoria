// Monitoramento com Prometheus
import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import routes from './routes';
import setupSwagger from './swagger';
import { seedAdmin } from './utils/seedAdmin';
import { monitoringMiddleware, metricsRegistry, healthCheckMetrics } from './middlewares/monitoring.middleware';
import prom from 'prom-client';

// ===== SEGURANÇA: Tipos de erro seguros para exposição =====
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// ===== SEGURANÇA: Mensagens seguras (não vazam dados sensíveis) =====
const SAFE_ERROR_MESSAGES = {
  [ErrorType.VALIDATION_ERROR]: 'Dados fornecidos são inválidos',
  [ErrorType.AUTHENTICATION_ERROR]: 'Credenciais inválidas',
  [ErrorType.AUTHORIZATION_ERROR]: 'Acesso não autorizado',
  [ErrorType.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorType.RATE_LIMITED]: 'Muitas tentativas, tente novamente mais tarde',
  [ErrorType.DATABASE_ERROR]: 'Erro temporário no sistema',
  [ErrorType.INTERNAL_ERROR]: 'Erro interno do servidor'
};

// ===== SEGURANÇA: Função para sanitizar erros =====
function sanitizeError(err: any): { type: ErrorType, status: number } {
  // Classificar erro baseado no tipo/name
  if (err.name === 'ValidationError' || err.message?.includes('validation')) {
    return { type: ErrorType.VALIDATION_ERROR, status: 400 };
  }
  if (err.name === 'UnauthorizedError' || err.message?.includes('unauthorized')) {
    return { type: ErrorType.AUTHENTICATION_ERROR, status: 401 };
  }
  if (err.name === 'ForbiddenError' || err.message?.includes('forbidden')) {
    return { type: ErrorType.AUTHORIZATION_ERROR, status: 403 };
  }
  if (err.status === 404 || err.message?.includes('not found')) {
    return { type: ErrorType.NOT_FOUND, status: 404 };
  }
  if (err.message?.includes('rate limit') || err.message?.includes('too many')) {
    return { type: ErrorType.RATE_LIMITED, status: 429 };
  }
  if (err.name === 'MongoError' || err.message?.includes('database') || err.message?.includes('mongo')) {
    return { type: ErrorType.DATABASE_ERROR, status: 500 };
  }

  // Default: erro interno
  return { type: ErrorType.INTERNAL_ERROR, status: 500 };
}

const app = express();

const allowedOrigins = [
  'https://tickytoria.com',
  'https://www.tickytoria.com',
  'https://tickytoria-d1c0ff69e067.herokuapp.com',  // Heroku frontend domain
  'http://localhost:5173',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Middleware de monitoramento (antes das rotas)
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

const startServer = async () => {
  await connectDB();
  await seedAdmin();

  app.use('/api', routes);
  
  // Swagger Documentation
  setupSwagger(app);
  
  // ===== SEGURANÇA: Handler de erro global seguro =====
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // 1. Sanitizar o erro (classificar e determinar status seguro)
    const { type, status } = sanitizeError(err);

    // 2. Log estruturado (NUNCA exponha para cliente)
    console.error('🔴 ERRO CAPTURADO:', {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
      errorType: type,
      status: status
    });

    // 3. Resposta segura para cliente
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(status).json({
      success: false,
      error: {
        type: type,
        message: SAFE_ERROR_MESSAGES[type],
        ...(isDevelopment && {
          // APENAS em desenvolvimento - debug limitado
          debug: {
            originalMessage: err.message?.substring(0, 100), // Limitado
            stack: err.stack?.split('\n').slice(0, 3) // Apenas primeiras 3 linhas
          }
        })
      }
    });
  });
  
  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Métricas disponíveis em http://localhost:${PORT}/metrics`);
    console.log(`💚 Health check em http://localhost:${PORT}/health`);
  });
};

startServer();
