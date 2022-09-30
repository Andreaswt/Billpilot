import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Portal,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react'

import {
  MenuItem,
  MenuGroup,
  MenuDivider,
  PersonaAvatar,
} from '@saas-ui/react'

import { signOut, useSession } from 'next-auth/react'
import NextLink from "next/link"

export const UserMenu = () => {
  const { data: session, status } = useSession()
  const { toggleColorMode, colorMode } = useColorMode()

  return (
    <Menu>
      <MenuButton as={Button} variant="ghost" aria-label="User menu">
        <PersonaAvatar
          size="xs"
          name={session?.user.name || ''}
          src={session?.user.image || undefined}
        />
      </MenuButton>
      <Portal>
        {/* Wrap the menu in a portal so that the color scheme tokens get applied correctly.  */}
        <MenuList zIndex={['modal', null, 'dropdown']}>
          <MenuGroup title={session?.user.name || ''}>
            <NextLink href={"/dashboard/settings"} passHref>
              <MenuItem label="Profile" />
            </NextLink>
          </MenuGroup>
          <MenuDivider />
          {/* <MenuItem label="Changelog" />
          <MenuItem label="Feedback" />
          <MenuItem label="Help &amp; Support" /> */}
          <MenuItem
            label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              toggleColorMode()
            }}
          />
          <MenuDivider />
          <MenuItem
            onClick={() => signOut()}
            label="Log out"
          />
        </MenuList>
      </Portal>
    </Menu>
  )
}
