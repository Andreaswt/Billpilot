import * as React from 'react'

import { Flex, FlexProps } from '@chakra-ui/react'
import { AuthProps } from '@saas-ui/auth'
import { AppShell, Page } from '@saas-ui/pro'
import { useLocation } from '@saas-ui/router'
import { useSession } from 'next-auth/react'
import { ClientOnly } from '../client-only'
import { AppSidebar } from '../sidebars/authenticated-sidebar'
import { SettingsSidebar } from '../sidebars/settings-sidebar'
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
