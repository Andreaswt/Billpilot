import { Button, ButtonGroup } from '@saas-ui/react'
import { useParams } from '@saas-ui/router'
import router from 'next/router'
import { usePath } from '../../../hooks/landing-page/use-path'

export const ContactTypes = () => {
  const params = useParams()
  const contact = usePath('contacts')
  const contactLeads = usePath('contacts/leads')
  const contactCustomers = usePath('contacts/customers')

  return (
    <ButtonGroup isAttached variant="outline">
      <Button onClick={() => router.push("contact")} isActive={!params?.type}>
        All
      </Button>
      <Button
        onClick={() => router.push("contact")}
        isActive={params?.type === 'leads'}
      >
        Leads
      </Button>
      <Button
        onClick={() => router.push("contactLeads")}
        isActive={params?.type === 'customers'}
      >
        Customers
      </Button>
    </ButtonGroup>
  )
}
