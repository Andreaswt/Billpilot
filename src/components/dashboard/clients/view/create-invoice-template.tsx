import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { Button, Checkbox, Flex, FormControl, Text, FormErrorMessage, FormLabel, Heading, Icon, Input, Stack, Wrap, HStack, Badge, IconButton } from '@chakra-ui/react'
import { Card, CardBody, Divider, Select } from '@saas-ui/react'
import * as React from 'react'
import { BsClockFill } from 'react-icons/bs'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { HiReceiptTax } from "react-icons/hi";

interface Props {

}

export const CreateInvoiceTemplate: React.FC<Props> = (props) => {
    const [activated, setActivated] = React.useState(false)

    return (
        <>
            <Stack gap={4}>
                <Flex justifyContent="end">
                    <Flex justifyContent="space-between" gap={4}>
                        <Select
                            value={activated ? "Activated" : "Inactive"}
                            onChange={(value: string | string[]) => setActivated(value === "Activated" ? true : false)}
                            // onChange={(e: string | string[]) => console.log("hej")}
                            name="activated"
                            placeholder="Activated"
                            options={[
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' },
                            ]} />
                        <Button colorScheme="primary" h="full">Save</Button>
                    </Flex>
                </Flex>

                <Stack gap={6}>
                    <Stack>
                        <Flex justifyContent="start">
                            <Heading color="primary" size="md">Time items</Heading>
                        </Flex>
                        <Card>
                            <CardBody>
                                <Stack gap={2}>
                                    <Flex justifyContent="space-between">
                                        <FormControl isInvalid={false}>
                                            <Flex alignItems="end" gap={4}>
                                                <Icon mb={2} h={6} w={6} as={BsClockFill} />
                                                <Stack>
                                                    <FormLabel m={0} fontSize="sm" htmlFor={`title`}>Title</FormLabel>
                                                    <Input
                                                        width="sm"
                                                        id='title'
                                                        placeholder="Enter title"
                                                        variant="filled"
                                                    />
                                                </Stack>
                                                <FormErrorMessage>
                                                    {/* {errors.clientInformation?.name?.message} */}
                                                </FormErrorMessage>
                                            </Flex>
                                        </FormControl>
                                        <Stack>
                                            <FormLabel whiteSpace="nowrap" m={0} fontSize="sm" htmlFor={`exportToEconomic`}>Apply tax</FormLabel>
                                            <Flex h="full" gap={4} alignItems="center">
                                                <Checkbox
                                                    id='exportToEconomic'
                                                    type="checkbox"
                                                    variant="filled"
                                                />
                                                <Icon h={7} w={7} as={HiReceiptTax} />
                                            </Flex>
                                        </Stack>
                                    </Flex>

                                    <Divider orientation="horizontal" label="Filters" />
                                    <Wrap>
                                        <Card>
                                            <CardBody p={2}>
                                                <HStack>
                                                    <Badge colorScheme='green'>{"Project"}</Badge>
                                                    <Text fontSize='xs'>{"Bankly Desktop App (BDA)"}</Text>
                                                    <IconButton onClick={() => console.log("delete")} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardBody p={2}>
                                                <HStack>
                                                    <Badge colorScheme='red'>{"Employee"}</Badge>
                                                    <Text fontSize='xs'>{"Carl Larsen (CLA)"}</Text>
                                                    <IconButton onClick={() => console.log("delete")} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
                                                </HStack>
                                            </CardBody>
                                        </Card>
                                    </Wrap>

                                    <Flex justifyContent="start">
                                        <Button leftIcon={<AddIcon />} colorScheme='primary'>
                                            Add filter
                                        </Button>
                                    </Flex>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Stack>

                    <Stack>
                        <Flex justifyContent="start">
                            <Heading color="primary" size="md">Fixed price time items</Heading>
                        </Flex>
                        <Card>
                            <CardBody>
                                <Stack gap={2}>
                                    <Flex justifyContent="space-between">
                                        <FormControl isInvalid={false}>
                                            <Flex alignItems="end" gap={4}>
                                                <Icon mb={2} h={6} w={6} as={FaFileInvoiceDollar} />
                                                <Stack>
                                                    <FormLabel m={0} fontSize="sm" htmlFor={`title`}>Title</FormLabel>
                                                    <Input
                                                        width="sm"
                                                        id='title'
                                                        placeholder="Monthly retainer"
                                                        variant="filled"
                                                    />
                                                </Stack>
                                                <FormErrorMessage>
                                                    {/* {errors.clientInformation?.name?.message} */}
                                                </FormErrorMessage>
                                            </Flex>
                                        </FormControl>
                                        <Flex>
                                            <Flex>
                                                {/* Amount input here */}
                                            </Flex>
                                        <Stack>
                                            <FormLabel whiteSpace="nowrap" m={0} fontSize="sm" htmlFor={`exportToEconomic`}>Apply tax</FormLabel>
                                            <Flex h="full" gap={4} alignItems="center">
                                                <Checkbox
                                                    id='exportToEconomic'
                                                    type="checkbox"
                                                    variant="filled"
                                                />
                                                <Icon h={7} w={7} as={HiReceiptTax} />
                                            </Flex>
                                        </Stack>
                                        </Flex>
                                    </Flex>

                                    <Divider orientation="horizontal" />

                                    <Flex justifyContent="start">
                                        <Button leftIcon={<AddIcon />} colorScheme='primary'>
                                            Add item
                                        </Button>
                                    </Flex>
                                </Stack>
                            </CardBody>
                        </Card>
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}
