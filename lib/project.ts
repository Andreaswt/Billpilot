import { Project } from "jira.js/out/version3/models";
import { prisma } from "../src/server/db/client";

export async function createProjectsInDatabase(projects: Project[], organizationId: string) {
    let mappedProjects = projects.map(p =>
    ({
        name: p.name,
        key: p.key,
        billable: true,
        organizationId: organizationId
    }));

    return await prisma.project.createMany({
        data: mappedProjects
    })
}

export async function upsertProjectsInDatabase(projects: Project[], organizationId: string) {
    let mappedProjects = projects.map(p =>
    ({
        name: p.name,
        key: p.key,
        billable: true,
        organizationId: organizationId
    }));

    prisma.$transaction([
        // Clear projects
        prisma.project.deleteMany({ where: { organizationId: organizationId } }),

        prisma.project.createMany({
            data: mappedProjects
        }),
    ]);
}