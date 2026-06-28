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

  const atts = await prisma.attendance.findMany({
    where: {
      activity: ebdCondition
    },
    include: { activity: true, youth: true }
  });

  console.log(atts.map(a => ({ youth: a.youth.name, title: a.activity.title })));
}
test();
