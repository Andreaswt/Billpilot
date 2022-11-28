import { Flex, Heading, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { Card, CardBody } from '@saas-ui/react';
import { BsArrowReturnRight, BsPersonFill } from 'react-icons/bs';
import { Employee as EmployeeInterface } from '../../../../types/pages/dashboard/workbooks';

interface Props extends EmployeeInterface {
    showArrowLogo: boolean
}

const Employee = (props: Props) => {
    return (
        <Stack>
            <HStack ml={8} px={4} justifyContent="space-between">
                <Text w="25%" color="gray.400">Employee</Text>
                <Flex color="gray.400" w="75%" justifyContent="space-between">
                    <Flex justifyContent="start" w="20%"><Text>Budgeted Hours</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Budget</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Hours Tracked</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Cost</Text></Flex>
                    <Flex justifyContent="start" w="20%"><Text>Over/Under Budget</Text></Flex>
                </Flex>
            </HStack>
            <Flex gap={2} alignItems="center">
                {
                    props.showArrowLogo
                    ? <Icon as={BsArrowReturnRight} height={6} width={6}></Icon>
                    : null
                }
                <Card ml={!props.showArrowLogo ? 8 : 0} w="100%">
                    <CardBody>
                        <Stack>
                            <HStack justifyContent="space-between">
                                <Flex w="25%" gap={4}>
                                    <Icon as={BsPersonFill} width={5} height={5} />
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
                        </Stack>
                    </CardBody>
                </Card>
            </Flex>
        </Stack>
    )
}

export default Employee;