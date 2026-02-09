import User from '../models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export const seedAdmin = async () => {
    try {
        const admins = [
            { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD },
            { email: process.env.ADMIN2_EMAIL, password: process.env.ADMIN2_PASSWORD }
        ];

        for (const admin of admins) {
            if (!admin.email || !admin.password) continue;

            const existingUser = await User.findOne({ email: admin.email });
            if (existingUser) {
                // Force update password to ensure .env is source of truth
                const hashedPassword = await bcrypt.hash(admin.password, 10);
                existingUser.password = hashedPassword;
                if (!existingUser.companyId) {
                    existingUser.companyId = 'root-admin';
                    existingUser.companyName = 'Tickytoria Root';
                }
                await existingUser.save();
                console.log(`✅ Admin atualizado com senha do .env: ${admin.email}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(admin.password, 10);
            await User.create({
                name: 'Admin',
                email: admin.email,
                password: hashedPassword,
                role: 'admin',
                companyId: 'root-admin', // Default companyId for initial admins
                companyName: 'Tickytoria Root'
            });

            console.log(`🎉 Admin criado com sucesso: ${admin.email}`);
        }
    } catch (error) {
        console.error('❌ Erro ao criar admins:', error);
    }
};
