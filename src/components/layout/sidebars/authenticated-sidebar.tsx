import * as React from 'react'

import { Box, Spacer } from '@chakra-ui/react'

import {
  FiHash, FiHelpCircle,
  FiPlus, FiSearch
} from 'react-icons/fi'

import { IoDocumentsSharp } from 'react-icons/io5'

import { AiFillFileAdd, AiFillHome } from 'react-icons/ai'
import { BsPlugFill } from 'react-icons/bs'

import {
  ResizeHandler, Sidebar, SidebarLink, SidebarLinkProps, SidebarNav, SidebarNavGroup,
  SidebarOverflow, SidebarProps
} from '@saas-ui/pro'

import { useNavigate } from '@saas-ui/router'
import NextLink from 'next/link'

import {
  IconButton, useLocalStorage, useModals
} from '@saas-ui/react'

import { BillingStatus } from '../billing-status'
import { GlobalSearchInput } from '../global-search-input'
import { MembersInviteDialog } from '../members-invite-dialog'
import { UserMenu } from '../user-menu'
import { trpc } from '../../../utils/trpc'

export interface AppSidebarProps extends SidebarProps { }

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
                icon={<BsPlugFill />}
              />
            </SidebarNavGroup>
            <SidebarNavGroup title="Create Invoice From" isCollapsible>
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
            </SidebarNavGroup>

            {!isCondensed && (
              <SidebarNavGroup title="Search Invoices" isCollapsible>
                <SidebarLink
                  href={"/dashboard/invoices/design-system"}
                  label="From this month"
                  icon={<FiHash />}
                />
                <SidebarLink
                  href={"/dashboard/tags/framework"}
                  label="From this week"
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