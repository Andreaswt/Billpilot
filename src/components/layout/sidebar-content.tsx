import React, { ReactNode } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  BoxProps,
} from '@chakra-ui/react';
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
  } from 'react-icons/fi';
import { IconType } from 'react-icons';
import NavItem from './nav-item-props';

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
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} path={link.path}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    );
  };

  export default SidebarContent;