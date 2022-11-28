import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Collapse, Flex, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { Card, CardBody, Divider } from '@saas-ui/react';
import { useState } from 'react';
import { BsFillPeopleFill } from 'react-icons/bs';
import { Client } from '../../../../types/pages/dashboard/workbooks';
import Job from './job';

const Client = (props: Client) => {
    const [showJobs, setShowJobs] = useState(false)
    const { name, jobs, budgetedHours, budget, hoursTracked, cost, overUnderBudget } = props

    return (
        <Stack>
            <HStack px={4} justifyContent="space-between">
                <Text w="25%" color="gray.400">Client</Text>

                <Flex color="gray.400" w="75%" justifyContent="space-between">
                    <Flex justifyContent="start" w="20%"><Text>Budgeted Hours</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Budget</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Hours Tracked</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Cost</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Over/Under Budget</Text></Flex>
                </Flex>
            </HStack>
            <Card>
                <CardBody>
                    <Stack gap={4}>
                        <Stack>
                            <HStack justifyContent="space-between">
                                <Flex w="25%" gap={4}>
                                    <Icon as={BsFillPeopleFill} width={5} height={5} />
                                    <Heading size="md">{props.name}</Heading>
                                </Flex>

                                <Flex w="75%" justifyContent="space-between">
                                    <Flex justifyContent="start" w="20%"><Text>{props.budgetedHours} Hours</Text></Flex>
                                    <Flex justifyContent="start" w="20%"><Text>{props.budget}</Text></Flex>
                                    <Flex justifyContent="start" w="20%"><Text>{props.hoursTracked} Hours</Text></Flex>
                                    <Flex justifyContent="start" w="20%"><Text>{props.cost}</Text></Flex>
                                    <Flex justifyContent="start" w="20%"><Text>{props.overUnderBudget}</Text></Flex>
                                </Flex>
                            </HStack>

                            <Flex color="blue.400" gap={2} alignItems="center">
                                {
                                    showJobs
                                        ? <ChevronDownIcon height={5} width={5} />
                                        : <ChevronUpIcon height={5} width={5} />
                                }
                                <Text cursor="pointer" onClick={() => setShowJobs(value => !value)}>See Jobs</Text>
                            </Flex>
                        </Stack>
                        <Collapse in={showJobs}>
                            <Stack gap={4} w="100%">
                                <Divider label="Jobs" />
                                {
                                    props.jobs.map((job, index) => {
                                        return (<Job key={index} {...job} showArrowLogo={index === 0} />)
                                    })
                                }
                            </Stack>
                        </Collapse>
                    </Stack>
                </CardBody>
            </Card>
        </Stack>
    )
}

export default Client;