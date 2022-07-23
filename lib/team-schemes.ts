import { JiraEmployee, Role } from "@prisma/client";
import { ExecOptionsWithStringEncoding } from "child_process";
import { User } from "jira.js/out/version3/models";
import { prisma } from "../src/server/db/client";

interface ICreateTeamScheme {
    name: string
    organizationId: string
    jiraEmployeesInRoles: {
        role: Role
        jiraEmployees: User[]
    }[]
}

export async function createTeamScheme(input: ICreateTeamScheme) {
    let jiraEmployees: { name: string, accountId: string, organizationId: string }[] = [];

    // Create a list of users and their respective rolenames, for the many-to-many table
    input.jiraEmployeesInRoles.forEach(x => {
        x.jiraEmployees.forEach(e => {
            jiraEmployees.push({
                name: e.displayName ?? "",
                accountId: e.accountId,
                organizationId: input.organizationId
            })
        }
        )
    })

    let mappedJiraEmployeesInRoles: { jiraEmployeeId: string, roleName: string }[] = [];

    input.jiraEmployeesInRoles.forEach(function (roles) {
        roles.jiraEmployees.forEach(function (employee) {
            mappedJiraEmployeesInRoles.push({ roleName: roles.role.name, jiraEmployeeId: employee.accountId })
        })
    })

    // Create team schemes and connect them to roles
    await prisma.teamScheme.create({
        data: {
            name: input.name,
            organizationId: input.organizationId,
            roles: {
                connect: input.jiraEmployeesInRoles.map(x => ({ name: x.role.name })),
            }
        }
    })

    // Create employees and connect them to roles
    input.jiraEmployeesInRoles.forEach(async x => {
        jiraEmployees.forEach(async e =>
            await prisma.jiraEmployee.upsert({
                where: {
                    organizationsJiraEmployee: {
                        accountId: e.accountId,
                        organizationId: e.organizationId
                    }
                },
                update: {
                    name: e.name,
                    accountId: e.accountId,
                    roles: {
                        connect: {
                            name: x.role.name
                        }
                    }
                },
                create: {
                    name: e.name,
                    accountId: e.accountId,
                    organizationId: e.organizationId,
                    roles: {
                        connect: {
                            name: x.role.name
                        }
                    }
                }
            })
        )
    })
}
