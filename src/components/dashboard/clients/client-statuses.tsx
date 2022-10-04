import { Button, ButtonGroup } from '@saas-ui/react'
import { useParams } from '@saas-ui/router'
import router, { useRouter } from 'next/router'
import { usePath } from '../../../hooks/landing-page/use-path'

export const ClientStatuses = () => {
  const params = useRouter()
  const all = usePath('dashboard/clients')
  const billed = usePath('dashboard/clients/billed')
  const notBilled = usePath('dashboard/clients/notbilled')

  return (
    <ButtonGroup isAttached variant="outline">
      <Button onClick={() => router.push(all)} isActive={!params?.query?.type}>
        All
      </Button>
      <Button
        onClick={() => router.push(billed)}
        isActive={params?.query?.type === 'billed'}
      >
        Billed
      </Button>
      <Button
        onClick={() => router.push(notBilled)}
        isActive={params?.query?.type === 'notbilled'}
      >
        Not billed
      </Button>
    </ButtonGroup>
  )
}
