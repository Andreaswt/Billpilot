import { HStack, Text } from '@chakra-ui/react'

const pricing = {
  title: 'Pricing for every stage',
  description: 'When you grow, we grow',
  plans: [
    {
      id: 'freetrial',
      title: 'Free Trial',
      description: 'Get the first 14 days free of charge, cancel at any time',
      price: 'Free',
      isRecommended: true,
      features: [
        {
          title: 'All features',
        },
        {
          title: 'Onboarding meetings',
        },
      ],
      action: {
        href: 'https://appulse.gumroad.com/l/saas-ui-pro-pre-order?variant=Single%20license',
      },
    },
    {
      id: 'team',
      title: 'Team',
      description: 'Unlimited license for growing teams.',
      isRecommended: true,
      price: (
        <HStack>
          <Text textDecoration="line-through" fontSize="sm" color="gray.400">
            $12
          </Text>
          <Text>$9.3</Text>
          <Text fontSize="sm">
            / month
          </Text>
        </HStack>
      ),
      features: [
        {
          title: 'Unlimited invoicing',
        },
        {
          title: 'Unlimited projects',
        },
        {
          title: 'Billable rates, costs, profit',
        },
        {
          title: 'Unlimited users',
        },
        {
          title: 'Secured data',
        },
        null,
        {
          title: 'New functionality per request',
          iconColor: 'green.500',
        },
        {
          title: 'Feedback fulfilment',
          iconColor: 'green.500',
        },
      ],
      action: {
        href: 'https://appulse.gumroad.com/l/saas-ui-pro-pre-order?variant=Unlimited%20license',
      },
    },
  ],
}

export default pricing;