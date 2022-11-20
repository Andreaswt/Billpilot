import { AddIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Flex, Grid, GridItem, Heading, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react'
import { InvoiceTemplateFilterTypes } from '@prisma/client'
import { Button, Divider, EmptyStateActions, EmptyStateBody, EmptyStateContainer, EmptyStateDescription, EmptyStateIcon, EmptyStateTitle, Loader, Loading, SearchInput, useCollapse } from '@saas-ui/react'
import router from 'next/router'
import React from 'react'
import { trpc } from '../../../../utils/trpc'

interface Props {
    setFilters: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string,
        type: string,
        provider: InvoiceTemplateFilterTypes;
    }[]>>,
    filters: {
        id: string;
        name: string;
        type: string;
        provider: InvoiceTemplateFilterTypes;
    }[]
}

export const Filters: React.FC<Props> = (props) => {
    const { filters, setFilters } = props
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentType, setCurrentType] = React.useState('Projects')

    const { data: jiraProjects, isLoading: jiraProjectsLoading, isRefetching: jiraProjectsRefetching, refetch: jiraProjectsRefetch } = trpc.useQuery([
        "jira.filterProjects",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            enabled: false

        });

    const { data: hubspotCompanies, isLoading: hubspotCompaniesLoading, isRefetching: hubspotCompaniesRefetching, refetch: hubspotCompaniesRefetch } = trpc.useQuery([
        "hubspot.searchCompanies",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            enabled: false
        });

    const { data: activeIntegrationsData } = trpc.useQuery(["integrations.getActiveIntegrations"], {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            if (data["JIRA"]) {
                jiraProjectsRefetch()
                setCurrentType("Projects")
            }
            else if (data["HUBSPOT"]) {
                hubspotCompaniesRefetch()
                setCurrentType("Companies")
            }
        }
    })

    const addFilter = (id: string, name: string, type: string, provider: InvoiceTemplateFilterTypes) => {
        setFilters(prev => [...prev, { id: id, name: name, type: type, provider: provider }])
    }

    const filter = (id: string) => {
        return !filters.find(f => f.id === id)
    }

    return (
        <Flex>
            <Popover>
                <PopoverTrigger>
                    <Button leftIcon={<AddIcon />} colorScheme='primary'>Add filter</Button>
                </PopoverTrigger>
                <PopoverContent width="container.md">
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody p={0}>
                        {
                            activeIntegrationsData
                                ? (!activeIntegrationsData["JIRA"] && !activeIntegrationsData["HUBSPOT"]
                                    ? <Box py={4}>
                                        <EmptyStateContainer colorScheme="primary">
                                            <EmptyStateBody>
                                                <EmptyStateIcon as={WarningIcon} />
                                                <EmptyStateTitle>Filtering is not possible before integrations is set up.</EmptyStateTitle>
                                                <EmptyStateDescription>Do you want to set it up now?</EmptyStateDescription>
                                                <EmptyStateActions>
                                                    <Button onClick={() => router.push("/dashboard/integrations")} colorScheme="primary">Set up</Button>
                                                </EmptyStateActions>
                                            </EmptyStateBody>
                                        </EmptyStateContainer>
                                    </Box>
                                    : <>
                                        {
                                            activeIntegrationsData["JIRA"]
                                                ? <Grid
                                                    templateColumns='repeat(3, 1fr)'
                                                    gap={4}>
                                                    <GridItem bg="blackAlpha.300" colSpan={1}>
                                                        <Stack p={4} gap={4}>
                                                            <Heading size="md">Filter by</Heading>
                                                            <Stack>
                                                                <Heading size="sm">Jira</Heading>
                                                                <Divider />
                                                                <Button onClick={() => { setCurrentType("Projects"); jiraProjectsRefetch(); }} variant={currentType === "Projects" ? "solid" : "outline"}>Projects</Button>
                                                                {/* <Button onClick={() => { setCurrentType("Employees"); jiraEmployeesRefetch(); }} variant={currentType === "Employees" ? "solid" : "outline"}>Employees</Button> */}
                                                            </Stack>
                                                        </Stack>
                                                    </GridItem>
                                                    <GridItem py={4} mt={6} pr={4} colSpan={2}>
                                                        <Stack maxH={400} overflowY="scroll" gap={4}>
                                                            <SearchInput
                                                                placeholder="Search"
                                                                value={searchTerm}
                                                                onChange={(e: any) => setSearchTerm(e.target.value)}
                                                                onReset={() => setSearchTerm('')}
                                                            />
                                                            <Stack gap={2} flexDir="column">
                                                                <Heading size="sm">{currentType}</Heading>
                                                                <Divider />
                                                                {currentType === "Projects"
                                                                    ? (jiraProjectsLoading || jiraProjectsRefetching || !jiraProjects
                                                                        ? <Loader />
                                                                        : jiraProjects.projectsResponse
                                                                            .filter(x => filter(x.id))
                                                                            .map(x => {
                                                                                return (<Button key={x.id} onClick={() => addFilter(x.id, `${x.name} (${x.key})`, "Project", InvoiceTemplateFilterTypes.JIRAPROJECT)} colorScheme="primary">{x.name} ({x.key})</Button>)
                                                                            }))
                                                                    : null}
                                                            </Stack>
                                                        </Stack>
                                                    </GridItem>
                                                </Grid>
                                                : null
                                        }

                                        {
                                            activeIntegrationsData["HUBSPOT"]
                                                ? <Grid
                                                    templateColumns='repeat(3, 1fr)'
                                                    gap={4}>
                                                    <GridItem bg="blackAlpha.300" colSpan={1}>
                                                        <Stack p={4} gap={4}>
                                                            <Heading size="md">Filter by</Heading>
                                                            <Stack>
                                                                <Heading size="sm">Hubspot</Heading>
                                                                <Divider />
                                                                <Button onClick={() => { setCurrentType("Companies"); hubspotCompaniesRefetch(); }} variant={currentType === "Companies" ? "solid" : "outline"}>Companies</Button>
                                                            </Stack>
                                                        </Stack>
                                                    </GridItem>
                                                    <GridItem py={4} mt={6} pr={4} colSpan={2}>
                                                        <Stack maxH={400} overflowY="scroll" gap={4}>
                                                            <SearchInput
                                                                placeholder="Search"
                                                                value={searchTerm}
                                                                onChange={(e: any) => setSearchTerm(e.target.value)}
                                                                onReset={() => setSearchTerm('')}
                                                            />
                                                            <Stack gap={2} flexDir="column">
                                                                <Heading size="sm">{currentType}</Heading>
                                                                <Divider />
                                                                {currentType === "Companies"
                                                                    ? (hubspotCompaniesLoading || hubspotCompaniesRefetching || !hubspotCompanies
                                                                        ? <Loader />
                                                                        : hubspotCompanies.companies
                                                                            .filter(x => filter(x.id))
                                                                            .map(x => {
                                                                                return (<Button key={x.id} onClick={() => addFilter(x.id, `${x.name} (${x.id})`, "Company", InvoiceTemplateFilterTypes.HUBSPOTCOMPANY)} colorScheme="primary">{x.name} ({x.id})</Button>)
                                                                            }))
                                                                    : null}
                                                            </Stack>
                                                        </Stack>
                                                    </GridItem>
                                                </Grid>
                                                : null
                                        }
                                    </>)
                                : <Loading />
                        }
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>

    )
}
