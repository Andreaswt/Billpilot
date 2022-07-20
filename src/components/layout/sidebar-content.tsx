import React, { ReactNode } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
  Divider,
  Badge,
  Collapse,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiInbox,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import NavItem from './nav-item-props';

import {
  List,
  ListHeader,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemLabel,
  ListItemTertiary,
  ListItemAction,
  useCollapse,
} from '@saas-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, path: '/dashboard' },
  { name: 'Trending', icon: FiTrendingUp, path: '/dashboard' },
  { name: 'Explore', icon: FiCompass, path: '/dashboard' },
  { name: 'Favourites', icon: FiStar, path: '/dashboard' },
  { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
];


const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { isOpen, getToggleProps, getCollapseProps } = useCollapse()
  const router = useRouter()

  return (

    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>

      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontFamily={'heading'}
          color={useColorModeValue('gray.800', 'white')}
          fontSize="2xl">
          Logo
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <Box px={4} as="nav">
        <List>
          <Link href={'/dashboard'} passHref>
          <ListItem mb={3} bg={router.pathname == '/dashboard' ? 'gray.100' : ''}  rounded={'lg'} as="a">
            <ListItemIcon rounded={'lg'} as={FiHome} />
            <ListItemLabel rounded={'lg'} primary="Home" />
          </ListItem>
          </Link>
          <ListItem as="a" href="#inbox" {...getToggleProps()}>
            <ListItemIcon as={FiInbox} />
            <ListItemLabel primary="Settings" />
            <ListItemTertiary>
              {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </ListItemTertiary>
          </ListItem>
          <Collapse {...getCollapseProps()}>
            <List>
            <Link href={'/dashboard/settings'} passHref>
              <ListItem as="a">
                <ListItemLabel ps={12}>Settings 1</ListItemLabel>
              </ListItem>
              </Link>
              <Link href={'/dashboard/settings'} passHref>
              <ListItem as="a">
                <ListItemLabel ps={12}>Settings 2</ListItemLabel>
              </ListItem>
              </Link>
            </List>
          </Collapse>
        </List>
      </Box>
    </Box>
  );
};

export default SidebarContent;