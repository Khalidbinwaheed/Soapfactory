const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@soapfactory.com' },
    update: {},
    create: {
      email: 'admin@soapfactory.com',
      name: 'System Admin',
      password,
      role: 'ADMIN',
    },
  });

  const client = await prisma.user.upsert({
      where: { email: 'client@soapfactory.com' },
      update: {},
      create: {
        email: 'client@soapfactory.com',
        name: 'Test Client',
        password,
        role: 'CLIENT',
      },
    });

  console.log({ admin, client });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
