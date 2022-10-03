import { Flex, Text, Tooltip } from '@chakra-ui/react';


interface TableTooltipProps {
    text: string
  }
  
  export const TableTooltip: React.FC<TableTooltipProps> = (props) => {
    return (
        <Flex>
            <Tooltip label={props.text}>
                <Text>{props.text}</Text>
            </Tooltip>
        </Flex>
    )
}