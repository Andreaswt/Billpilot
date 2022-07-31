import { Badge, Checkbox, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spacer, Stack } from '@chakra-ui/react';
import {
    Button, List, ListItemButton, ListItemIcon, ListItemLabel,
    ListItemTertiary, SearchInput
} from '@saas-ui/react';
import * as React from 'react';
import { FiHome, FiInbox } from 'react-icons/fi';

const JiraTimeFilter: React.FC = () => {
    const [value, setValue] = React.useState('')

    interface ICheckedItems {
        projects: string[]
        bugs: string[]
        epics: string[]
        stories: string[]
        issues: string[]
        subtasks: string[]
        employees: string[]
    }

    const [checkedItems, setCheckedItems] = React.useState<ICheckedItems>(
        {
            projects: [],
            bugs: [],
            epics: [],
            stories: [],
            issues: [],
            subtasks: [],
            employees: [],
        }
    );

    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log("yeet");
        console.log(name, value);
        // setCheckedItems({
        //     ...checkedItems,
        //     [name]: [...checkedItems[name], value]
        // })
    }

    let projects: { key: string, name: string, time: number }[] = [
        { key: "123", name: "projektnavn", time: 123},
        { key: "321", name: "projektnavn2", time: 987}
    ];

    return (
        <Popover size={{
            h: '150px',
            w: '500px',
            fontSize: 'lg',
            px: '100px',
          }} isLazy>
            <PopoverTrigger>
                <Button colorScheme={"purple"}>Select Time</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader fontWeight='semibold'>Filter time items from Jira</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody p={0}>
                    <Flex>
                        <List>
                            <ListItemButton onClick={() => console.log("projects")}>
                                <ListItemIcon as={FiHome} />
                                <ListItemLabel primary="Projects" />
                            </ListItemButton>
                            <ListItemButton onClick={() => console.log("projects")}>
                                <ListItemIcon as={FiInbox} />
                                <ListItemLabel primary="Issues" />
                            </ListItemButton>
                        </List>
                        <Spacer />
                        <Stack>
                            <SearchInput
                                placeholder="Search"
                                value={value}
                                onChange={(e: any) => setValue(e.target.value)}
                                onReset={() => setValue('')}
                            />
                            <Stack pl={6} mt={1} spacing={1}>
                                {
                                    projects.map(project => {
                                        return (
                                            <Checkbox
                                                key={project.key}
                                                name="projects"
                                                value={project.key}
                                                onChange={handleCheck}
                                                isChecked={checkedItems.projects.includes(project.key)}>
                                                {project.name}
                                            </Checkbox>
                                        )
                                    })
                                }

                            </Stack>
                        </Stack>
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default JiraTimeFilter;