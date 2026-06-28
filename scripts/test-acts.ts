import { prisma } from "../src/lib/prisma";

async function test() {
  const ebdCondition = {
    OR: [
      { title: { contains: "ebd", mode: "insensitive" as const } },
      { title: { contains: "escola bíblica", mode: "insensitive" as const } },
      { title: { contains: "escola biblica", mode: "insensitive" as const } },
      { activity_type: { name: { contains: "ebd", mode: "insensitive" as const } } },
      { activity_type: { name: { contains: "escola bíblica", mode: "insensitive" as const } } },
      { activity_type: { name: { contains: "escola biblica", mode: "insensitive" as const } } },
    ]
  };

  const acts = await prisma.activity.findMany({
    where: ebdCondition,
    include: { activity_type: true }
  });

  console.log("Matched activities:", acts.map(a => a.title));
}
test();
