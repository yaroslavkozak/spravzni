/**
 * Homepage Components Configuration
 * Defines all editable fields for each homepage component
 */

export interface ComponentTextField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'rich'
  description?: string
}

export interface ComponentImageField {
  key: string
  label: string
  description?: string
  accept?: string // e.g., 'image/*', 'image/svg+xml'
}

export interface HomepageComponent {
  name: string
  displayName: string
  textFields?: ComponentTextField[]
  imageFields?: ComponentImageField[]
}

export const homepageComponents: HomepageComponent[] = [
  {
    name: 'hero',
    displayName: 'Hero Section',
    textFields: [
      { key: 'hero.title.line1', label: 'Title Line 1', type: 'text' },
      { key: 'hero.title.line2', label: 'Title Line 2', type: 'text' },
      { key: 'hero.subtitle.main', label: 'Subtitle Main', type: 'text' },
      { key: 'hero.subtitle.donationInfo', label: 'Donation Info', type: 'text' },
      { key: 'hero.cta.services', label: 'CTA Button Text', type: 'text' },
    ],
    imageFields: [
      { key: 'hero.background', label: 'Background Image', accept: 'image/*' },
    ],
  },
  {
    name: 'imagine',
    displayName: 'Imagine Section',
    textFields: [
      { key: 'imagine.title', label: 'Title', type: 'text' },
      { key: 'imagine.line1', label: 'Line 1', type: 'text' },
      { key: 'imagine.line2', label: 'Line 2', type: 'text' },
      { key: 'imagine.p1.line1', label: 'Paragraph 1 Line 1', type: 'text' },
      { key: 'imagine.p1.line2', label: 'Paragraph 1 Line 2', type: 'text' },
      { key: 'imagine.p2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'imagine.p3.line1', label: 'Paragraph 3 Line 1', type: 'text' },
      { key: 'imagine.p3.line2', label: 'Paragraph 3 Line 2', type: 'text' },
    ],
  },
  {
    name: 'videoPartners',
    displayName: 'Video & Partners Section',
    textFields: [
      { key: 'videoPartners.thanks', label: 'Thanks Text', type: 'text' },
      { key: 'videoPartners.play', label: 'Play Button', type: 'text' },
      { key: 'videoPartners.pause', label: 'Pause Button', type: 'text' },
      { key: 'videoPartners.mute', label: 'Mute Button', type: 'text' },
      { key: 'videoPartners.unmute', label: 'Unmute Button', type: 'text' },
    ],
    imageFields: [
      { key: 'videoPartners.video', label: 'Video File', accept: 'video/*' },
      { key: 'videoPartners.playIcon', label: 'Play Icon', accept: 'image/svg+xml' },
      { key: 'videoPartners.pauseIcon', label: 'Pause Icon', accept: 'image/svg+xml' },
    ],
  },
  {
    name: 'about',
    displayName: 'About Section',
    textFields: [
      { key: 'about.p1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'about.p2', label: 'Paragraph 2', type: 'textarea' },
      { key: 'about.p3', label: 'Paragraph 3', type: 'textarea' },
      { key: 'about.p4', label: 'Paragraph 4', type: 'textarea' },
      { key: 'about.readMore', label: 'Read More Link', type: 'text' },
    ],
    imageFields: [
      { key: 'about.quote_icon', label: 'Quote Icon', accept: 'image/svg+xml' },
    ],
  },
  {
    name: 'stats',
    displayName: 'Stats Section',
    textFields: [
      { key: 'stats.title', label: 'Title', type: 'text' },
      { key: 'stats.subtitle', label: 'Subtitle', type: 'text' },
      { key: 'stats.card1', label: 'Card 1 Text', type: 'textarea' },
      { key: 'stats.card2', label: 'Card 2 Text', type: 'textarea' },
      { key: 'stats.card3', label: 'Card 3 Text', type: 'textarea' },
      { key: 'stats.amount', label: 'Amount (number)', type: 'text' },
    ],
  },
  {
    name: 'pricingCta',
    displayName: 'Pricing CTA Section',
    textFields: [
      { key: 'pricingCta.title', label: 'Title', type: 'text' },
      { key: 'pricingCta.subtitle', label: 'Subtitle', type: 'text' },
      { key: 'pricingCta.button', label: 'Button Text', type: 'text' },
    ],
  },
  {
    name: 'space',
    displayName: 'Space Section',
    textFields: [
      { key: 'space.title', label: 'Title', type: 'text' },
      { key: 'space.subtitle', label: 'Subtitle', type: 'text' },
      { key: 'space.feature1', label: 'Feature 1', type: 'text' },
      { key: 'space.feature2', label: 'Feature 2', type: 'text' },
      { key: 'space.feature3', label: 'Feature 3', type: 'text' },
      { key: 'space.feature4', label: 'Feature 4', type: 'text' },
      { key: 'space.feature5', label: 'Feature 5', type: 'text' },
      { key: 'space.feature6', label: 'Feature 6', type: 'text' },
      { key: 'space.feature7', label: 'Feature 7', type: 'text' },
      { key: 'space.feature8', label: 'Feature 8', type: 'text' },
    ],
    imageFields: [
      { key: 'space.feature1.icon', label: 'Feature 1 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature2.icon', label: 'Feature 2 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature3.icon', label: 'Feature 3 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature4.icon', label: 'Feature 4 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature5.icon', label: 'Feature 5 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature6.icon', label: 'Feature 6 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature7.icon', label: 'Feature 7 Icon', accept: 'image/svg+xml' },
      { key: 'space.feature8.icon', label: 'Feature 8 Icon', accept: 'image/svg+xml' },
    ],
  },
  // Add more components as needed
  // Note: ServicesSection is already managed via /admin/services
]
