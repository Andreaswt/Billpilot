import {
    Text, Flex
} from '@chakra-ui/react';

interface IProps {
    title: string
}

const RequiredFormField = (props: IProps) => {
    return (
        <Flex gap={1}>
            {props.title}
            <Text color="red" size="sm">*</Text>
        </Flex>
    )
}

export default RequiredFormField;