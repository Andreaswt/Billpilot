import * as React from 'react'

import { Flex, FlexProps, Container, Link, Spacer } from '@chakra-ui/react'
import { Auth, AuthProps } from '@saas-ui/auth'
import { useLocation } from '@saas-ui/router'
import { Logo } from '../logo'
import { AppShell, AppShellProps, DataGridPagination, DataGrid, SidebarOverflow, SidebarNav, SidebarLink, Sidebar, SidebarMenu, Page } from '@saas-ui/pro'
import { MenuItem, NProgressNextRouter, PersonaAvatar, SaasProvider } from '@saas-ui/react'
import { FiHome, FiUser, FiUsers } from 'react-icons/fi'
import { SettingsSidebar } from '../sidebars/settings-sidebar'
import NextLink from "next/link"
import { AppSidebar } from '../sidebars/authenticated-sidebar'
import { useSession } from 'next-auth/react';
import { ClientOnly } from '../client-only'
/**
 * Layout for authentication screens (login/signup/etc...)
 */
export const AuthLayout: React.FC<FlexProps> = ({ children, ...rest }) => {
    return (
        <Flex minH="100vh" align="center" justify="center" {...rest}>
            {children}
        </Flex>
    )
}

interface LayoutProps extends AuthProps {
    children: React.ReactNode
}

/**
 * Base layout for authenticated pages.
 */
export const AuthenticatedLayout: React.FC<LayoutProps> = ({
    children,
    ...rest
}) => {
    return (
        <AppShell
            minH="100vh"
            sidebar={
                <AppSidebar />
            }>
            {/* <Page title="Page" height="400px" contentWidth="full"> */}
            <Page title="Page" contentWidth="full">
                {children}
            </Page>
        </AppShell>
    )
}

/**
 * Layout for settings pages.
 */
export const SettingsLayout: React.FC<LayoutProps> = ({
    children,
    ...rest
}) => {
    return (
        <AppShell
            minH="100vh"
            sidebar={
                <SettingsSidebar />
            }
        >
            <Page title="Page" height="400px" contentWidth="full">
                {children}
            </Page>
        </AppShell>
    )
}

/**
 * Layout for public pages. (landing etc)
 */
export const PublicLayout: React.FC<LayoutProps> = ({
    children,
    ...rest
}) => {
    return (
        <AppShell>{children}</AppShell>
    )
}

/**
 * Application layout
 * Handles rendering
 */
interface AppLayoutProps extends LayoutProps {
    children: React.ReactNode,
    publicRoutes?: Array<string>
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    publicRoutes = [],
    ...rest
}) => {
    const { data: session, status } = useSession();
    const location = useLocation()

    const isPublicRoute = publicRoutes.indexOf(location.pathname) !== -1
    const isSettings = location.pathname.indexOf('/dashboard/settings') === 0


    let LayoutComponent
    if (isPublicRoute) {
        LayoutComponent = PublicLayout
    }
    else if (isSettings) {
        LayoutComponent = SettingsLayout
    }
    else if (status === 'authenticated' && session) {
        LayoutComponent = AuthenticatedLayout
    }
    else {
        LayoutComponent = PublicLayout
    }

    return (
        <ClientOnly>
            <LayoutComponent flex="1" minH="0" {...rest}>
                {children}
            </LayoutComponent>
        </ClientOnly>
    )
}
