import { prisma } from "../src/server/db/client";

export async function createRole(roleName: string, organizationId: string) {
    return await prisma.role.create({
        data: {
            name: roleName,
            organizationId: organizationId
        }
    })
}