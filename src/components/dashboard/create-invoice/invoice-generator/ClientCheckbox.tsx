import { Checkbox, Flex, Heading } from '@chakra-ui/react'
import { TemplatesApi } from '@hubspot/api-client/lib/codegen/crm/timeline'
import { InvoiceTemplate } from '@prisma/client'
import * as React from 'react'
import useInvoiceTemplatesStore from '../../../../../store/invoice-templates'
import TemplateCheckbox from './TemplateCheckbox'

interface Props {
    clientId: string
    clientName: string
    templates: InvoiceTemplate[]
}

const ClientCheckbox: React.FC<Props> = (props) => {
    const { clientId } = props
    const store = useInvoiceTemplatesStore()

    return (
        <>
            <Flex gap={2}>
                <Checkbox
                    ml={4}
                    id='exportToEconomic'
                    type="checkbox"
                    variant="filled"
                    isChecked={store.clients[clientId]?.checkAllTemplates || store.checkAll}
                    onChange={e => store.setCheckClient(clientId, e.target.checked)}
                />
                <Heading size="md">
                    {props.clientName}
                </Heading>
            </Flex>
            {
                props.templates.map(x => {
                    return (
                        <TemplateCheckbox key={x.id} invoiceTemplate={x} />
                    )
                })
            }
        </>
    )
}

export default ClientCheckbox;
