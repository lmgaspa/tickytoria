import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'funcionário';
  whatsapp?: string;
  endereco?: string;
  companyId: string;
  companyName?: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'funcionário'],
    default: 'funcionário'
  },
  whatsapp: { type: String },
  endereco: { type: String },
  companyId: { type: String, required: true },
  companyName: { type: String }
});

export default mongoose.model<UserDocument>('User', UserSchema);
