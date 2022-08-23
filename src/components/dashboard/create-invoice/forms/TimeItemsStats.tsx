import { Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardBody } from "@saas-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react";


const TimeItemsStats = () => {
    interface ITimeItemsForm {
        timeItems: {
            name: string,
            time: number,
            rate: number
        }[]
    }

    const { values } = useFormikContext<ITimeItemsForm>()

    const totalTime = useMemo(() => {
        let totalTime = 0

        values.timeItems.forEach((item) => {
            totalTime += item.time
        })

        return totalTime
    },
        [values],
    )

    const totalAmount = useMemo(() => {
        let totalAmount = 0

        values.timeItems.forEach((item) => {
            totalAmount += item.rate * item.time
        })

        return totalAmount
    },
        [values],
    )

    return (
        <Card variant="solid">
            <CardBody>
                <Flex gap={10} flexDirection="row">
                    <Flex flexDirection="column">
                        <Heading size="sm">Time</Heading>
                        <Text fontSize="sm">{totalTime} Hours</Text>
                    </Flex>
                    {/* <Divider /> */}
                    <Flex flexDirection="column">
                        <Heading size="sm">Subtotal</Heading>
                        <Text fontSize="sm">{totalAmount} USD</Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default TimeItemsStats;