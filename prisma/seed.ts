import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@ems.com',
    },
  })

  if (existingAdmin) {
    console.log('Admin user already exists.')
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@ems.com',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'Management',
    },
  })

  console.log(`Created admin user with email: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
