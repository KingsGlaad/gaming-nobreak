import { prisma } from "../src/lib/prisma";

async function test() {
  const acts = await prisma.activity.findMany({
    where: { title: { contains: "ebd", mode: "insensitive" } },
  });
  console.log("Title ebd:", acts.map(a => a.title));
}
test();
