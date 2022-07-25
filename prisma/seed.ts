import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const load = async () => {
    try {
        // Currencies
        await prisma.currency.deleteMany({});
        console.log("Deleted currencies");
        await prisma.currency.createMany({
            data: [
                { currency: "United States Dollar", abbreviation: "USD" },
                { currency: "Danish Krone", abbreviation: "DKK" },
            ]
        })
        console.log("Added currencies");


        // Number and date formats
        await prisma.currency.deleteMany({});
        console.log("Deleted number and date formats");
        await prisma.numberAndDateFormat.createMany({
            data: [
                { format: "United States" },
                { format: "European" },
            ]
        })
        console.log("Added number and date formats");

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    };
}

load();
