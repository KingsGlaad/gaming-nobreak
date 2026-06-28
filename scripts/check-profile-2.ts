import { getYouthProfile } from "../src/lib/services/public";

async function test() {
  const profile = await getYouthProfile("6cc7b70c-ec31-4608-8867-8ef48a411b5a");
  console.log(JSON.stringify(profile?.achievements.filter(a => a.name === "Discípulo Fiel" || a.name === "Mestre da EBD"), null, 2));
}
test();
