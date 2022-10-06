import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CreateUpdateClient } from '../../../../components/dashboard/clients/create-update-client';

const Update: NextPage = () => {
    const router = useRouter()
    const clientId = router.query?.id as string
    if (!clientId) router.push("/404")

    return (
        <CreateUpdateClient clientId={clientId} />
    )
}

export default Update;