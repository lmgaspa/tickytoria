@echo off
REM Script de Inicialização - Monitoramento Tickytoria

echo.
echo 🚀 Iniciando stack de monitoramento Tickytoria...
echo.

REM Verificar se Docker está instalado
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker não está instalado!
    exit /b 1
)

REM Verificar se Docker Compose está instalado
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose não está instalado!
    exit /b 1
)

REM Criar .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado. Edite-o antes de continuar se necessário.
)

echo.
echo 📦 Iniciando containers...
docker-compose up -d

echo.
echo ⏳ Aguardando containers ficarem saudáveis...
timeout /t 5

echo.
echo 📊 Status dos containers:
docker-compose ps

echo.
echo ✅ Stack iniciada com sucesso!
echo.
echo 🌐 URLs disponíveis:
echo    Backend: http://localhost:10000
echo    Health: http://localhost:10000/health
echo    Prometheus: http://localhost:9090
echo    Grafana: http://localhost:3000 (admin/admin)
echo    Métricas: http://localhost:10000/metrics
echo.
