import { forwardRef } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Button, ButtonProps } from '@saas-ui/react'

import Link from 'next/link'

export interface NavLinkProps extends ButtonProps {
  isActive?: boolean
  href?: string
  id?: string
}

export const NavLink = forwardRef<NavLinkProps, 'a'>((props, ref) => {
  const { href, type, isActive, ...rest } = props

  return (
    <NextLink href={href as string} passHref>
      <Button
        as="a"
        ref={ref}
        variant="nav-link"
        lineHeight="2rem"
        isActive={isActive}
        fontWeight="medium"
        {...rest}
      />
    </NextLink>
  )
})

NavLink.displayName = 'NavLink'
