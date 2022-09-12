import * as React from 'react'
import { HStack, Flex, Spacer} from '@chakra-ui/react'
import { ButtonLink } from '../../landing-page/button-link/button-link'
import { useRouter } from 'next/router'

import siteConfig from '../../../data/config'

import { NavLink } from '../nav-link/nav-link'

import { useScrollSpy } from '../../../hooks/landing-page/use-scrollspy'

import { MobileNavButton } from '../mobile-nav/mobile-nav'
import { MobileNavContent } from '../mobile-nav/mobile-nav'
import { useDisclosure, useUpdateEffect } from '@chakra-ui/react'

import ThemeToggle from './theme-toggle'
import Colors from '../../../styles/colors'


const Navigation: React.FC = () => {
  const mobileNav = useDisclosure()
  const router = useRouter()
  const activeId = useScrollSpy(
    siteConfig.header.links
      .filter(({ id }) => id)
      .map(({ id }) => `[id="${id}"]`),
    {
      threshold: 0.75,
    }
  )

  const mobileNavBtnRef = React.useRef<HTMLButtonElement>()

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.isOpen])

  return (
  <>
  <Flex w="100%" justify="space-between">
    <HStack>
      <NavLink
          label = {"Solution"}
          display={['none', null, 'block']}
          href={"#features"}
          isActive={
            !!(
              ("#features" && !!router.asPath.match(new RegExp("dfsf")))
            )
          }
        />
      <NavLink
          label = {"Pricing"}
          display={['none', null, 'block']}
          href={"#pricing"}
          isActive={
            !!(
              ("#pricing" && !!router.asPath.match(new RegExp("Pricing")))
            )
          }
        />
      <NavLink
          label = {"Resources"}
          display={['none', null, 'block']}
          href={"#resources"}
          isActive={
            !!(
              ("#resources" && !!router.asPath.match(new RegExp("Resources")))
            )
          }
        />
        <NavLink
          label = {"Contact"}
          display={['none', null, 'block']}
          href={"dfsf"}
          isActive={
            !!(
              ("#dfsf" && !!router.asPath.match(new RegExp("dfsf")))
            )
          }
        />
        </HStack>
        <Spacer />
        <HStack>
        <NavLink
          label = {"Login"}
          display={['none', null, 'block']}
          href={"/login"}
          isActive={
            !!(
              ("/login" && !!router.asPath.match(new RegExp("Login")))
            )
          }
        />
        <ButtonLink colorScheme= "primary" size="sm" href="/signup">
                  Sign Up
        </ButtonLink>
        {/* <NavLink
          label = {"Try It Free"}
          display={['none', null, 'block']}
          href={"dfsf"}
          isActive={
            !!(
              ("#dfsf" && !!router.asPath.match(new RegExp("dfsf")))
            )
          }
        /> */}
      </HStack>
  <ThemeToggle />

  <MobileNavButton
    ref={mobileNavBtnRef}
    aria-label="Open Menu"
    onClick={mobileNav.onOpen}
  />

  <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose} />

</Flex>

  </>

  )
}

export default Navigation
