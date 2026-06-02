import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, hasPassword: !!u.password })));

  const leaders = await prisma.leader.findMany({ include: { user: true } });
  console.log("Leaders in DB:", leaders.map(l => ({ id: l.id, name: l.name, password: l.password, role: l.role, userEmail: l.user?.email, userPassword: l.user?.password })));
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
  });
