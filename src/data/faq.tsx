import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'What if I am using a different accounting or project management software?',
      a: (
        <>
         We're always looking to expand our lineup of integrations, contact the sales team for enterprise services and we'll find a solution for you.
        </>
      ),
    },
    {
      q: 'Can I use Billpilot to track non-billable hours?',
      a: "Yes, internal projects can be set to non-billable to show billable and non-billable time in reports.",
    },
    {
      q: 'What is the purpose of the free trial?',
      a: 'When you sign up, you get a fully-functional account showing you everything Billpilot has to offer. After 14 days, you will need to sign up for a plan. We’ll notify you before your trial expires.',
    },
    {
      q: 'Can I change the number of memebrs on my team?',
      a: 'Billpilot is pay-as-you-go, and you can easily add or remove members from your account in less than a minute.',
    },
  ],
}

export default faq
