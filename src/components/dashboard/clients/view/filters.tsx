import { Flex, Grid, GridItem, Heading, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Stack } from '@chakra-ui/react'
import { Button, Divider, SearchInput, useCollapse, Loader } from '@saas-ui/react'
import React from 'react'
import { trpc } from '../../../../utils/trpc'
import { AddIcon } from '@chakra-ui/icons'

export const Filters = () => {
    const { onToggle, isOpen, getCollapseProps } = useCollapse()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [currentType, setCurrentType] = React.useState('Projects')

    const { data: projects, isLoading: projectsLoading, isRefetching: projectsRefetching, refetch: projectsRefetch } = trpc.useQuery([
        "jira.filterProjects",
        { searchTerm: searchTerm }],
        {
            refetchOnWindowFocus: false,
            onSuccess() {
                setCurrentType('Projects');
            }
        });

    const { data: employees, isLoading: employeesLoading, isRefetching: employeesRefetching, refetch: employeesRefetch } = trpc.useQuery(
        ["jira.filterEmployees",
            { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess() {
                setCurrentType('Employees');
            }
        });

    const { data: issues, isLoading: issuesLoading, isRefetching: issuesRefetching, refetch: issuesRefetch } = trpc.useQuery([
        "jira.searchIssues",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess() {
                setCurrentType('Issues');
            }
        });

    const { data: epics, isLoading: epicsLoading, isRefetching: epicsRefetching, refetch: epicsRefetch } = trpc.useQuery([
        "jira.searchEpics",
        { searchTerm: searchTerm }],
        {
            enabled: false,
            onSuccess() {
                setCurrentType('Epics');
            }
        });

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
                                        <Button onClick={() => projectsRefetch()} variant={currentType === "Projects" ? "solid" : "outline"}>Projects</Button>
                                        <Button onClick={() => employeesRefetch()} variant={currentType === "Employees" ? "solid" : "outline"}>Employees</Button>
                                    </Stack>
                                </Stack>
                            </GridItem>
                            <GridItem py={4} mt={6} pr={4} colSpan={2}>
                                <Stack gap={4}>
                                    <SearchInput
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e: any) => setSearchTerm(e.target.value)}
                                        onReset={() => setSearchTerm('')}
                                    />
                                    <Stack>
                                        <Heading size="sm">{currentType}</Heading>
                                        <Divider />
                                        {currentType === "Projects" && (projectsLoading || projectsRefetching) ? <Loader /> : null}
                                        {currentType === "Employees" && (employeesLoading || employeesRefetching) ? <Loader /> : null}

                                        {currentType === "Projects" && projects
                                            ? projects.projectsResponse.map(x => {
                                                return (<Button key={x.id} onClick={() => console.log(x.id)} colorScheme="primary">{x.name} ({x.key})</Button>)
                                            })
                                            : null}
                                        {currentType === "Employees" && employees
                                            ? employees.employeesResponse.map(x => {
                                                return (<Button key={x.id} onClick={() => console.log(x.id)} colorScheme="primary">{x.name}</Button>)
                                            })
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
