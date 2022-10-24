import { Box, Button, Progress, Text } from '@chakra-ui/react'
import { Card, CardBody, Property, PropertyList } from '@saas-ui/react'
import * as React from 'react'

interface Props {

}

export const InvoiceTemplates: React.FC<Props> = (props) => {

    return (
        <Card
            title="Invoice template"
            action={
                <Button colorScheme="green" variant="solid">
                    Active
                </Button>
            }
        >
            <CardBody>
                <PropertyList>
                    <Property
                        label="Billing plan"
                        value={<Text fontWeight="bold">Professional</Text>}
                    />
                    <Property label="Billing period" value="Yearly" />
                    <Property label="Renewal date" value="01-01-2023" />
                    <Property
                        label="Users"
                        value={
                            <Box flex="1">
                                <Text fontSize="sm">20/100</Text>{' '}
                                <Progress
                                    value={20}
                                    size="xs"
                                    colorScheme="primary"
                                    borderRadius="full"
                                />
                            </Box>
                        }
                    />
                    <Property label="Price" value="€1250,-" />
                </PropertyList>
            </CardBody>
        </Card>
    )
}
