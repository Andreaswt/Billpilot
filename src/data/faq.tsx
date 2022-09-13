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
      q: 'Can I use Saas UI Pro for Open Source projects?',
      a: 'No currently not. A large part of Saas UI is already released under MIT license. We try to give back to the community as much as possible.',
    },
    {
      q: 'Does Saas UI include Figma, Sketch or other design files?',
      a: 'No, Saas UI does not include any design assets. Maintaining design resources costs a lot of extra effort. We believe small teams can move much faster by designing directly in code, with help of Storybooks.',
    },
  ],
}

export default faq
