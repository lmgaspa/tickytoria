import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.URI;

if (!uri) {
  console.error('❌ A variável de ambiente URI não está definida.');
  process.exit(1);
}

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export async function connectDB(): Promise<void> {
  let attempt = 0;
  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(uri as string, {
        // Opções mais modernas não precisam setar useNewUrlParser/useUnifiedTopology em MongoDB 4+
        autoIndex: false,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
      } as any);
      console.log('✅ Conectado ao MongoDB com sucesso');
      return;
    } catch (error) {
      attempt += 1;
      const remaining = MAX_RETRIES - attempt;
      console.error(`❌ Erro ao conectar no MongoDB (tentativa ${attempt}/${MAX_RETRIES}):`, error);

      if (remaining <= 0) {
        console.error('❌ Não foi possível conectar ao MongoDB após várias tentativas. Encerrando a aplicação.');
        process.exit(1);
      }

      console.log(`🔁 Nova tentativa em ${RETRY_DELAY_MS / 1000}s (${remaining} tentativas restantes)...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}
