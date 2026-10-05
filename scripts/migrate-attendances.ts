import { prisma } from "../src/lib/prisma";
import { startOfDay, setHours, setMinutes, subDays, getDay, addDays, isBefore, endOfYear } from "date-fns";

async function main() {
  const activeSeason = await prisma.season.findFirst({
    where: { is_active: true }
  });

  if (!activeSeason) {
    console.log("No active season found");
    return;
  }

  // Ensure EBD type exists
  let ebdType = await prisma.activityType.findFirst({
    where: { slug: "ebd" }
  });
  if (!ebdType) {
    ebdType = await prisma.activityType.create({
      data: {
        name: "EBD",
        slug: "ebd",
        description: "Escola Bíblica Dominical"
      }
    });
  }

  // Get Culto Nobreak type
  const cultoType = await prisma.activityType.findFirst({
    where: { slug: "culto-nobreak" }
  });

  // Fetch all transactions
  const txs = await prisma.scoreTransaction.findMany({
    include: { point_rule: true }
  });

  const ebdTxs = txs.filter(t => t.point_rule?.name?.includes("EBD"));
  const partTxs = txs.filter(t => t.point_rule?.name === "Participação" || t.point_rule?.name?.includes("Culto"));

  console.log(`Processing ${ebdTxs.length} EBD transactions and ${partTxs.length} Culto transactions...`);

  // Helper to get nearest Sunday (EBD)
  function getEbdDate(date: Date) {
    const d = new Date(date);
    const day = getDay(d);
    let diff = 0;
    if (day === 0) diff = 0;
    else if (day === 1) diff = 1;
    else if (day === 2) diff = 2;
    else if (day === 6) diff = -1;
    else diff = day; // just subtract to get to sunday
    const sunday = subDays(d, diff);
    return setMinutes(setHours(startOfDay(sunday), 9), 30);
  }

  // Helper to get nearest Saturday (Culto)
  function getCultoDate(date: Date) {
    const d = new Date(date);
    const day = getDay(d);
    let diff = 0;
    if (day === 6) diff = 0;
    else if (day === 0) diff = 1;
    else if (day === 1) diff = 2;
    else diff = day + 1; // subtract to get to saturday
    const saturday = subDays(d, diff);
    return setMinutes(setHours(startOfDay(saturday), 19), 30);
  }

  // Process EBD
  let lastEbdDate = new Date("2020-01-01");
  for (const tx of ebdTxs) {
    const eventDate = getEbdDate(tx.created_at);
    if (eventDate > lastEbdDate) lastEbdDate = eventDate;

    // Find or create Activity
    let activity = await prisma.activity.findFirst({
      where: {
        activity_type_id: ebdType!.id,
        activity_date: eventDate,
        season_id: activeSeason.id
      }
    });

    if (!activity) {
      activity = await prisma.activity.create({
        data: {
          title: "EBD",
          activity_date: eventDate,
          activity_type_id: ebdType!.id,
          season_id: activeSeason.id
        }
      });
    }

    // Upsert Attendance
    await prisma.attendance.upsert({
      where: {
        activity_id_youth_id: {
          activity_id: activity.id,
          youth_id: tx.youth_id
        }
      },
      update: { status: "present" },
      create: {
        activity_id: activity.id,
        youth_id: tx.youth_id,
        season_id: activeSeason.id,
        status: "present"
      }
    });
  }

  // Process Culto
  for (const tx of partTxs) {
    if (!cultoType) continue;
    const eventDate = getCultoDate(tx.created_at);

    // Find or create Activity
    let activity = await prisma.activity.findFirst({
      where: {
        activity_type_id: cultoType.id,
        activity_date: eventDate,
        season_id: activeSeason.id
      }
    });

    if (!activity) {
      activity = await prisma.activity.create({
        data: {
          title: "Culto Nobreak",
          activity_date: eventDate,
          activity_type_id: cultoType.id,
          season_id: activeSeason.id
        }
      });
    }

    // Upsert Attendance
    await prisma.attendance.upsert({
      where: {
        activity_id_youth_id: {
          activity_id: activity.id,
          youth_id: tx.youth_id
        }
      },
      update: { status: "present" },
      create: {
        activity_id: activity.id,
        youth_id: tx.youth_id,
        season_id: activeSeason.id,
        status: "present"
      }
    });
  }

  console.log("Past attendances populated successfully.");

  // Create future EBD events until end of year
  console.log("Creating future EBD events...");
  const endOfThisYear = endOfYear(new Date());
  let nextEbd = addDays(lastEbdDate, 7);
  
  // Also, if lastEbdDate is too old, start from next Sunday
  const today = new Date();
  if (isBefore(nextEbd, today)) {
    nextEbd = getEbdDate(addDays(today, 7)); // next sunday
  }

  let futureCount = 0;
  while (isBefore(nextEbd, endOfThisYear)) {
    const existing = await prisma.activity.findFirst({
      where: {
        activity_type_id: ebdType!.id,
        activity_date: nextEbd,
        season_id: activeSeason.id
      }
    });

    if (!existing) {
      await prisma.activity.create({
        data: {
          title: "EBD",
          activity_date: nextEbd,
          activity_type_id: ebdType!.id,
          season_id: activeSeason.id
        }
      });
      futureCount++;
    }
    nextEbd = addDays(nextEbd, 7);
  }

  console.log(`Created ${futureCount} future EBD events.`);
}

main().catch(console.error);
