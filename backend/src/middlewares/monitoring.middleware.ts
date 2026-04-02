import { Request, Response, NextFunction } from 'express';
import prom from 'prom-client';

// Criar métricas
const httpRequestDuration = new prom.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new prom.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestSize = new prom.Histogram({
  name: 'http_request_size_bytes',
  help: 'Tamanho das requisições HTTP em bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000],
});

const httpResponseSize = new prom.Histogram({
  name: 'http_response_size_bytes',
  help: 'Tamanho das respostas HTTP em bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 1000, 5000, 10000, 50000],
});

const activeConnections = new prom.Gauge({
  name: 'http_active_connections',
  help: 'Número de conexões HTTP ativas',
  labelNames: ['method', 'route'],
});

export const monitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const route = req.route?.path || req.path;
  
  // Incrementar conexões ativas
  activeConnections.inc({ method: req.method, route });

  // Registar tamanho da requisição
  const requestSize = req.get('content-length') || '0';
  httpRequestSize.observe(
    { method: req.method, route },
    parseInt(requestSize)
  );

  // Interceptar a resposta original
  const originalSend = res.send;

  res.send = function (data: any) {
    // Registrar o tempo da requisição
    const duration = (Date.now() - startTime) / 1000;
    const statusCode = res.statusCode;

    // Métricas de duração
    httpRequestDuration.observe(
      { method: req.method, route, status_code: statusCode },
      duration
    );

    // Métricas totais
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: statusCode,
    });

    // Métrica de tamanho da resposta
    const responseSize = Buffer.byteLength(JSON.stringify(data));
    httpResponseSize.observe(
      { method: req.method, route, status_code: statusCode },
      responseSize
    );

    // Decrementar conexões ativas
    activeConnections.dec({ method: req.method, route });

    // Chamar a função original
    return originalSend.call(this, data);
  };

  next();
};

// Exportar registro de métricas
export const metricsRegistry = prom.register;

// Healthcheck endpoint
export const healthCheckMetrics = () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };
};
