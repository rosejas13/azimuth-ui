export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  features: string[];
  badges: Array<{ label: string; variant: 'accent' | 'success' | 'info' | 'warning' | 'danger' | 'neutral' }>;
  version: string;
  activeUsers: number;
  rating: number;
  founderId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socials: Array<{ platform: string; handle: string }>;
  since: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface NavItem {
  key: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'components', label: 'Components' },
  { key: 'about', label: 'About' },
  { key: 'products', label: 'Products' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'contact', label: 'Contact' },
  { key: 'privacy', label: 'Privacy' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'azimuth-core',
    name: 'Azimuth Core',
    tagline: 'The foundation for modern UIs',
    description: 'A configurable, accessible React component library built with TypeScript and CSS Modules. Theme-driven via a single ThemeProvider with CSS custom properties. WCAG 2.2 AA compliant out of the box.',
    price: 0,
    category: 'Library',
    features: ['60+ Components', 'CSS Custom Properties', 'OKLCH Color System', 'Tree-shakeable', 'TypeScript Strict'],
    badges: [{ label: 'Free', variant: 'success' }, { label: 'Open Source', variant: 'accent' }, { label: 'TypeScript', variant: 'info' }],
    version: '0.2.0',
    activeUsers: 12500,
    rating: 4.8,
    founderId: 'rose',
  },
  {
    id: 'azimuth-pro',
    name: 'Azimuth Pro',
    tagline: 'Enterprise-grade UI accelerator',
    description: 'Premium component suite with advanced data visualization, complex form patterns, and enterprise-grade accessibility tooling. Includes Figma design kit and priority support.',
    price: 299,
    category: 'Product',
    features: ['120+ Components', 'Figma Design Kit', 'Priority Support', 'Advanced Data Viz', 'Form Builder'],
    badges: [{ label: 'Popular', variant: 'accent' }, { label: 'Premium', variant: 'warning' }],
    version: '2.1.0',
    activeUsers: 3400,
    rating: 4.9,
    founderId: 'alex',
  },
  {
    id: 'azimuth-cloud',
    name: 'Azimuth Cloud',
    tagline: 'Design systems at scale',
    description: 'Cloud-hosted design system management platform. Collaborate with your team, publish design tokens, and distribute components across your organization with automated updates.',
    price: 99,
    category: 'SaaS',
    features: ['Team Collaboration', 'Token Management', 'Auto Updates', 'Analytics', 'Audit Logs'],
    badges: [{ label: 'New', variant: 'info' }, { label: 'SaaS', variant: 'neutral' }],
    version: '1.0.0',
    activeUsers: 890,
    rating: 4.6,
    founderId: 'jordan',
  },
  {
    id: 'azimuth-ai',
    name: 'Azimuth AI',
    tagline: 'AI-powered component generation',
    description: 'Generate production-ready React components from natural language descriptions. Powered by fine-tuned LLMs trained on the entire Azimuth component catalog.',
    price: 149,
    category: 'SaaS',
    features: ['Natural Language to Code', 'Style Matching', 'Accessibility Checks', 'One-click Export', 'Context-aware'],
    badges: [{ label: 'Beta', variant: 'warning' }, { label: 'AI', variant: 'accent' }],
    version: '0.9.0',
    activeUsers: 2100,
    rating: 4.7,
    founderId: 'rose',
  },
  {
    id: 'azimuth-analytics',
    name: 'Azimuth Analytics',
    tagline: 'Understand your component usage',
    description: 'Track component usage across your applications. Identify unused components, measure performance impact, and get recommendations for optimization.',
    price: 49,
    category: 'SaaS',
    features: ['Usage Tracking', 'Performance Insights', 'Bundle Analysis', 'Migration Reports', 'Slack Integration'],
    badges: [{ label: 'Tool', variant: 'neutral' }],
    version: '1.2.0',
    activeUsers: 560,
    rating: 4.5,
    founderId: 'jordan',
  },
  {
    id: 'azimuth-icons',
    name: 'Azimuth Icons',
    tagline: 'Consistent iconography for your brand',
    description: 'A curated icon set designed to work seamlessly with Azimuth components. Custom icon requests, multiple formats, and automatic accessibility attributes.',
    price: 0,
    category: 'Library',
    features: ['2000+ Icons', 'SVG & React', 'Accessible by Default', 'Custom Requests', 'Icon Font'],
    badges: [{ label: 'Free', variant: 'success' }],
    version: '3.0.0',
    activeUsers: 8900,
    rating: 4.7,
    founderId: 'alex',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'rose',
    name: 'Rose Jasmine',
    role: 'Founder & CEO',
    bio: 'Building the future of accessible UI development. Previously led design systems at three Fortune 500 companies. Open source advocate and accessibility champion.',
    avatar: '',
    socials: [{ platform: 'GitHub', handle: '@rosejas13' }, { platform: 'Twitter', handle: '@rosejas' }],
    since: '2023',
  },
  {
    id: 'alex',
    name: 'Alex Chen',
    role: 'CTO & Co-Founder',
    bio: 'Distributed systems engineer turned UI framework architect. Built component libraries used by millions of developers worldwide.',
    avatar: '',
    socials: [{ platform: 'GitHub', handle: '@alexchen' }, { platform: 'Twitter', handle: '@alexchen' }],
    since: '2023',
  },
  {
    id: 'jordan',
    name: 'Jordan Taylor',
    role: 'Head of Product',
    bio: 'Product strategist with a passion for developer experience. Previously PM at Vercel and Stripe. Drives the vision for Azimuth\'s product suite.',
    avatar: '',
    socials: [{ platform: 'GitHub', handle: '@jordant' }, { platform: 'Twitter', handle: '@jordantaylor' }],
    since: '2024',
  },
  {
    id: 'samira',
    name: 'Samira Patel',
    role: 'Lead Designer',
    bio: 'Design systems expert and accessibility specialist. Creates consistent, beautiful, and inclusive user experiences across all Azimuth products.',
    avatar: '',
    socials: [{ platform: 'Dribbble', handle: '@samira' }, { platform: 'Twitter', handle: '@samira' }],
    since: '2024',
  },
  {
    id: 'marcus',
    name: 'Marcus Johnson',
    role: 'Engineering Lead',
    bio: 'Full-stack engineer with deep expertise in React, TypeScript, and build tooling. Maintains the core library and leads open source contributions.',
    avatar: '',
    socials: [{ platform: 'GitHub', handle: '@marcusj' }, { platform: 'Twitter', handle: '@marcusj' }],
    since: '2023',
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    role: 'Developer Advocate',
    bio: 'Community builder and technical writer. Creates tutorials, documentation, and speaks at conferences about accessible UI development.',
    avatar: '',
    socials: [{ platform: 'GitHub', handle: '@elenarod' }, { platform: 'Twitter', handle: '@elenarodriguez' }],
    since: '2024',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'Azimuth completely transformed how our team builds UIs. The accessibility defaults alone saved us months of work.',
    author: 'Sarah Mitchell',
    role: 'Engineering Director',
    company: 'TechCorp',
    avatar: '',
    rating: 5,
  },
  {
    id: 't2',
    quote: 'The theming system is incredible. We rebranded our entire application in a single afternoon just by changing a config file.',
    author: 'David Park',
    role: 'Lead Developer',
    company: 'StartupXYZ',
    avatar: '',
    rating: 5,
  },
  {
    id: 't3',
    quote: 'Finally, a component library that takes accessibility seriously without sacrificing developer experience or design quality.',
    author: 'Priya Sharma',
    role: 'Accessibility Engineer',
    company: 'Enterprise Inc',
    avatar: '',
    rating: 5,
  },
  {
    id: 't4',
    quote: 'We evaluated every major UI library. Azimuth was the only one that met all our requirements for customization, performance, and accessibility.',
    author: 'Tom Baker',
    role: 'VP of Engineering',
    company: 'ScaleUp',
    avatar: '',
    rating: 5,
  },
  {
    id: 't5',
    quote: 'The documentation is phenomenal. Our junior developers were productive with Azimuth within days.',
    author: 'Lisa Chen',
    role: 'Tech Lead',
    company: 'DevShop',
    avatar: '',
    rating: 4,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    question: 'Is Azimuth free to use?',
    answer: 'Azimuth Core is completely free and open source under the MIT license. Our Pro and Cloud tiers require a paid subscription for additional features, team collaboration, and priority support.',
  },
  {
    id: 'f2',
    question: 'What frameworks does Azimuth support?',
    answer: 'Azimuth is built with React and supports React 18 and 19. It works with Next.js, Vite, Remix, and any React-based framework. We also provide framework-specific documentation and examples.',
  },
  {
    id: 'f3',
    question: 'How does theming work?',
    answer: 'Azimuth uses a single ThemeProvider component that sets CSS custom properties on the document root. You can customize colors, spacing, border radius, typography, motion, and more. The system supports light, dark, and automatic mode detection.',
  },
  {
    id: 'f4',
    question: 'Is Azimuth accessible?',
    answer: 'Yes! Azimuth targets WCAG 2.2 AA compliance for all components. We provide proper ARIA attributes, keyboard navigation, focus management, screen reader support, and reduced motion preferences. Every component is tested for accessibility.',
  },
  {
    id: 'f5',
    question: 'Can I customize the components?',
    answer: 'Absolutely. Every component accepts className and style props for customization. The CSS custom properties system lets you theme globally, and you can override any component style using CSS Modules, Tailwind, or plain CSS.',
  },
  {
    id: 'f6',
    question: 'Do you offer enterprise support?',
    answer: 'Yes, we offer enterprise support plans with SLA guarantees, dedicated engineers, custom component development, and security reviews. Contact our sales team for more information.',
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual developers and small projects.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['60+ Core Components', 'CSS Custom Properties', 'WCAG 2.2 AA', 'MIT License', 'Community Support', 'Documentation'],
    highlighted: false,
    badge: 'Free',
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For teams building production applications at scale.',
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: ['Everything in Starter', '120+ Components', 'Figma Design Kit', 'Priority Support', 'Advanced Data Viz', 'Form Builder', 'Custom Themes'],
    highlighted: true,
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations requiring dedicated support and customization.',
    monthlyPrice: 299,
    yearlyPrice: 2990,
    features: ['Everything in Pro', 'Dedicated Engineer', 'Custom Components', 'SLA Guarantee', 'Security Audits', 'On-premise Option', 'Training Sessions'],
    highlighted: false,
  },
];

export const STATS: Stat[] = [
  { id: 's1', value: '60+', label: 'Components', icon: '⚡' },
  { id: 's2', value: '99.9%', label: 'Uptime', icon: '🔒' },
  { id: 's3', value: '12K+', label: 'GitHub Stars', icon: '⭐' },
  { id: 's4', value: '50K+', label: 'Downloads/mo', icon: '📦' },
  { id: 's5', value: 'WCAG 2.2', label: 'AA Compliant', icon: '♿' },
  { id: 's6', value: '100%', label: 'TypeScript', icon: '📘' },
];

export const CONTACT_REASONS = [
  { value: 'sales', label: 'Sales Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'press', label: 'Press' },
  { value: 'other', label: 'Other' },
];

export const SITEMAP_TREE = [
  {
    id: 'products-node',
    label: 'Products',
    children: [
      { id: 'azimuth-core-node', label: 'Azimuth Core' },
      { id: 'azimuth-pro-node', label: 'Azimuth Pro' },
      { id: 'azimuth-cloud-node', label: 'Azimuth Cloud' },
      { id: 'azimuth-ai-node', label: 'Azimuth AI' },
    ],
  },
  {
    id: 'company-node',
    label: 'Company',
    children: [
      { id: 'about-node', label: 'About Us' },
      { id: 'team-node', label: 'Team' },
      { id: 'careers-node', label: 'Careers' },
      { id: 'contact-node', label: 'Contact' },
    ],
  },
  {
    id: 'resources-node',
    label: 'Resources',
    children: [
      { id: 'docs-node', label: 'Documentation' },
      { id: 'api-node', label: 'API Reference' },
      { id: 'blog-node', label: 'Blog' },
      { id: 'community-node', label: 'Community' },
    ],
  },
  {
    id: 'legal-node',
    label: 'Legal',
    children: [
      { id: 'privacy-node', label: 'Privacy Policy' },
      { id: 'terms-node', label: 'Terms of Service' },
      { id: 'license-node', label: 'License' },
    ],
  },
];
