import { Heading } from '@chakra-ui/react'
import { Card, CardBody, Collapse, Link, useCollapse } from '@saas-ui/react'
import { Box } from '@chakra-ui/react'
import * as React from 'react'

interface ICollapsableCardProps {
    defaultIsOpen: boolean
    title: string
    children: React.ReactNode
}

const CollapsableCard: React.FC<ICollapsableCardProps> = (props) => {
    const { defaultIsOpen, title, children } = props

    const { isOpen, getToggleProps, getCollapseProps } = useCollapse({
        defaultIsOpen,
    })

    return (
        <Card title={title}>
            <CardBody>
                <Collapse {...getCollapseProps()}>
                    <Box>{children}</Box>
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default CollapsableCard;
