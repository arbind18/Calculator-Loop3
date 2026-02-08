
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Manually load .env since we're running with tsx
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    console.log(`Loading .env from ${envPath}`);
    dotenv.config({ path: envPath });
} else {
    console.warn(`WARNING: .env file not found at ${envPath}`);
}

async function diagnose() {
    console.log('--- DIAGNOSTIC START ---');

    // 1. Check Env Vars
    const requiredEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL'];
    console.log('Checking Environment Variables:');
    const missing = [];
    requiredEnv.forEach(env => {
        if (process.env[env]) {
            // Mask secrets
            const val = process.env[env]!;
            const masked = val.length > 8 ? val.substring(0, 4) + '...' + val.substring(val.length - 4) : '***';
            console.log(`✅ ${env} is set (${masked}).`);
        } else {
            console.error(`❌ ${env} is MISSING!`);
            missing.push(env);
        }
    });

    if (missing.length > 0) {
        console.error('⚠️ Critical missing environment variables. Cannot proceed.');
        return;
    }

    // 2. Check Database Connection
    console.log('\nChecking Database Connection...');
    const prisma = new PrismaClient({
        // Log queries to verify connection activity if needed
        log: ['error', 'warn'],
    });

    try {
        await prisma.$connect();
        console.log('✅ Database Connection Successful.');

        // 3. Try to read generated client info
        // @ts-ignore
        console.log('Prisma Client Version:', PrismaClient.dmmf?.datamodel?.models?.length || 'Unknown');

        // 4. Try a simple query
        const userCount = await prisma.user.count();
        console.log(`✅ Database Query Successful. User count: ${userCount}`);

    } catch (error: any) {
        console.error('❌ Database Connection/Query Failed:');
        console.error(error.message);
        if (error.code) console.error('Error Code:', error.code);
    } finally {
        await prisma.$disconnect();
    }

    console.log('--- DIAGNOSTIC END ---');
}

diagnose().catch(err => console.error('Fatal Script Error:', err));
