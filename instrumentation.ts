export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.room.count();
    if (count > 0) return;

    const { runSeed } = await import("@/app/api/admin/seed/route");
    await runSeed();
  } catch {
    // Seeding is best-effort; never block startup
  }
}
