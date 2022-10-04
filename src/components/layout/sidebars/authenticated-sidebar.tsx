import { Box, Spacer } from '@chakra-ui/react'
import {
  ResizeHandler
} from '@saas-ui/pro'
import {
  IconButton, useActivePath, useLocalStorage, useModals
} from '@saas-ui/react'
import { useNavigate } from '@saas-ui/router'
import NextLink from 'next/link'
import * as React from 'react'
import { AiFillFileAdd, AiFillHome } from 'react-icons/ai'
import { BsPlugFill, BsFillPeopleFill } from 'react-icons/bs'
import {
  FiHash, FiPlus, FiSearch, FiUser
} from 'react-icons/fi'
import { IoDocumentsSharp } from 'react-icons/io5'
import { BillingStatus } from '../billing-status'
import { GlobalSearchInput } from '../global-search-input'
import { MembersInviteDialog } from '../members-invite-dialog'
import { UserMenu } from '../user-menu'

import {
  NavGroup, NavItem,
  NavItemProps, Sidebar,
  SidebarProps, SidebarSection,
  SidebarToggleButton
} from '@saas-ui/sidebar'

export interface AppSidebarProps extends SidebarProps { }

export const AppSidebar: React.FC<AppSidebarProps> = (props) => {
  const modals = useModals()

  const { variant, colorScheme } = props

  const isCondensed = variant === 'condensed'

  return (
    <>
      <Sidebar
        variant={variant}
        colorScheme={colorScheme}
        width={300}
        {...props}
      >
        <SidebarToggleButton />
        <SidebarSection direction="row">
          {!isCondensed && (
            <>
              <Spacer />
              <UserMenu />
            </>
          )}
        </SidebarSection>
        <SidebarSection>
          <Box px={4}>
            {isCondensed ? (
              <IconButton icon={<FiSearch />} aria-label="Search" />
            ) : (
              <GlobalSearchInput />
            )}
          </Box></SidebarSection>
        <SidebarSection flex="1" overflowY="auto">

          <SidebarSection flex="1" gap={6}>
            <NavGroup>
              <AppSidebarLink
                href={"/dashboard"}
                label="Dashboard"
                icon={<AiFillHome />}
              />
              <AppSidebarLink
                href={"/dashboard/invoices"}
                label="Invoices"
                icon={<IoDocumentsSharp />}
              />
              <AppSidebarLink
                href={"/dashboard/integrations"}
                label="Integrations"
                icon={<BsPlugFill />}
              />
              <AppSidebarLink
                href={"/dashboard/clients"}
                label="Clients"
                icon={<BsFillPeopleFill />}
              />
            </NavGroup>
            <NavGroup title="Create Invoice From" isCollapsible>
              <AppSidebarLink
                href={"/dashboard/invoicejiraissues"}
                label="Jira"
                icon={<AiFillFileAdd />}
              />
              <AppSidebarLink
                href={"/dashboard/invoicehubspot"}
                label="Hubspot"
                icon={<AiFillFileAdd />}
              />
            </NavGroup>

            {!isCondensed && (
              <NavGroup title="Search Invoices" isCollapsible>
                <AppSidebarLink
                  href={"/dashboard/invoices/"}
                  label="From this month"
                  icon={<FiHash />}
                />
                <AppSidebarLink
                  href={"/dashboard/invoices/thisweek"}
                  label="From this week"
                  icon={<FiHash />}
                />
              </NavGroup>
            )}

            <NavGroup title="Settings" isCollapsible defaultIsOpen={false}>
              <AppSidebarLink
                href={"/dashboard/settings/profile"}
                label="Profile"
                icon={<FiUser />}
              />
            </NavGroup>

            <Spacer />

            <NavGroup>
              <NavItem
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
            </NavGroup>
          </SidebarSection>
        </SidebarSection>

        {isCondensed ? (
          <SidebarSection>
            <UserMenu />
          </SidebarSection>
        ) : (
          <BillingStatus />
        )}
      </Sidebar>
    </>
  )
}

interface AppSidebarlink extends NavItemProps {
  href: string
}

const AppSidebarLink: React.FC<AppSidebarlink> = (props) => {
  const { href, label, ...rest } = props

  const isActive = useActivePath(href, { end: true })

  return (
    <NextLink href={href} passHref>
      <NavItem
        isActive={isActive}
        label={label}
        {...rest}
      />
    </NextLink>
  )
}