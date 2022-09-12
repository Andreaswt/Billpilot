import { Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardBody } from "@saas-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const TimeItemsStats = () => {
    const form = useFormContext()
    const watch = form.watch()

    const totalTime = useMemo(() => {
        let totalTime = 0

        form.getValues().timeItems.forEach((item: { time: number }) => {
            if (item.time < 0) return 
            totalTime += item.time
        })

        return totalTime
    },
        [watch],
    )

    const totalAmount = useMemo(() => {
        let totalAmount = 0

        form.getValues().timeItems.forEach((item: { time: number, rate: number, discount: number, tax: number }) => {
            if (item.rate < 0 || item.time < 0) return 
            let amount = item.rate * item.time
        
            if (item.discount > 0 && item.discount < 100) {
                const discountFactor = (100 - item.discount) / 100
                amount *= discountFactor
            }

            if (item.tax > 0 && item.tax < 100) {
                const taxFactor = (100 - item.tax) / 100
                amount *= taxFactor
            }

            totalAmount += amount
        })

        return totalAmount
    },
        [watch],
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