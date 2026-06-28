import { prisma } from "../src/lib/prisma";

async function test() {
  const acts = await prisma.activity.findMany({ include: { activity_type: true } });
  console.log(acts.map(a => ({ title: a.title, type: a.activity_type?.name })));
}
test();
