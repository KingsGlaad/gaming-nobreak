import { prisma } from "../src/lib/prisma";

async function test() {
  const achs = await prisma.achievement.findMany();
  console.log(achs.map(a => ({ name: a.name, type: a.condition_type, val: a.condition_value })));
}
test();
