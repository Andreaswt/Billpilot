import * as React from 'react'

import { Flex, FlexProps, Center } from '@chakra-ui/react'
import { AuthProps } from '@saas-ui/auth'
import { Loading } from '@saas-ui/react'
import { AppShell, Page } from '@saas-ui/pro'
import { useLocation } from '@saas-ui/router'
import { useSession } from 'next-auth/react'
import { ClientOnly } from '../client-only'
import { AppSidebar } from '../sidebars/authenticated-sidebar'
import { SettingsSidebar } from '../sidebars/settings-sidebar'
import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

import { SkipNavContent, SkipNavLink } from '@chakra-ui/skip-nav'

import { Header, HeaderProps } from '../../landing-page/layout/header'
import {
    AnnouncementBanner,
    AnnouncementBannerProps,
} from '../../landing-page/announcement-banner/announcement-banner'
import { Footer, FooterProps } from '../../landing-page/layout/footer'
import router from 'next/router'

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
            {children}
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
            {children}
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
    let announcement: AnnouncementBannerProps = { title: "", description: "", href: "/" };
    let header: HeaderProps = {};
    let footer: FooterProps = {};

    return (
        <AppShell>
            <SkipNavLink>Skip to content</SkipNavLink>
            <AnnouncementBanner {...announcement} />
            <Header {...header} />
            <Box as="main">
                <SkipNavContent />
                {children}
            </Box>
            <Footer {...footer} />
        </AppShell>
    )
}

/**
 * Layout for loading
 */
 export const LoadingScreen: React.FC<LayoutProps> = ({
    children,
    ...rest
}) => {
    return (
        <AppShell h="100vh">
            <Center h="100vh" as="main">
                <Loading />
            </Center>
        </AppShell>
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

    publicRoutes =["/", "/login", "/signup", "/terms", "/privacypolicy"]

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
    else if (!isPublicRoute && status === 'unauthenticated') {
        LayoutComponent = PublicLayout
    }
    else {
        LayoutComponent = LoadingScreen
    }

    return (
        <ClientOnly>
            <LayoutComponent flex="1" minH="0" {...rest}>
                {children}
            </LayoutComponent>
        </ClientOnly>
    )
}
