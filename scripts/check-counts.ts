import { prisma } from "../src/lib/prisma";

async function test() {
  const attendances = await prisma.attendance.findMany({
    include: {
      activity: {
        include: { activity_type: true }
      },
      youth: true
    }
  });
  console.log(JSON.stringify(attendances, null, 2));
}
test();
test();
