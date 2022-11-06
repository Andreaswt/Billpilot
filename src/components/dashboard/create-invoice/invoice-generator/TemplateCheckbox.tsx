import { Checkbox, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { InvoiceTemplate } from '@prisma/client'
import { Card, CardBody } from '@saas-ui/react'
import * as React from 'react'
import useInvoiceTemplatesStore from '../../../../../store/invoice-templates'

interface Props {
    invoiceTemplate: InvoiceTemplate
}

const TemplateCheckbox: React.FC<Props> = (props) => {
    const { clientId, id } = props.invoiceTemplate
    const store = useInvoiceTemplatesStore()

    const isChecked = 
    store.clients[clientId]?.checkedTemplates !== undefined 
    ? (store.clients[clientId]?.checkedTemplates[id] || store.clients[clientId]?.checkAllTemplates || store.checkAll)
    : false

    return (
        <>
            <HStack px={4} justifyContent="space-between">
                <Text>Title</Text>

                <Flex w="40%" justifyContent="space-between">
                    <Text>Generated Invoice</Text>
                    <Text>Time</Text>
                    <Text>Amount</Text>
                </Flex>
            </HStack>
            <Card>
                <CardBody>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex gap={4}>
                            <Checkbox
                                type="checkbox"
                                variant="filled"
                                isChecked={isChecked}
                                onChange={e => store.setCheckClientTemplate(clientId, id, e.target.checked)}
                            />
                            <Heading size="md">{props.invoiceTemplate.title}</Heading>
                        </Flex>
                        <Text>Not generated for selected dates</Text>
                    </Flex>
                </CardBody>
            </Card>
        </>
    )
}

export default TemplateCheckbox;
