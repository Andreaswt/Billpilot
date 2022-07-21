import { prisma } from "../src/server/db/client";

export async function createPricelist(roleName: string, organizationId: string) {
    return await prisma.pricelist.create({
        data: {
            name: roleName,
            organizationId: organizationId
        }
    })
}

export async function addRolesToPricelist(pricelistId: string, roles: { rolename: string, hourlyRate: number }[]) {
    let mappedRolesOnPricelists = roles.map(r =>
        ({
            pricelistName: pricelistId,
            roleName: r.rolename,
            hourlyRate: r.hourlyRate
        }));

    return await prisma.rolesOnPricelists.createMany({
        data: mappedRolesOnPricelists
    })
}