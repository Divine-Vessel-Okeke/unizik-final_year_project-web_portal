// prisma/seed.ts

import { PrismaClient, FeeCategory, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Wipe old records
  await prisma.appeal.deleteMany();
  await prisma.fraudAuditLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.student.deleteMany();
  await prisma.admin.deleteMany();

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);

  // 2. Create Admin Account
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: adminPasswordHash,
      fullName: 'Dr. Prof. B.O. Ekeh',
      role: 'BURSARY_DIRECTOR',
    },
  });

  // 3. Create Student 1 (Chinedu)
  const student1 = await prisma.student.create({
    data: {
      matricNumber: '2022514001',
      email: 'c.okafor@unizik.edu.ng',
      password: defaultPasswordHash,
      firstName: 'Chinedu',
      lastName: 'Okafor',
      department: 'Computer Science',
      level: 400,
      loginDeviceId: 'UNIZIK_FP_SEED_CHINEDU',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      studentId: student1.id,
      category: FeeCategory.TUITION,
      amount: 85500.00,
      session: '2025/2026',
      status: InvoiceStatus.PENDING,
    },
  });

  // 4. Create Student 2 (Sohail)
  const student2 = await prisma.student.create({
    data: {
      matricNumber: '2022514009',
      email: 'sohail.sec@unizik.edu.ng',
      password: defaultPasswordHash,
      firstName: 'Sohail',
      lastName: 'Abdel',
      department: 'Computer Science',
      level: 400,
      loginDeviceId: 'UNIZIK_FP_SEED_SOHAIL',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      studentId: student2.id,
      category: FeeCategory.ACCEPTANCE,
      amount: 45000.00,
      session: '2025/2026',
      status: InvoiceStatus.PENDING,
    },
  });

  console.log('✅ Seeding Complete!');
  console.log('----------------------------------------------------------------');
  console.log('[STUDENT] Matric: 2022514001 (Chinedu) | Pass: password123');
  console.log('[STUDENT] Matric: 2022514009 (Sohail)  | Pass: password123');
  console.log('[ADMIN]   User:   admin                 | Pass: admin123');
  console.log('----------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });