import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const load = async () => {
    try {

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    };
}

load();
