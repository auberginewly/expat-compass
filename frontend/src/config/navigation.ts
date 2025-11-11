export type NavItem = {
  key: string
  path: string
  translationKey: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', path: '/', translationKey: 'nav:home' },
  { key: 'medical', path: '/medical', translationKey: 'nav:medical' },
  { key: 'transport', path: '/transport', translationKey: 'nav:transport' },
  { key: 'payment', path: '/payment', translationKey: 'nav:payment' },
  { key: 'education', path: '/education', translationKey: 'nav:education' },
  { key: 'culture', path: '/culture', translationKey: 'nav:culture' },
  { key: 'forum', path: '/forum', translationKey: 'nav:forum' },
]

