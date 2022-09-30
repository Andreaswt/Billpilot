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
          title: 'Onboarding meeting',
        },
      ],
      action: {
        href: '/signup',
      },
    },
    {
      id: 'business',
      title: 'Business',
      description: 'Unlimited license for businesses.',
      isRecommended: true,
      price: (
        <HStack>
          {/* <Text textDecoration="line-through" fontSize="sm" color="gray.400">
            $12
          </Text> */}
          <Text>$99</Text>
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
          title: 'New functionality requested is prioritized',
          iconColor: 'green.500',
        },
        {
          title: 'Feedback fulfilment',
          iconColor: 'green.500',
        },
      ],
      action: {
        href: '/signup',
      },
    },
  ],
}

export default pricing;