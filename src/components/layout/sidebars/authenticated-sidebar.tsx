import * as React from 'react'

import { Box, Spacer } from '@chakra-ui/react'

import {
  FiHome,
  FiPlus,
  FiInbox,
  FiHelpCircle,
  FiHash,
  FiUsers,
  FiSearch,
} from 'react-icons/fi'

import {
  Sidebar,
  SidebarProps,
  SidebarNav,
  SidebarLink,
  SidebarNavGroup,
  SidebarOverflow,
  ResizeHandler,
  SidebarLinkProps,
} from '@saas-ui/pro'

import { useActivePath, useNavigate } from '@saas-ui/router'
import NextLink from 'next/link'

import {
  IconButton,
  useModals,
  useLocalStorage,
} from '@saas-ui/react'

import { UserMenu } from '../user-menu'
import { MembersInviteDialog } from '../members-invite-dialog'
import { GlobalSearchInput } from '../global-search-input'
import { BillingStatus } from '../billing-status'

export interface AppSidebarProps extends SidebarProps {}

export const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const modals = useModals()
  const [width, setWidth] = useLocalStorage('app.sidebar.width', 280)

  const { variant, colorScheme } = props

  const isCondensed = variant === 'condensed'

  const onResize: ResizeHandler = ({ width }) => {
    setWidth(width)
  }

  return (
    <>
      <Sidebar
        variant={variant}
        colorScheme={colorScheme}
        isResizable
        onResize={onResize}
        defaultWidth={width}
        {...props}
      >
        <SidebarNav direction="row">
          {!isCondensed && (
            <>
              <Spacer />
              <UserMenu />
            </>
          )}
        </SidebarNav>
        <Box px={4}>
          {isCondensed ? (
            <IconButton icon={<FiSearch />} aria-label="Search" />
          ) : (
            <GlobalSearchInput />
          )}
        </Box>
        <SidebarOverflow>
          <SidebarNav flex="1" spacing={6}>
            <SidebarNavGroup>
              <AppSidebarLink
                href={"/dashboard"}
                label="Dashboard"
                icon={<FiHome />}
              />
              <AppSidebarLink
                href={"/dashboard/inbox"}
                label="Inbox"
                icon={<FiInbox />}
              />
              <AppSidebarLink
                href={"/dashboard/contacts"}
                isActive={useActivePath('contacts', { end: false })}
                label="Contacts"
                icon={<FiUsers />}
              />
            </SidebarNavGroup>

            {!isCondensed && (
              <SidebarNavGroup title="Tags" isCollapsible>
                <SidebarLink
                  href={"/dashboard/tags/design-system"}
                  label="Design system"
                  icon={<FiHash />}
                />
                <SidebarLink
                  href={"/dashboard/tags/framework"}
                  label="Framework"
                  icon={<FiHash />}
                />
                <SidebarLink
                  href={"/dashboard/tags/chakra-ui"}
                  label="Chakra UI"
                  inset={5}
                  icon={<FiHash />}
                />
                <SidebarLink
                  href={"/dashboard/tags/react"}
                  label="React"
                  inset={5}
                  icon={<FiHash />}
                />
              </SidebarNavGroup>
            )}

            <Spacer />

            <SidebarNavGroup>
              <SidebarLink
                onClick={() =>
                  modals.open({
                    title: 'Invite people',
                    component: MembersInviteDialog,
                  })
                }
                label="Invite people"
                color="sidebar-muted"
                icon={<FiPlus />}
              />
              <SidebarLink
                href="https://saas-ui.dev/docs"
                label="Documentation"
                color="sidebar-muted"
                icon={<FiHelpCircle />}
              />
            </SidebarNavGroup>
          </SidebarNav>
        </SidebarOverflow>

        {isCondensed ? (
          <SidebarNav>
            <UserMenu />
          </SidebarNav>
        ) : (
          <BillingStatus />
        )}
      </Sidebar>
    </>
  )
}

interface AppSidebarlink extends SidebarLinkProps {
  href: string
}

const AppSidebarLink: React.FC<AppSidebarlink> = (props) => {
  const { href, label, ...rest } = props
  const navigate = useNavigate()

  return (
    <NextLink href={href} passHref>
    <SidebarLink
      label={label}
      {...rest}
    />
    </NextLink>
  )
}