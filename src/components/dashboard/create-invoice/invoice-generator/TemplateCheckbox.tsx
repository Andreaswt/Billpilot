import { Checkbox, Flex, Heading, HStack, Icon, Text } from '@chakra-ui/react'
import { InvoiceTemplate } from '@prisma/client'
import { Card, CardBody } from '@saas-ui/react'
import * as React from 'react'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import useInvoiceTemplatesStore from '../../../../../store/invoice-templates'

interface Props {
    invoiceTemplate: InvoiceTemplate
    defaultChecked: boolean
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
                    <Flex justifyContent="center" w="33%"><Text>Generated Invoice</Text></Flex>
                    <Flex justifyContent="center" w="33%"><Text>Time</Text></Flex>
                    <Flex justifyContent="center" w="33%"><Text>Amount</Text></Flex>
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
                        {
                            store.generatedTemplatesInfo[id]
                                ? <Flex w="40%" alignItems="center" justifyContent="space-between">
                                    <Flex justifyContent="center" w="33%">
                                        {
                                            store.generatedTemplatesInfo[id].amount === 0
                                                ? <AiOutlineClose />
                                                : <AiOutlineCheck />
                                        }
                                    </Flex>
                                    <Flex justifyContent="center" w="33%">{store.generatedTemplatesInfo[id].time ? store.generatedTemplatesInfo[id].time + " hours" : "-"}</Flex>
                                    <Flex justifyContent="center" w="33%">{store.generatedTemplatesInfo[id].formattedAmount ?? "-"}</Flex>
                                </Flex>
                                : <Text>Not generated for selected dates</Text>
                        }
                    </Flex>
                </CardBody>
            </Card>
        </>
    )
}

export default TemplateCheckbox;
