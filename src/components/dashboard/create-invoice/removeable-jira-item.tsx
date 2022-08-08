import { CloseIcon } from '@chakra-ui/icons'
import { Badge, HStack, IconButton, Text } from '@chakra-ui/react'
import { Card, CardBody } from '@saas-ui/react'
import * as React from 'react'

interface IRemoveableJiraItem {
    type: string
    name: string,
    displayName: string,
    handleDelete: () => void
}

const RemoveableJiraItem: React.FC<IRemoveableJiraItem> = (props) => {
    const { type, name, displayName, handleDelete } = props

    return (
        <Card>
        <CardBody p={2}>
            <HStack>
                    <Badge colorScheme='green'>{type}</Badge>
                    <Text fontSize='xs'>{displayName}</Text>
                <IconButton onClick={() => handleDelete()} ml={4} aria-label='Remove' size={"xs"} icon={<CloseIcon />} />
            </HStack>
        </CardBody>
    </Card>
    )
}

export default RemoveableJiraItem;
