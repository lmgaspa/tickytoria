# 📊 Monitoramento com Prometheus e Grafana

## Visão Geral

Esta stack de monitoramento fornece observabilidade completa para o backend Tickytoria com:

- **Prometheus**: Coleta e armazena métricas
- **Grafana**: Visualização de dashboards
- **prom-client**: Instrumentação de métricas HTTP

## 🚀 Iniciando a Stack

### Pré-requisitos
- Docker
- Docker Compose

### Passos

1. **Clone o repositório e navegue até o backend:**
   ```bash
   cd backend
   ```

2. **Crie um arquivo `.env` baseado em `.env.example`:**
   ```bash
   cp .env.example .env
   ```

3. **Inicie os containers:**
   ```bash
   docker-compose up -d
   ```

4. **Aguarde os containers iniciarem (healthchecks):**
   ```bash
   docker-compose ps
   ```

## 🌐 Acessar os Serviços

| Serviço | URL | Padrão |
|---------|-----|--------|
| **Backend** | http://localhost:10000 | - |
| **Backend Health** | http://localhost:10000/health | - |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3000 | admin / admin |
| **Métricas Prometheus** | http://localhost:10000/metrics | - |

## 📈 Métricas Disponíveis

### HTTP Metrics
- `http_requests_total`: Total de requisições HTTP por método, rota e status
- `http_request_duration_seconds`: Duração das requisições HTTP
- `http_request_size_bytes`: Tamanho das requisições em bytes
- `http_response_size_bytes`: Tamanho das respostas em bytes
- `http_active_connections`: Número de conexões ativas

### Traces
- Através do Jaeger é possível rastrear requisições pela aplicação inteira
- Latência entre serviços
- Erros e exceções

## 🎯 Dashboard Grafana

Um dashboard pré-configurado está disponível em Grafana:

1. Acesse http://localhost:3000
2. Login: `admin` / `admin` (altere a senha!)
3. Vá para "Dashboards" → "Tickytoria Backend Monitoring"

### Painéis Disponíveis
1. **Taxa de Requisições HTTP**: Requisições por segundo
2. **Conexões Ativas**: Número de conexões simultâneas
3. **Latência HTTP**: p95 e p99 percentis
4. **Requisições por Status Code**: Distribuição de status codes

## 📝 Logs e Debugging

### Verificar logs de um container:
```bash
docker-compose logs -f backend
docker-compose logs -f prometheus
docker-compose logs -f grafana
```

### Parar e remover containers:
```bash
docker-compose down
```

### Parar e remover volumes (CUIDADO!):
```bash
docker-compose down -v
```

## 🛠️ Customizações

### Adicionar nova métrica no código
```typescript
import prom from 'prom-client';

const customCounter = new prom.Counter({
  name: 'custom_metric_name',
  help: 'Descrição da métrica',
  labelNames: ['label1', 'label2'],
});

customCounter.inc({ label1: 'value1', label2: 'value2' });
```

### Modificar interval de scraping do Prometheus
Edite `monitoring/prometheus.yml` e altere `scrape_interval`.

### Customizar dashboard Grafana
1. Acesse Grafana
2. Editar dashboard
3. Adicionar novos painéis / gráficos
4. As mudanças são persistidas no volume `grafana_data`

## 🚨 Alertas

Para configurar alertas no Grafana:

1. Vá para um painel
2. Clique em "Alert" na aba acima do gráfico
3. Configure as condições e notificações

## 📊 Consultas Prometheus úteis

### Taxa de requisições por rota (últimos 5 minutos):
```
rate(http_requests_total[5m])
```

### Latência p95 por rota:
```
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Taxa de erros (5xx):
```
rate(http_requests_total{status_code=~"5.."}[5m])
```

### Conexões ativas por rota:
```
http_active_connections
```

## 🔐 Segurança

### Em Produção:
1. **Altere a senha do Grafana**:
   ```bash
   docker-compose exec grafana grafana-cli admin reset-admin-password newpassword
   ```

2. **Configure CORS adequadamente** em `src/server.ts`

3. **Use variáveis de ambiente seguras**:
   ```bash
   GRAFANA_PASSWORD=your-strong-password
   MONGO_PASSWORD=your-strong-password
   ```

4. **Proteja o endpoint `/metrics`** com autenticação (opcional)

5. **Use reverse proxy** (nginx/traefik) com SSL

## 💾 Backup e Restore

### Backup do Grafana:
```bash
docker-compose exec grafana grafana-cli admin export-users
docker-compose exec grafana grafana-cli admin export-dashboard
```

### Backup do MongoDB:
```bash
docker-compose exec mongodb mongodump --uri="mongodb://admin:admin@localhost:27017/tickytoria"
```

## 🐛 Troubleshooting

### Backend não conecta ao MongoDB
```bash
# Verificar conexão
docker-compose logs mongodb
docker-compose exec backend npm run build
```

### Prometheus não consegue scrape das métricas
```bash
# Verificar config
curl http://localhost:9090/api/v1/targets
```

### Grafana não consegue conectar ao Prometheus
1. Vá para Configuration → Data Sources
2. Clique em Prometheus
3. Verifique a URL: `http://prometheus:9090`

## 📚 Documentação

- [OpenTelemetry Node.js](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
- [Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/)
- [Grafana](https://grafana.com/docs/grafana/latest/)
- [Jaeger](https://www.jaegertracing.io/docs/)

## 📞 Suporte

Para questões ou problemas, verifique:
1. Os logs dos containers
2. Configuração do `.env`
3. Status dos containers com `docker-compose ps`
