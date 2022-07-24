import { Client } from "@prisma/client";
import { prisma } from "../src/server/db/client";

export async function createClient(client: Client, organizationId: string) {
    return await prisma.client.create({
        data: { ...client, organizationId: organizationId }
    })
}

export async function getClient(name: string, organizationId: string) {
    return await prisma.client.findUnique({
        where: {
            organizationsClient: {
                name: name,
                organizationId: organizationId
            }
        }
    })
}

export async function getAllClients(organizationId: string) {
    return await prisma.client.findMany({
        where: {
            organizationId: organizationId
        }
    })
}

export async function updateClient(client: Client) {
    return await prisma.client.update({
        data: client,
        where: {
            organizationsClient: {
                name: client.name,
                organizationId: client.organizationId
            }
        }
    })
}

export async function deleteClient(clientId: string) {
    return await prisma.client.delete({
        where: {
            id: clientId
        }
    })
}