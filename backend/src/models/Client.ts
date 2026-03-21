import mongoose, { Document, Schema } from 'mongoose';

export interface ClientDocument extends Document {
  name: string;
  empresa: string;
  cpf?: string;
  cnpj?: string;
  emailEmpresa?: string;
  telefone?: string;
  whatsapp?: string;
  endereco: string;
  createdAt?: Date;
  companyId: string;
}

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  empresa: { type: String},
  cpf: { type: String, required: true },
  cnpj: { type: String },
  emailEmpresa: { type: String, required: true, index: true },
  telefone: { type: String },
  whatsapp: { type: String },
  endereco: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  companyId: { type: String }
});

export default mongoose.model<ClientDocument>('Client', ClientSchema);
