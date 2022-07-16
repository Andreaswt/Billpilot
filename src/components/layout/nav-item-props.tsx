import React, { ReactNode } from 'react';
import {
  Flex,
  Icon,
  Link,
  FlexProps,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import NextLink from 'next/link'

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: ReactText;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  return (
    <NextLink href={path}>
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'brand.800',
            color: 'white',
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink >
  );
};

export default NavItem;