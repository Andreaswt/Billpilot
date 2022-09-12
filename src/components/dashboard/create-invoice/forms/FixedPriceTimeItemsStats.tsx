import { Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardBody } from "@saas-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";


const FixedPriceTimeItemsStats = () => {
    const form = useFormContext()
    const watch = form.watch()
    console.log(form.getValues())

    const totalAmount = useMemo(() => {
        let totalAmount = 0

        form.getValues().fixedPriceTimeItems.forEach((item: { name: string, amount: number }) => {
            if (item.amount > 0) {
                totalAmount += item.amount
            }
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
                        <Text fontSize="sm">{totalAmount} Hours</Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default FixedPriceTimeItemsStats;