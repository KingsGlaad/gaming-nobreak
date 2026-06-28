const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
  try {
    const youths = await prisma.youth.findMany();
    console.log("Youths count:", youths.length);
    if (youths.length > 0) {
      console.log("First youth:", youths[0]);
    }
  } catch (error) {
    console.error("Prisma error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
