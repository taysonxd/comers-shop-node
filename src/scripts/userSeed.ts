import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
    const email = 'demo@comershop.com';
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.delete({ where: { email }});

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Usuario Demo',
            password: hashedPassword,
        },
    });

    // Por motivos de prueba el access token se establece con duracion de 7 dias    
    const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    await prisma.account.upsert({
        where: {
        provider_providerAccountId: {
            provider: 'credentials',
            providerAccountId: user.id,
        },
        },
        update: {
            access_token: accessToken,
        },
        create: {
            userId: user.id,
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: user.id,
            access_token: accessToken,
        },
    });
    
    const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            revoked: false,
            expiresAt: refreshTokenExpiresAt,
        },
    });

    console.log(`✅ Usuario de prueba creado`);
    console.log(`email: `, email);
    console.log(`token de acceso para pruebas: `, accessToken);
}

main().catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
