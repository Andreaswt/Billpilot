import { AddIcon } from '@chakra-ui/icons'
import { Flex, Grid, GridItem, Heading, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react'
import { Button, Divider, Loader, SearchInput, useCollapse } from '@saas-ui/react'
import React from 'react'
import { trpc } from '../../../../utils/trpc'

interface Props {
    setFilters: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string,
        type: string;
    }[]>>,
    filters: {
        id: string;
        name: string;
        type: string;
    }[]
}

export const Filters: React.FC<Props> = (props) => {
    const { filters, setFilters } = props
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentType, setCurrentType] = React.useState('Projects')

    const { data: projects, isLoading: projectsLoading, isRefetching: projectsRefetching, refetch: projectsRefetch } = trpc.useQuery([
        "jira.filterProjects",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
        });

    const { data: employees, isLoading: employeesLoading, isRefetching: employeesRefetching, refetch: employeesRefetch } = trpc.useQuery(
        ["jira.filterEmployees",
            { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            enabled: false,
        });

    const { data: issues, isLoading: issuesLoading, isRefetching: issuesRefetching, refetch: issuesRefetch } = trpc.useQuery([
        "jira.searchIssues",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            enabled: false,
        });

    const { data: epics, isLoading: epicsLoading, isRefetching: epicsRefetching, refetch: epicsRefetch } = trpc.useQuery([
        "jira.searchEpics",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            enabled: false,
        });

    const addFilter = (id: string, name: string, type: string) => {
        setFilters(prev => [...prev, { id: id, name: name, type: type }])
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
                        <Grid
                            templateColumns='repeat(3, 1fr)'
                            gap={4}>
                            <GridItem bg="blackAlpha.300" colSpan={1}>
                                <Stack p={4} gap={4}>
                                    <Heading size="md">Filter by</Heading>
                                    <Stack>
                                        <Heading size="sm">Jira</Heading>
                                        <Divider />
                                        <Button onClick={() => { setCurrentType("Projects"); projectsRefetch(); }} variant={currentType === "Projects" ? "solid" : "outline"}>Projects</Button>
                                        <Button onClick={() => { setCurrentType("Employees"); employeesRefetch(); }} variant={currentType === "Employees" ? "solid" : "outline"}>Employees</Button>
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
                                            ? (projectsLoading || projectsRefetching || !projects
                                                ? <Loader />
                                                : projects.projectsResponse
                                                    .filter(x => filter(x.id))
                                                    .map(x => {
                                                        return (<Button key={x.id} onClick={() => addFilter(x.id, `${x.name} (${x.key})`, "Project")} colorScheme="primary">{x.name} ({x.key})</Button>)
                                                    }))
                                            : null}
                                        {currentType === "Employees"
                                            ? (employeesLoading || employeesRefetching || !employees
                                                ? <Loader />
                                                : employees.employeesResponse
                                                    .filter(x => filter(x.id))
                                                    .map(x => {
                                                        return (<Button key={x.id} onClick={() => addFilter(x.id, x.name, "Employee")} colorScheme="primary">{x.name}</Button>)
                                                    }))
                                            : null}
                                    </Stack>
                                </Stack>
                            </GridItem>
                        </Grid>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>

    )
}
