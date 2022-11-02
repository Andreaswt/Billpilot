import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { NextSeoProps } from 'next-seo'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  
  seo: {
    title: 'Saas UI',
    description: 'The Fully Integrated Solution for Hourly Billing',
  } as NextSeoProps,
  termsUrl: '#',
  privacyUrl: '#',
  header: {
    links: [
      {
        id: 'features',
        href: '/#features',
        label: 'Solution',
      },
      {
        id: 'pricing',
        href: '/#pricing',
        label: 'Pricing',
      },
      {
        id: 'resources',
        href: '/#resources',
        label: 'Resources',
      },
      {
        label: 'Contact',
        href: '/#contact',
      },
      {
        label: 'Integrations',
        href: '/integrations',
      },
      {
        label: 'Login',
        href: '/login',
      },
      {
        label: 'Try It Free',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        Billpilot Limited
      </>
    ),
    links: [
      {
        href: 'mailto:contact@billpilot.io',
        label: 'Contact',
      },
      {
        href: 'https://twitter.com/Billpilotsaas',
        label: <FaTwitter size="14" />,
      },
      {
        href: 'https://www.linkedin.com/company/billpilot/',
        label: <FaLinkedin size="14" />,
      },
    ],
  },
  signup: {
    title: 'Start building with Saas UI',
    features: [
      {
        icon: FiCheck,
        title: 'Accessible',
        description: 'All components strictly follow WAI-ARIA standards.',
      },
      {
        icon: FiCheck,
        title: 'Themable',
        description:
          'Fully customize all components to your brand with theme support and style props.',
      },
      {
        icon: FiCheck,
        title: 'Composable',
        description:
          'Compose components to fit your needs and mix them together to create new ones.',
      },
      {
        icon: FiCheck,
        title: 'Productive',
        description:
          'Designed to reduce boilerplate and fully typed, build your product at speed.',
      },
    ],
  },
}

export default siteConfig
