import * as React from 'react'
import { Heading } from '@chakra-ui/react'
import { FiUser } from 'react-icons/fi'
import NextLink from "next/link"

import {
  Sidebar as SidebarContainer,
  SidebarNav,
  SidebarLink,
  SidebarNavGroup,
  SidebarOverflow,
  SidebarLinkProps,
  BackButton,
} from '@saas-ui/pro'

const SettingsLink = (props: SidebarLinkProps & { path: string }) => {
  const { path, ...rest } = props
  return (
    <NextLink href={`/dashboard/settings/${path}`} passHref>
      <SidebarLink inset={5} {...rest} />
    </NextLink>)
}

export const SettingsSidebar = () => {
  return (
    <>
      <SidebarContainer>
        <SidebarOverflow>
          <SidebarNav direction="row" alignItems="center" mb="8">
            <NextLink href={"/dashboard"}>
              <BackButton />
            </NextLink>
            <Heading as="h1" fontSize="xl">
              Settings
            </Heading>
          </SidebarNav>
          <SidebarNav flex="1" spacing={6}>
            <SidebarNavGroup title="Account" icon={<FiUser />}>
              <SettingsLink label="Profile" path={'profile'} />
              <SettingsLink label="Security" path={'security'} />
              <SettingsLink label="Notifications" path={'notifications'} />
              <SettingsLink label="Api" path={'api'} />
            </SidebarNavGroup>
          </SidebarNav>
        </SidebarOverflow>
      </SidebarContainer>
    </>
  )
}
