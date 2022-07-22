import { prisma } from "../src/server/db/client";

export async function createPricelist(pricelistName: string, organizationId: string) {
    return await prisma.pricelist.create({
        data: {
            name: pricelistName,
            organizationId: organizationId
        }
    })
}

export async function addRolesToPricelist(pricelistName: string, roles: { rolename: string, hourlyRate: number }[]) {
    let mappedRolesOnPricelists = roles.map(r =>
    ({
        pricelistName: pricelistName,
        roleName: r.rolename,
        hourlyRate: r.hourlyRate
    }));

    return await prisma.rolesOnPricelists.createMany({
        data: mappedRolesOnPricelists
    })
}