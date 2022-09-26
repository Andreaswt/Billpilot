import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'What if I am using a different accounting or project management software?',
      a: (
        <>
         We&apos;re always looking to expand our lineup of integrations, contact us for enterprise services and we&apos;ll find a solution for you.
        </>
      ),
    },
    {
      q: 'Can I use Billpilot to track non-billable hours?',
      a: "Yes, internal projects can be set to non-billable to show billable and non-billable time in reports.",
    },
    {
      q: 'What is the purpose of the free trial?',
      a: "When you sign up, you get a fully-functional account showing you everything Billpilot has to offer. After 14 days, you will need to sign up for the business plan. We'll notify you before your trial expires.",
    },
    {
      q: 'How can I stay updated on the development of Billpilot?',
      a: 'Join our slack group on the link above to receive regular updates of new features. There you can also let us know what features you are missing.',
    },
  ],
}

export default faq
