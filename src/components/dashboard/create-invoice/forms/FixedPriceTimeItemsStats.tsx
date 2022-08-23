import { Flex, Heading, Text } from "@chakra-ui/react";
import { Card, CardBody } from "@saas-ui/react";
import { useFormikContext } from "formik";
import React, { useCallback, useMemo } from "react";


const FixedPriceTimeItemsStats = () => {
    interface IFixedPriceTimeItemsForm {
        fixedPriceTimeItems: {
            name: string,
            amount: number,
        }[]
    }

    const { values } = useFormikContext<IFixedPriceTimeItemsForm>()

    const totalAmount = useMemo(() => {
        let totalAmount = 0

        values.fixedPriceTimeItems.forEach((item) => {
            totalAmount += item.amount
        })

        return totalAmount
    },
        [values],
    )

    return (
        <Card variant="solid">
            <CardBody>
                <Heading size="sm">Subtotal</Heading>
                <Text fontSize="sm">{totalAmount} USD</Text>
            </CardBody>
        </Card>
    )
}

export default FixedPriceTimeItemsStats;