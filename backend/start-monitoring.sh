#!/bin/bash

# Core de Monitoramento - Script de Inicialização

set -e

echo "🚀 Iniciando stack de monitoramento Tickytoria..."
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado!"
    exit 1
fi

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Edite-o antes de continuar se necessário."
fi

echo ""
echo "📦 Iniciando containers..."
docker-compose up -d

echo ""
echo "⏳ Aguardando containers ficarem saudáveis..."
sleep 5

# Verificar status dos containers
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "✅ Stack iniciada com sucesso!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   Backend: http://localhost:10000"
echo "   Health: http://localhost:10000/health"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo "   Métricas: http://localhost:10000/metrics"
echo ""
