import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Collapse, Flex, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { Card, CardBody, Divider } from '@saas-ui/react';
import { useState } from 'react';
import { BsArrowReturnRight, BsCalendarMinusFill } from 'react-icons/bs';
import { Job as JobInterface } from '../../../../types/pages/dashboard/workbooks';
import Employee from './employee';

interface Props extends JobInterface {
    showArrowLogo: boolean
}

const Job = (props: Props) => {
    const [showEmployees, setShowEmployees] = useState(false)

    return (
        <Stack>
            <HStack ml={8} px={4} justifyContent="space-between">
                <Text w="25%" color="gray.400">Job</Text>

                <Flex color="gray.400" w="75%" justifyContent="space-between">
                    <Flex justifyContent="start" w="20%"><Text>Budgeted Hours</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Budget</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Hours Tracked</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Cost</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Over/Under Budget</Text></Flex>
                </Flex>
            </HStack>
            <Flex gap={2} alignItems="start">
                {
                    props.showArrowLogo
                        ? <Icon mt={4} as={BsArrowReturnRight} height={6} width={6}></Icon>
                        : null
                }
                <Card ml={!props.showArrowLogo ? 8 : 0} w="100%">
                    <CardBody>
                        <Stack>
                            <HStack justifyContent="space-between">
                                <Flex w="25%" gap={4}>
                                    <Icon as={BsCalendarMinusFill} width={5} height={5} />
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
                                    showEmployees
                                        ? <ChevronDownIcon height={5} width={5} />
                                        : <ChevronUpIcon height={5} width={5} />
                                }
                                <Text cursor="pointer" onClick={() => setShowEmployees(value => !value)}>See Employee Details</Text>
                            </Flex>
                            <Collapse in={showEmployees}>
                                <Stack gap={4} w="100%">
                                <Divider label="Employees" />
                                    {
                                        props.employees.map((employee, index) => {
                                            return (<Employee key={index} showArrowLogo={index === 0} {...employee} />)
                                        })
                                    }
                                </Stack>
                            </Collapse>
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>
        </Stack>
    )
}

export default Job;