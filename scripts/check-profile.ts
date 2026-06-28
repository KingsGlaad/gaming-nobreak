import { getYouthProfile } from "../src/lib/services/public";
import { prisma } from "../src/lib/prisma";

async function test() {
  const youth = await prisma.youth.findFirst({ where: { status: "active" } });
  if (!youth) return console.log("No youth");
  const profile = await getYouthProfile(youth.id);
  if (profile) {
    console.log(profile.achievements);
  } else {
    console.log("No profile found.");
  }
}
test();
