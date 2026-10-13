// All page copy for StrataPay lives here.

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'Cards', href: '#cards' },
  { label: 'Fees', href: '#features' },
  { label: 'FAQ', href: '#faq' },
]

export const hero = {
  badge: 'Built on pump.fun',
  title: 'The card for coin creators',
  body: 'Turn creator fees into spending power. Fund your people, your project, or yourself.',
  cta: 'Get your card',
}

export const reveal = {
  chips: ['Fees land on your card', 'Settles in SOL', 'Cards for your whole team', 'Freeze it in one tap'],
  headlineLit: ['Your', 'coin', 'pays', 'for', 'itself'],
  headlineMuted: 'and for the people who build it',
  cta: 'Claim your card',
}

export const features = [
  {
    key: 'linked',
    title: 'Linked to your coin.',
    body: 'Connect the wallet behind your pump.fun coin and creator fees flow straight to your card balance.',
  },
  {
    key: 'spend',
    title: 'Spend where cards work.',
    body: 'Pay online or at the counter with money your coin earned. No bank in the middle.',
  },
  {
    key: 'share',
    title: 'Fund your people.',
    body: 'Send a cut of fees to a mod, an artist or a dev. Set it once, or pay as you go.',
  },
  {
    key: 'keys',
    title: 'You hold the keys.',
    body: 'Fees route from your own wallet. Cap a limit, freeze a card or pull funds back any time.',
  },
] as const

export const cardsSection = {
  title: 'Pick your card',
  body: 'One fee stream, two ways to spend it. Start small, or give your whole team a card.',
  cards: [
    {
      name: 'Starter',
      sub: 'Virtual, for online spend',
      variant: 'silver' as const,
      last4: '0815',
      perks: [
        { icon: 'coins', title: '$5,000 a month', body: 'Room for tools, hosting and the odd launch party.' },
        { icon: 'percent', title: 'Flat 2% on conversion', body: 'One clear rate each time fees move to the card, plus a one-time $10 card fee.' },
        { icon: 'headset', title: 'Help from real people', body: 'Reach us from the dashboard when you get stuck.' },
        { icon: 'phone', title: 'Any online checkout', body: 'Domains, subscriptions, ad credits and anything else that takes cards.' },
      ],
      cta: { label: 'Start with Starter', href: '/app/card' },
    },
    {
      name: 'Creator',
      sub: 'Physical and virtual, verified',
      variant: 'mint' as const,
      last4: '4207',
      perks: [
        { icon: 'coins', title: 'No monthly cap', body: 'Spend what your coin earns, as fast as it earns it.' },
        { icon: 'percent', title: '0% on conversion', body: 'Creator fees reach the card with nothing taken off.' },
        { icon: 'team', title: 'Team cards', body: 'Hand out cards to your people, each with its own limit.' },
        { icon: 'card', title: 'Tap to pay in person', body: 'Add it to your phone wallet or carry the physical card.' },
      ],
      cta: { label: 'Get Creator', href: '/app/card' },
    },
  ],
}

export const steps = {
  title: 'From fees to spending in three steps',
  items: [
    { label: 'Step 1', title: 'Connect your wallet', body: 'Sign in with the wallet that launched your coin. No passwords and no long forms.' },
    { label: 'Step 2', title: 'Pick your coin', body: "Choose which pump.fun coin's creator fees fund the card. Switch whenever you like." },
    { label: 'Step 3', title: 'Spend or share', body: 'Your card is live in minutes. Keep it for yourself, or hand cards to your team.' },
  ],
}

export const cta = {
  titleTop: 'Fees in.',
  titleBottom: 'Spending out.',
  body: 'Every trade on your coin adds to the balance. StrataPay turns it into money you can actually use.',
  button: 'Start for free',
}

export const useCases = {
  title: 'StrataPay: for every part of the project',
  body: 'Creator fees should do more than sit in a wallet. Pay the artist who drew your mascot, keep the chat bots running, or take yourself out after launch day.',
  tabs: [
    { key: 'team', label: 'Team pay', item: 'Mod payout', amount: '750.00' },
    { key: 'art', label: 'Artists', item: 'Mascot art', amount: '320.00' },
    { key: 'servers', label: 'Servers', item: 'Bot hosting', amount: '48.00' },
    { key: 'ads', label: 'Ads', item: 'Ad credits', amount: '150.00' },
    { key: 'merch', label: 'Merch', item: 'Hoodie run', amount: '212.40' },
    { key: 'you', label: 'Yourself', item: 'Dinner', amount: '64.90' },
  ],
} as const

/** Social links: only X for now. Add more entries here if you open other channels. */
export const socials = [{ platform: 'x', label: 'StrataPay on X', action: 'Follow', href: 'https://x.com/StrataPay_' }] as const

export const socialsSection = {
  chip: 'Socials',
  title: 'Stay close to the build.',
  body: 'Launch news, waitlist spots and tips for stretching your fees land on our channels first.',
}

export const faq = {
  title: 'Know before you claim',
  body: 'How fees reach the card, who can use it, and what stays in your hands.',
  items: [
    {
      q: 'How do creator fees end up on my card?',
      a: 'StrataPay watches the wallet that receives your pump.fun creator fees. When fees arrive, you can sweep them to your card balance automatically or move them yourself. Every sweep shows up in your activity feed next to the trades it came from, so you always know where the money started.',
    },
    {
      q: "Do I need to be the coin's creator?",
      a: 'No. Anyone can get a card funded from their own wallet. To route a coin’s creator fees to the card, connect the wallet that launched it on pump.fun. You can link a coin later, too.',
    },
    {
      q: 'Can I give cards to my team?',
      a: 'On the Creator card you can issue extra cards, set a limit on each one and pause any of them whenever you like.',
    },
    {
      q: 'Which coins work with StrataPay?',
      a: 'Any coin launched on pump.fun where you hold the creator wallet. If you run more than one coin, choose which ones feed the card.',
    },
    {
      q: 'Where can I spend?',
      a: 'Anywhere that takes card payments online, and in person once you add the card to your phone or carry the physical card.',
    },
    {
      q: 'What does it cost?',
      a: 'Starter has a one-time $10 card fee and a flat 2% each time fees convert. Creator has no conversion fee. Neither card has a monthly charge.',
    },
    {
      q: 'Is StrataPay part of pump.fun?',
      a: 'No. StrataPay is an independent project built on pump.fun. It is not run by, affiliated with or endorsed by pump.fun.',
    },
    {
      q: 'What happens if I lose my card?',
      a: 'Freeze it from the dashboard in one tap. Your fee balance stays where it is, and you can order a replacement.',
    },
  ],
}

export const footer = {
  links: [
    { label: 'Cards', href: '#cards' },
    { label: 'Features', href: '#features' },
    { label: 'Team cards', href: '#cards' },
    { label: 'Pricing', href: '#cards' },
    { label: 'Help center', href: '#faq' },
    { label: 'Security', href: '#faq' },
    { label: 'About', href: '#top' },
    { label: 'Terms', href: '#top' },
    { label: 'Privacy', href: '#top' },
  ],
  copyright: '© StrataPay. All rights reserved.',
}
