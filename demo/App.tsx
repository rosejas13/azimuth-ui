import '../src/styles/global.css';
import { useState, useCallback } from 'react';
import {
  Container,
  Grid,
  Stack,
  Divider,
  Button,
  Text,
  Input,
  Checkbox,
  Radio,
  Select,
  Toggle,
  Badge,
  Tag,
  Avatar,
  ProgressBar,
  Tooltip,
  Alert,
  Card,
  Modal,
  Drawer,
  SlideSheet,
  Breadcrumbs,
  Tabs,
  DropdownList,
  DataTable,
  Dialog,
  Menu,
  Navbar,
  SearchBar,
  Slider,
  Calendar,
  Carousel,
  Chip,
  CodeBlock,
  DateTimePicker,
  DateRangePicker,
  Form,
  List,
  SectionView,
  SegmentedButton,
  Table,
  TextArea,
  LoginSignup,
  ResizablePanel,
  TreeList,
  useToast,
  useThemeMode,
  Chat,
  FileUpload,
  type ChatMessage,
  InputGroup,
} from '../src';
import type { TreeNode } from '../src';
import {
  NAV_ITEMS,
  PRODUCTS,
  TEAM_MEMBERS,
  TESTIMONIALS,
  FAQ_ITEMS,
  PRICING_PLANS,
  STATS,
  CONTACT_REASONS,
  SITEMAP_TREE,
  type Product,
  type TeamMember,
} from './mock-data';
import logoSvg from './logo.svg';
import { ComponentsPage } from './ComponentsPage';

function PageNav({
  activePage,
  onPageChange,
}: {
  activePage: string;
  onPageChange: (key: string) => void;
}) {
  return (
    <Stack direction="horizontal" spacing="xs" align="center" wrap>
      {NAV_ITEMS.map((item) => (
        <Button
          key={item.key}
          variant={activePage === item.key ? 'primary' : 'tertiary'}
          size="sm"
          onClick={() => onPageChange(item.key)}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );
}

function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const label =
    mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';
  return (
    <Button variant="secondary" size="sm" onClick={toggle}>
      {label}
    </Button>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <Card style={{ textAlign: 'center' }}>
      <Text
        color="accent"
        style={{ marginBottom: 'var(--azimuth-space-xs)' }}
        size="h2"
      >
        {value}
      </Text>
      <Text color="secondary" size="xs">
        {label}
      </Text>
    </Card>
  );
}

function ProductCard({
  product,
  onDetails,
}: {
  product: Product;
  onDetails: (p: Product) => void;
}) {
  return (
    <Card
      header={
        <Stack direction="horizontal" justify="between" align="center">
          <Text weight="semibold">{product.name}</Text>
          <Badge variant={product.price === 0 ? 'success' : 'warning'}>
            {product.price === 0 ? 'Free' : `$${product.price}/mo`}
          </Badge>
        </Stack>
      }
      footer={
        <Stack direction="horizontal" spacing="sm">
          <Button size="sm" fullWidth onClick={() => onDetails(product)}>
            Details
          </Button>
          <Button size="sm" variant="secondary" fullWidth>
            Get Started
          </Button>
        </Stack>
      }
    >
      <Stack spacing="sm">
        <Text color="secondary" size="sm">
          {product.tagline}
        </Text>
        <Divider />
        <Stack direction="horizontal" spacing="xs" wrap>
          {product.badges.map((b) => (
            <Badge key={b.label} variant={b.variant}>
              {b.label}
            </Badge>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card>
      <Stack align="center" spacing="sm" style={{ textAlign: 'center' }}>
        <Avatar
          size="xl"
          fallback={member.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        />
        <div>
          <Text weight="semibold">{member.name}</Text>
          <Text color="accent" size="sm">
            {member.role}
          </Text>
        </div>
        <Text color="secondary" size="sm">
          {member.bio}
        </Text>
        <Stack direction="horizontal" spacing="sm" justify="center">
          {member.socials.map((s) => (
            <Chip
              key={s.platform}
              size="sm"
              variant="neutral"
              onClick={() => {}}
            >
              {s.platform}
            </Chip>
          ))}
        </Stack>
        <Text color="muted" size="xs">
          Since {member.since}
        </Text>
      </Stack>
    </Card>
  );
}

function PricingCard({
  plan,
  yearly,
}: {
  plan: (typeof PRICING_PLANS)[0];
  yearly: boolean;
}) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  return (
    <Card
      style={
        plan.highlighted
          ? {
              borderColor: 'var(--azimuth-accent)',
              borderWidth: '2px',
              transform: 'scale(1.02)',
            }
          : undefined
      }
      header={
        <Stack spacing="xs" align="center">
          {plan.badge && <Badge variant="accent">{plan.badge}</Badge>}
          <Text weight="bold" size="h3">
            {plan.name}
          </Text>
          <Text color="secondary" style={{ textAlign: 'center' }} size="sm">
            {plan.description}
          </Text>
          <Stack direction="horizontal" align="end" spacing="xs">
            <Text color="accent" size="h1">
              {price === 0 ? 'Free' : `$${price}`}
            </Text>
            {price > 0 && (
              <Text color="muted" size="sm">
                /{yearly ? 'yr' : 'mo'}
              </Text>
            )}
          </Stack>
        </Stack>
      }
      footer={
        <Button variant={plan.highlighted ? 'primary' : 'secondary'} fullWidth>
          {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
        </Button>
      }
    >
      <List spacing="sm">
        {plan.features.map((f) => (
          <List.Item key={f}>{f}</List.Item>
        ))}
      </List>
    </Card>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <Card>
      <Stack spacing="md">
        <Stack direction="horizontal" spacing="xs">
          {Array.from({ length: 5 }, (_, i) => (
            <Text key={i} color={i < t.rating ? 'accent' : 'muted'} size="sm">
              Star
            </Text>
          ))}
        </Stack>
        <Text
          style={{ fontStyle: 'italic', color: 'var(--azimuth-color-text)' }}
          size="sm"
        >
          "{t.quote}"
        </Text>
        <Divider />
        <Stack direction="horizontal" spacing="sm" align="center">
          <Avatar
            size="sm"
            fallback={t.author
              .split(' ')
              .map((n) => n[0])
              .join('')}
          />
          <div>
            <Text weight="semibold" size="sm">
              {t.author}
            </Text>
            <Text color="secondary" size="xs">
              {t.role}, {t.company}
            </Text>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}

function HomePage({
  onProductDetails,
}: {
  onProductDetails: (p: Product) => void;
}) {
  const featured = PRODUCTS.slice(0, 4);
  return (
    <div>
      <div
        style={{
          padding: 'var(--azimuth-space-4xl) 0 var(--azimuth-space-3xl)',
        }}
      >
        <Stack spacing="lg" align="center" style={{ textAlign: 'center' }}>
          <Badge variant="accent" style={{ fontSize: 'var(--azimuth-fs-sm)' }}>
            v0.2.0 -- Now in Public Beta
          </Badge>
          <Text style={{ maxWidth: '16ch' }} size="h1" variant="display">
            Build Accessible UIs at Scale
          </Text>
          <Text color="secondary" style={{ maxWidth: '60ch' }} size="lg">
            A configurable, accessible React component library. Theme-driven
            with a single ThemeProvider. WCAG 2.2 AA compliant, built with
            TypeScript and CSS Modules.
          </Text>
          <Stack direction="horizontal" spacing="md">
            <Button size="lg">Get Started Free</Button>
            <Button size="lg" variant="secondary">
              Watch Demo
            </Button>
          </Stack>
          <Stack
            direction="horizontal"
            spacing="lg"
            style={{ marginTop: 'var(--azimuth-space-lg)' }}
          >
            <Tooltip content="60+ production-ready components">
              <Stack direction="horizontal" spacing="xs" align="center">
                <Text color="accent" size="h4">
                  60+
                </Text>
                <Text color="secondary" size="sm">
                  Components
                </Text>
              </Stack>
            </Tooltip>
            <Divider orientation="vertical" />
            <Tooltip content="WCAG 2.2 AA compliant out of the box">
              <Stack direction="horizontal" spacing="xs" align="center">
                <Text color="accent" size="h4">
                  WCAG 2.2
                </Text>
                <Text color="secondary" size="sm">
                  AA Compliant
                </Text>
              </Stack>
            </Tooltip>
            <Divider orientation="vertical" />
            <Tooltip content="100% TypeScript with strict mode">
              <Stack direction="horizontal" spacing="xs" align="center">
                <Text color="accent" size="h4">
                  100%
                </Text>
                <Text color="secondary" size="sm">
                  TypeScript
                </Text>
              </Stack>
            </Tooltip>
          </Stack>
        </Stack>
      </div>

      <Divider />

      <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
        <Stack
          spacing="lg"
          align="center"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--azimuth-space-2xl)',
          }}
        >
          <Text size="h2">Trusted by teams worldwide</Text>
          <Text color="secondary" size="sm">
            Join thousands of developers building better UIs
          </Text>
        </Stack>
        <Grid cols={{ base: 2, md: 3, lg: 6 }} gap="md">
          {STATS.map((s) => (
            <StatCard key={s.id} value={s.value} label={s.label} />
          ))}
        </Grid>
      </div>

      <Divider />

      <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
        <Stack
          spacing="lg"
          align="center"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--azimuth-space-2xl)',
          }}
        >
          <Text size="h2">Featured Products</Text>
          <Text color="secondary" size="sm">
            Explore our component ecosystem
          </Text>
        </Stack>
        <Grid cols={{ base: 1, md: 2 }} gap="lg">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onDetails={onProductDetails} />
          ))}
        </Grid>
      </div>

      <Divider />

      <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
        <Stack
          spacing="lg"
          align="center"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--azimuth-space-2xl)',
          }}
        >
          <Text size="h2">What our customers say</Text>
          <Text color="secondary" size="sm">
            Real feedback from real teams
          </Text>
        </Stack>
        <Carousel
          autoplay={{ enabled: true, interval: 4000 }}
          showDots
          showArrows
          loop
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.id} style={{ padding: 'var(--azimuth-space-md)' }}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </Carousel>
      </div>

      <Divider />

      <div
        style={{ padding: 'var(--azimuth-space-3xl) 0', textAlign: 'center' }}
      >
        <Stack spacing="lg" align="center">
          <Text size="h2">Ready to get started?</Text>
          <Text color="secondary" style={{ maxWidth: '50ch' }} size="lg">
            Start building accessible, beautiful interfaces today. No credit
            card required.
          </Text>
          <Stack direction="horizontal" spacing="md">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="secondary">
              Read Docs
            </Button>
          </Stack>
        </Stack>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
      <Stack spacing="2xl">
        <div style={{ textAlign: 'center' }}>
          <Badge
            variant="info"
            style={{ marginBottom: 'var(--azimuth-space-md)' }}
          >
            Our Story
          </Badge>
          <Text
            style={{ marginBottom: 'var(--azimuth-space-md)' }}
            size="h1"
            variant="display"
          >
            Building the future of accessible UI
          </Text>
          <Text
            color="secondary"
            style={{ maxWidth: '60ch', margin: '0 auto' }}
            size="lg"
          >
            Azimuth was founded in 2023 with a simple mission: make
            professional, accessible UI development accessible to every team. We
            believe great design and accessibility should never be a trade-off.
          </Text>
        </div>

        <Divider />

        <div>
          <Text style={{ marginBottom: 'var(--azimuth-space-xl)' }} size="h2">
            Our Values
          </Text>
          <Grid cols={{ base: 1, md: 3 }} gap="lg">
            {[
              {
                title: 'Accessibility First',
                desc: 'Every component is built to WCAG 2.2 AA standards as a baseline, not an afterthought.',
              },
              {
                title: 'Developer Experience',
                desc: 'Clean APIs, comprehensive TypeScript types, and thorough documentation make development a joy.',
              },
              {
                title: 'Performance Matters',
                desc: 'Tree-shakeable exports, zero runtime overhead, and CSS Custom Properties for blazing fast rendering.',
              },
            ].map((v) => (
              <Card
                key={v.title}
                header={
                  <Stack direction="horizontal" spacing="sm" align="center">
                    <Text weight="semibold">{v.title}</Text>
                  </Stack>
                }
              >
                <Text color="secondary" size="sm">
                  {v.desc}
                </Text>
              </Card>
            ))}
          </Grid>
        </div>

        <Divider />

        <div>
          <Text style={{ marginBottom: 'var(--azimuth-space-xl)' }} size="h2">
            Our Timeline
          </Text>
          <ResizablePanel direction="vertical" minSize={60}>
            <div style={{ padding: 'var(--azimuth-space-md)' }}>
              <Stack spacing="sm">
                <Text weight="semibold" color="accent" size="sm">
                  2023 Q1 -- Inception
                </Text>
                <Text color="secondary" size="sm">
                  Project started as an internal tool at a Fortune 500 company.
                  The vision: a component library that does not sacrifice
                  accessibility for aesthetics.
                </Text>
                <Divider />
                <Text weight="semibold" color="accent" size="sm">
                  2023 Q3 -- Alpha Release
                </Text>
                <Text color="secondary" size="sm">
                  First public alpha with 30 core components. Over 1,000
                  developers joined the waitlist within the first week.
                </Text>
                <Divider />
                <Text weight="semibold" color="accent" size="sm">
                  2024 Q1 -- Beta Launch
                </Text>
                <Text color="secondary" size="sm">
                  Expanded to 50 components. Introduced the theming system with
                  OKLCH color space support.
                </Text>
                <Divider />
                <Text weight="semibold" color="accent" size="sm">
                  2024 Q3 -- v1.0 Release
                </Text>
                <Text color="secondary" size="sm">
                  Stable release with 60+ components, WCAG 2.2 AA certification,
                  and enterprise support.
                </Text>
              </Stack>
            </div>
            <div
              style={{
                padding: 'var(--azimuth-space-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Alert variant="info" title="Pro Tip: Resizable">
                Drag the divider to resize these panels. All Azimuth components
                support responsive layouts.
              </Alert>
            </div>
          </ResizablePanel>
        </div>

        <Divider />

        <div>
          <Text
            style={{
              marginBottom: 'var(--azimuth-space-xl)',
              textAlign: 'center',
            }}
            size="h2"
          >
            Meet the Team
          </Text>
          <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {TEAM_MEMBERS.map((m) => (
              <TeamCard key={m.id} member={m} />
            ))}
          </Grid>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Stack spacing="lg" align="center">
            <Text size="h3">Our Technology Stack</Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--azimuth-space-md)',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {[
                { n: 'React 19', v: 'info' },
                { n: 'TypeScript', v: 'accent' },
                { n: 'CSS Modules', v: 'success' },
                { n: 'tsup', v: 'neutral' },
                { n: 'Vitest', v: 'warning' },
                { n: 'Storybook', v: 'danger' },
              ].map((t) => (
                <Chip key={t.n} variant={t.v as any} onClick={() => {}}>
                  {t.n}
                </Chip>
              ))}
            </div>
            <Text color="secondary" size="sm">
              Built with modern tooling for modern teams
            </Text>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

function ProductsPage({
  onProductDetails,
}: {
  onProductDetails: (p: Product) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activeChips, setActiveChips] = useState<string[]>([]);

  const categories = ['all', ...new Set(PRODUCTS.map((p) => p.category))];
  const allTags = [
    ...new Set(PRODUCTS.flatMap((p) => p.badges.map((b) => b.label))),
  ];

  const filtered = PRODUCTS.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (
      activeChips.length > 0 &&
      !p.badges.some((b) => activeChips.includes(b.label))
    )
      return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.tagline.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  }).sort((a, b) =>
    sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : sortBy === 'users'
        ? b.activeUsers - a.activeUsers
        : b.rating - a.rating,
  );

  const quantity = filtered.length;

  return (
    <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
      <Stack spacing="xl">
        <div>
          <Badge
            variant="success"
            style={{ marginBottom: 'var(--azimuth-space-sm)' }}
          >
            {quantity} Products Available
          </Badge>
          <Text size="h1" variant="display">
            Products
          </Text>
          <Text color="secondary" size="lg">
            Explore the complete Azimuth ecosystem
          </Text>
        </div>

        <Stack spacing="md">
          <Grid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            <SearchBar
              placeholder="Search products..."
              onSearch={setSearch}
              clearable
            />
            <Select
              label="Category"
              size="sm"
              value={category}
              onChange={setCategory}
              options={categories.map((c) => ({
                value: c,
                label: c.charAt(0).toUpperCase() + c.slice(1),
              }))}
            />
            <DropdownList
              label="Sort By"
              data={{
                options: [
                  { value: 'name', label: 'Name' },
                  { value: 'users', label: 'Popularity' },
                  { value: 'rating', label: 'Rating' },
                ],
                placeholder: 'Sort...',
              }}
              selection={{
                value: sortBy,
                onChange: (v) => setSortBy(v as string),
              }}
            />
            <Input
              label="Max Price"
              type="number"
              size="sm"
              placeholder="Any"
            />
          </Grid>

          <div
            style={{
              display: 'flex',
              gap: 'var(--azimuth-space-sm)',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Text color="secondary" weight="semibold" size="xs">
              Filters:
            </Text>
            {allTags.map((tag) => (
              <Chip
                key={tag}
                size="sm"
                variant={activeChips.includes(tag) ? 'accent' : 'neutral'}
                selected={activeChips.includes(tag)}
                onClick={() =>
                  setActiveChips((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag],
                  )
                }
              >
                {tag}
              </Chip>
            ))}
            {activeChips.length > 0 && (
              <Button
                variant="tertiary"
                size="sm"
                onClick={() => setActiveChips([])}
              >
                Clear All
              </Button>
            )}
          </div>
        </Stack>

        <Tabs
          variant="pills"
          tabs={[
            {
              id: 'grid',
              label: 'Grid View',
              content: (
                <Grid cols={{ base: 1, md: 2, lg: 3 }} gap="lg">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onDetails={onProductDetails}
                    />
                  ))}
                </Grid>
              ),
            },
            {
              id: 'table',
              label: 'Table View',
              content: (
                <DataTable
                  title="Product Comparison"
                  data={{
                    columns: [
                      { key: 'name', title: 'Name', sortable: true },
                      { key: 'category', title: 'Category', sortable: true },
                      {
                        key: 'price',
                        title: 'Price',
                        sortable: true,
                        render: (v: any) => (v === 0 ? 'Free' : `$${v}/mo`),
                      },
                      { key: 'version', title: 'Version' },
                      {
                        key: 'rating',
                        title: 'Rating',
                        sortable: true,
                        render: (v: any) => `${v}/5`,
                      },
                      {
                        key: 'activeUsers',
                        title: 'Users',
                        sortable: true,
                        render: (v: any) => v.toLocaleString(),
                      },
                    ],
                    data: filtered as any,
                  }}
                  search={{
                    enabled: true,
                    columnSelector: true,
                    placeholder: 'Search table...',
                  }}
                  pagination={{ pageSize: 5, pageSizeOptions: [3, 5, 10] }}
                  actions={
                    <Button size="sm" variant="secondary">
                      Export CSV
                    </Button>
                  }
                  onRowClick={(row) => onProductDetails(row as any)}
                />
              ),
            },
          ]}
        />

        <Divider />

        <div>
          <Text style={{ marginBottom: 'var(--azimuth-space-md)' }} size="h3">
            API Integration
          </Text>
          <Text
            color="secondary"
            style={{ marginBottom: 'var(--azimuth-space-md)' }}
            size="sm"
          >
            Integrate Azimuth into your workflow with our REST API.
          </Text>
          <Tabs
            variant="buttons"
            tabs={[
              {
                id: 'js',
                label: 'JavaScript',
                content: (
                  <CodeBlock
                    language="javascript"
                    showLineNumbers
                    showCopyButton
                    highlight
                    code={`// Install Azimuth Core\nnpm install azimuth-ui\n\n// Import components\nimport { Button, ThemeProvider } from 'azimuth-ui';\nimport 'azimuth-ui/styles.css';\n\n// Use in your app\nfunction App() {\n  return (\n    <ThemeProvider>\n      <Button>Click me</Button>\n    </ThemeProvider>\n  );\n}`}
                    maxHeight="300px"
                  />
                ),
              },
              {
                id: 'tsx',
                label: 'TypeScript/React',
                content: (
                  <CodeBlock
                    language="tsx"
                    showLineNumbers
                    showCopyButton
                    highlight
                    code={`import { ThemeProvider, Button, type ThemeConfig } from 'azimuth-ui';\nimport 'azimuth-ui/styles.css';\n\nconst config: ThemeConfig = {\n  accentColor: '#6366f1',\n  borderRadius: 'lg',\n  mode: 'system',\n};\n\nexport function Root({ children }) {\n  return (\n    <ThemeProvider config={config}>\n      {children}\n    </ThemeProvider>\n  );\n}`}
                    maxHeight="300px"
                  />
                ),
              },
              {
                id: 'curl',
                label: 'REST API',
                content: (
                  <CodeBlock
                    language="bash"
                    showLineNumbers
                    showCopyButton
                    highlight
                    code={`# Get all components\ncurl https://api.azimuth.dev/v1/components \\\n  -H "Authorization: Bearer $AZIMUTH_TOKEN"\n\n# Get specific component\ncurl https://api.azimuth.dev/v1/components/button \\\n  -H "Authorization: Bearer $AZIMUTH_TOKEN"\n\n# Get component themes\ncurl https://api.azimuth.dev/v1/themes/ocean \\\n  -H "Authorization: Bearer $AZIMUTH_TOKEN"`}
                    maxHeight="300px"
                  />
                ),
              },
            ]}
          />
        </div>
      </Stack>
    </div>
  );
}

function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
      <Stack spacing="2xl" align="center">
        <div style={{ textAlign: 'center' }}>
          <Badge
            variant="info"
            style={{ marginBottom: 'var(--azimuth-space-md)' }}
          >
            Simple Pricing
          </Badge>
          <Text size="h1" variant="display">
            Plans for every team
          </Text>
          <Text
            color="secondary"
            style={{
              maxWidth: '50ch',
              margin: '0 auto var(--azimuth-space-lg)',
            }}
            size="lg"
          >
            Start free, upgrade as you grow. All plans include our core
            components and theming system.
          </Text>
          <SegmentedButton
            value={yearly ? 'yearly' : 'monthly'}
            onChange={(v) => setYearly(v === 'yearly')}
            options={[
              { value: 'monthly', label: 'Monthly' },
              {
                value: 'yearly',
                label: 'Yearly',
                icon: (
                  <Badge variant="success" size="xs">
                    Save 20%
                  </Badge>
                ),
              },
            ]}
          />
        </div>

        <Grid
          cols={{ base: 1, md: 2, lg: 3 }}
          gap="lg"
          style={{ width: '100%' }}
        >
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} yearly={yearly} />
          ))}
        </Grid>

        <Divider />

        <div style={{ width: '100%' }}>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 'var(--azimuth-space-xl)',
            }}
            size="h3"
          >
            Frequently Asked Questions
          </Text>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <Tabs
              variant="underline"
              tabs={[
                {
                  id: 'faq',
                  label: 'General',
                  content: (
                    <Stack spacing="sm">
                      {FAQ_ITEMS.map((item) => (
                        <SectionView key={item.id} title={item.question}>
                          <Text color="secondary" size="sm">
                            {item.answer}
                          </Text>
                        </SectionView>
                      ))}
                    </Stack>
                  ),
                },
                {
                  id: 'compare',
                  label: 'Plan Comparison',
                  content: (
                    <DataTable
                      title="Feature Comparison"
                      data={{
                        columns: [
                          { key: 'feature', title: 'Feature', sortable: true },
                          { key: 'starter', title: 'Starter', sortable: true },
                          { key: 'pro', title: 'Pro', sortable: true },
                          {
                            key: 'enterprise',
                            title: 'Enterprise',
                            sortable: true,
                          },
                        ],
                        data: [
                          {
                            feature: 'Components',
                            starter: '60+',
                            pro: '120+',
                            enterprise: 'Custom',
                          },
                          {
                            feature: 'Theming',
                            starter: 'Yes',
                            pro: 'Yes',
                            enterprise: 'Yes',
                          },
                          {
                            feature: 'Figma Kit',
                            starter: 'No',
                            pro: 'Yes',
                            enterprise: 'Yes',
                          },
                          {
                            feature: 'Priority Support',
                            starter: 'No',
                            pro: 'Yes',
                            enterprise: 'Dedicated',
                          },
                          {
                            feature: 'SLA Guarantee',
                            starter: 'No',
                            pro: 'No',
                            enterprise: 'Yes',
                          },
                          {
                            feature: 'Price',
                            starter: 'Free',
                            pro: '$49/mo',
                            enterprise: '$299/mo',
                          },
                        ],
                      }}
                      pagination={{ pageSize: 10 }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text style={{ marginBottom: 'var(--azimuth-space-md)' }} size="h4">
            Still have questions?
          </Text>
          <Stack direction="horizontal" spacing="md" justify="center">
            <Button variant="secondary" onClick={() => {}}>
              Email Us
            </Button>
            <Button variant="secondary" onClick={() => {}}>
              Live Chat
            </Button>
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

function ContactPage() {
  const { toast } = useToast();

  return (
    <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
      <Grid cols={{ base: 1, md: 2 }} gap="xl">
        <div>
          <Badge
            variant="accent"
            style={{ marginBottom: 'var(--azimuth-space-sm)' }}
          >
            Get in Touch
          </Badge>
          <Text
            style={{ marginBottom: 'var(--azimuth-space-md)' }}
            size="h1"
            variant="display"
          >
            Contact Us
          </Text>
          <Text
            color="secondary"
            style={{ marginBottom: 'var(--azimuth-space-xl)' }}
            size="lg"
          >
            Have a question, feedback, or want to partner with us? We would love
            to hear from you.
          </Text>

          <Card>
            <Form
              onSubmit={(_data) => {
                toast({
                  title: 'Message sent!',
                  message: 'We will get back to you within 24 hours.',
                  variant: 'success',
                });
              }}
            >
              <Stack spacing="md">
                <Grid cols={2} gap="md">
                  <Form.Field label="First Name" required>
                    <Input placeholder="Jane" />
                  </Form.Field>
                  <Form.Field label="Last Name" required>
                    <Input placeholder="Doe" />
                  </Form.Field>
                </Grid>
                <Form.Field label="Email" required>
                  <Input type="email" placeholder="jane@example.com" />
                </Form.Field>
                <Form.Field label="Company">
                  <Input placeholder="Acme Inc." />
                </Form.Field>
                <Form.Field label="Reason for Contact">
                  <Select
                    placeholder="Select a reason..."
                    options={CONTACT_REASONS}
                  />
                </Form.Field>
                <Form.Field label="Message" required>
                  <TextArea
                    placeholder="Tell us about your project..."
                    rows={4}
                  />
                </Form.Field>
                <Form.Field label="Attachments">
                  <FileUpload
                    accept="image/*,.pdf,.doc,.docx"
                    maxSize={10}
                    onFilesSelected={(files) => {
                      toast({
                        title: `${files.length} file(s) selected`,
                        variant: 'info',
                      });
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox label="Subscribe to our newsletter" />
                </Form.Field>
                <Stack direction="horizontal" justify="end">
                  <Button type="submit">Send Message</Button>
                </Stack>
              </Stack>
            </Form>
          </Card>
        </div>

        <div>
          <Card header={<Text weight="semibold">Partner Portal</Text>}>
            <LoginSignup
              defaultView="login"
              auth={{
                onLogin: (data) => {
                  toast({
                    title: 'Welcome back!',
                    message: `Logged in as ${data.email}`,
                    variant: 'success',
                  });
                },
                onSignup: (_data) => {
                  toast({
                    title: 'Account created!',
                    message: 'Check your email to verify.',
                    variant: 'success',
                  });
                },
                onResetPassword: (data) => {
                  toast({
                    title: 'Reset link sent',
                    message: `Check ${data.email} for instructions.`,
                    variant: 'info',
                  });
                },
              }}
              social={{
                providers: [
                  { id: 'github', label: 'GitHub' },
                  { id: 'google', label: 'Google' },
                ],
                onProviderAuth: (id) => {
                  toast({ title: `Connecting to ${id}...`, variant: 'info' });
                },
              }}
            />
          </Card>

          <div style={{ marginTop: 'var(--azimuth-space-xl)' }}>
            <Card header={<Text weight="semibold">Office Hours</Text>}>
              <Calendar
                onChange={(_d) => {}}
                showWeekNumbers
                aria-label="Office hours calendar"
              />
            </Card>
          </div>

          <div style={{ marginTop: 'var(--azimuth-space-xl)' }}>
            <Card header={<Text weight="semibold">Schedule a Meeting</Text>}>
              <Stack spacing="md">
                <DateTimePicker
                  onChange={(_d) => {}}
                  showTime
                  showSeconds={false}
                  minuteStep={15}
                  aria-label="Schedule a meeting date"
                />
                <DateRangePicker
                  label="Availability Window"
                  onChange={(_range) => {}}
                />
              </Stack>
            </Card>
          </div>
        </div>
      </Grid>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Stack spacing="xl">
          <div>
            <Badge
              variant="neutral"
              style={{ marginBottom: 'var(--azimuth-space-sm)' }}
            >
              Last updated: May 2026
            </Badge>
            <Text size="h1" variant="display">
              Privacy Policy
            </Text>
            <Text color="secondary" size="lg">
              How we handle your data at Azimuth
            </Text>
          </div>

          <Alert variant="info" title="Our Commitment">
            We take your privacy seriously. This policy describes how we
            collect, use, and protect your personal information.
          </Alert>

          <Breadcrumbs
            items={[
              { label: 'Home', href: '#' },
              { label: 'Legal', href: '#' },
              { label: 'Privacy Policy' },
            ]}
          />

          <Tabs
            variant="underline"
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                content: (
                  <Stack spacing="md">
                    <Text size="h3">Information We Collect</Text>
                    <List bulleted>
                      <List.Item>
                        Account information (name, email, company)
                      </List.Item>
                      <List.Item>
                        Usage data (components used, features accessed)
                      </List.Item>
                      <List.Item>
                        Payment information (processed securely by Stripe)
                      </List.Item>
                      <List.Item>Communication preferences</List.Item>
                    </List>
                    <Divider />
                    <Text size="h3">How We Use Your Data</Text>
                    <List bulleted>
                      <List.Item>To provide and improve our services</List.Item>
                      <List.Item>
                        To send product updates and security notices
                      </List.Item>
                      <List.Item>
                        To analyze usage patterns and optimize performance
                      </List.Item>
                      <List.Item>To provide customer support</List.Item>
                    </List>
                  </Stack>
                ),
              },
              {
                id: 'details',
                label: 'Details',
                content: (
                  <Stack spacing="md">
                    <SectionView title="Data Collection">
                      <Text color="secondary" size="sm">
                        We collect information you provide directly, such as
                        when you create an account, subscribe to our newsletter,
                        or contact support. We also automatically collect
                        certain technical information, including IP address,
                        browser type, and usage patterns.
                      </Text>
                    </SectionView>
                    <SectionView title="Data Sharing">
                      <Text color="secondary" size="sm">
                        We never sell your personal data. We may share
                        anonymized, aggregate data with partners for analytics
                        purposes. Service providers (hosting, payment
                        processing) have access to necessary data under strict
                        confidentiality agreements.
                      </Text>
                    </SectionView>
                    <SectionView title="Your Rights">
                      <Text color="secondary" size="sm">
                        You have the right to access, correct, or delete your
                        personal data. You can export your data at any time from
                        your account settings. Contact our privacy team at
                        privacy@azimuth.dev for assistance.
                      </Text>
                    </SectionView>
                    <SectionView title="Security Measures">
                      <Text color="secondary" size="sm">
                        We implement industry-standard security measures
                        including encryption at rest and in transit, regular
                        security audits, and strict access controls. Our
                        infrastructure is SOC 2 compliant.
                      </Text>
                    </SectionView>
                    <SectionView title="Cookies">
                      <Text color="secondary" size="sm">
                        We use essential cookies for authentication and
                        security. Analytics cookies help us improve our service.
                        You can manage cookie preferences in your browser
                        settings.
                      </Text>
                    </SectionView>
                  </Stack>
                ),
              },
              {
                id: 'contact-privacy',
                label: 'Contact',
                content: (
                  <Card>
                    <Stack spacing="md">
                      <Text weight="semibold">Privacy Team</Text>
                      <Text color="secondary" size="sm">
                        For privacy-related inquiries, contact our Data
                        Protection Officer:
                      </Text>
                      <List>
                        <List.Item>Email: privacy@azimuth.dev</List.Item>
                        <List.Item>Phone: +1 (555) 123-4567</List.Item>
                        <List.Item>
                          Address: 123 UI Street, San Francisco, CA 94105
                        </List.Item>
                      </List>
                      <Divider />
                      <Text color="secondary" size="sm">
                        We respond to all privacy inquiries within 48 hours.
                      </Text>
                    </Stack>
                  </Card>
                ),
              },
            ]}
          />

          <Divider />

          <Card
            expandable
            header={<Text weight="semibold">Version History</Text>}
          >
            <Table striped size="sm">
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>Version</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Changes</Table.HeadCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>2.0</Table.Cell>
                  <Table.Cell>May 2026</Table.Cell>
                  <Table.Cell>Updated data processing disclosures</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>1.1</Table.Cell>
                  <Table.Cell>Jan 2026</Table.Cell>
                  <Table.Cell>Added AI training opt-out</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>1.0</Table.Cell>
                  <Table.Cell>Aug 2025</Table.Cell>
                  <Table.Cell>Initial privacy policy</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card>
        </Stack>
      </div>
    </div>
  );
}

export function App() {
  const [activePage, setActivePage] = useState('home');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogVariant, setDialogVariant] = useState<
    'info' | 'warning' | 'danger'
  >('info');
  const [alertsVisible, setAlertsVisible] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! How can we help you today?',
      sender: 'other',
      timestamp: new Date(),
    },
  ]);

  const { toast } = useToast();

  const showRandomToast = useCallback(() => {
    const variants = ['success', 'error', 'warning', 'info'] as const;
    const v = variants[Math.floor(Math.random() * variants.length)];
    toast({
      title: `${v.charAt(0).toUpperCase() + v.slice(1)} notification`,
      message: 'This is a demo toast from Azimuth.',
      variant: v,
      duration: 4000,
    });
  }, [toast]);

  const handleProductDetails = useCallback((product: Product) => {
    setModalProduct(product);
  }, []);

  const NAVBAR_ITEMS = NAV_ITEMS.filter((item) =>
    ['home', 'components', 'pricing', 'contact'].includes(item.key),
  ).map((item) => ({
    key: item.key,
    label: item.label,
    href: '#',
    onClick: () => setActivePage(item.key),
  }));

  const pageTitle: Record<string, string> = {
    home: 'Home',
    components: 'Components',
    about: 'About',
    products: 'Products',
    pricing: 'Pricing',
    contact: 'Contact',
    privacy: 'Privacy',
  };

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Navbar
        branding={{
          logo: (
            <Stack direction="horizontal" spacing="sm" align="center">
              <img
                src={logoSvg}
                alt="Azimuth"
                style={{ height: 28, width: 'auto' }}
              />
              <Text weight="bold" size="lg">
                Azimuth
              </Text>
            </Stack>
          ),
        }}
        nav={{ items: NAVBAR_ITEMS, activeKey: activePage }}
        actions={
          <Stack direction="horizontal" spacing="sm" align="center">
            <Menu
              side="left"
              items={[
                { key: 'toast', label: 'Test Toast' },
                { key: 'drawer', label: 'Open Drawer' },
                { key: 'sheet', label: 'Open Sheet' },
                { key: 'dialog', label: 'Show Dialog' },
              ]}
              onSelect={(key) => {
                if (key === 'toast') showRandomToast();
                if (key === 'drawer') setDrawerOpen(true);
                if (key === 'sheet') setSheetOpen(true);
                if (key === 'dialog') {
                  setDialogVariant('warning');
                  setDialogOpen(true);
                }
              }}
            />
            <ThemeToggle />
          </Stack>
        }
      />

      <Container style={{ flex: 1 }}>
        <div style={{ padding: 'var(--azimuth-space-md) 0' }}>
          <Stack direction="horizontal" justify="between" align="center" wrap>
            <PageNav activePage={activePage} onPageChange={setActivePage} />
            <Breadcrumbs
              items={[
                { label: 'Azimuth' },
                { label: pageTitle[activePage] || 'Home' },
              ]}
            />
          </Stack>
        </div>

        <Divider />

        {alertsVisible && (
          <div style={{ marginBottom: 'var(--azimuth-space-md)' }}>
            <Alert
              variant="notification"
              title="Welcome to the Azimuth Demo"
              dismissible
              onDismiss={() => setAlertsVisible(false)}
            >
              <Text size="sm">
                This page showcases all Azimuth components in a realistic
                business context. Try the theme toggle, interactive elements,
                and explore each page.
              </Text>
            </Alert>
          </div>
        )}

        {activePage === 'home' && (
          <HomePage onProductDetails={handleProductDetails} />
        )}
        {activePage === 'components' && <ComponentsPage />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'products' && (
          <ProductsPage onProductDetails={handleProductDetails} />
        )}
        {activePage === 'pricing' && <PricingPage />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'privacy' && <PrivacyPage />}

        {activePage === 'home' && <Divider />}

        {activePage === 'home' && (
          <div style={{ padding: 'var(--azimuth-space-3xl) 0' }}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 'var(--azimuth-space-xl)',
              }}
              size="h3"
            >
              Performance and Status
            </Text>
            <Grid cols={2} gap="lg">
              <Card
                header={
                  <Stack direction="horizontal" justify="between">
                    <Text weight="semibold">Component Usage</Text>
                    <Badge variant="success">Healthy</Badge>
                  </Stack>
                }
              >
                <Stack spacing="md">
                  <Stack spacing="xs">
                    <Stack direction="horizontal" justify="between">
                      <Text size="sm">Bundle Size</Text>
                      <Text weight="semibold" size="sm">
                        12.4 kB
                      </Text>
                    </Stack>
                    <ProgressBar
                      value={12}
                      max={100}
                      color="accent"
                      size="sm"
                    />
                  </Stack>
                  <Stack spacing="xs">
                    <Stack direction="horizontal" justify="between">
                      <Text size="sm">TypeScript Coverage</Text>
                      <Text weight="semibold" size="sm">
                        100%
                      </Text>
                    </Stack>
                    <ProgressBar value={100} color="success" size="sm" />
                  </Stack>
                  <Stack spacing="xs">
                    <Stack direction="horizontal" justify="between">
                      <Text size="sm">Test Coverage</Text>
                      <Text weight="semibold" size="sm">
                        87%
                      </Text>
                    </Stack>
                    <ProgressBar value={87} color="primary" size="sm" />
                  </Stack>
                </Stack>
              </Card>
              <Card header={<Text weight="semibold">Demo Information</Text>}>
                <Stack spacing="md">
                  <div>
                    <Text color="muted" size="xs">
                      Active Page
                    </Text>
                    <Text weight="semibold" size="sm">
                      {pageTitle[activePage]}
                    </Text>
                  </div>
                  <div>
                    <Text color="muted" size="xs">
                      Components Used
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                        marginTop: 'var(--azimuth-space-xs)',
                      }}
                    >
                      {[
                        'Navbar',
                        'Button',
                        'Card',
                        'Grid',
                        'Tabs',
                        'DataTable',
                        'Carousel',
                        'Modal',
                        'Drawer',
                        'Dialog',
                        'Toast',
                        'Form',
                        'Calendar',
                        'LoginSignup',
                        'ResizablePanel',
                        'TreeList',
                        'FanMenu',
                        'Flyout',
                        'Slider',
                        'CodeBlock',
                        'SearchBar',
                        'Pagination',
                        'Avatar',
                        'Badge',
                        'Chip',
                        'Alert',
                        'ProgressBar',
                      ].map((c) => (
                        <Tag
                          key={c}
                          variant="neutral"
                          removable
                          onRemove={() => {}}
                        >
                          {c}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Stack>
              </Card>
            </Grid>
          </div>
        )}
      </Container>

      <Divider />

      <footer
        style={{
          padding: 'var(--azimuth-space-3xl) 0 var(--azimuth-space-xl)',
          fontSize: 'var(--azimuth-fs-sm)',
          color: 'var(--azimuth-color-text-muted)',
        }}
      >
        <Container>
          <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap="xl">
            <div>
              <Stack
                direction="horizontal"
                spacing="sm"
                align="center"
                style={{ marginBottom: 'var(--azimuth-space-md)' }}
              >
                <img
                  src={logoSvg}
                  alt="Azimuth"
                  style={{ height: 24, width: 'auto' }}
                />
                <Text weight="bold">Azimuth</Text>
              </Stack>
              <Text
                color="secondary"
                style={{ marginBottom: 'var(--azimuth-space-md)' }}
                size="sm"
              >
                Building accessible, beautiful UIs for every team.
              </Text>
              <Stack direction="horizontal" spacing="sm">
                <Button variant="tertiary" size="sm">
                  GitHub
                </Button>
                <Button variant="tertiary" size="sm">
                  Twitter
                </Button>
                <Button variant="tertiary" size="sm">
                  LinkedIn
                </Button>
              </Stack>
            </div>
            <div>
              <Text
                weight="semibold"
                style={{ marginBottom: 'var(--azimuth-space-sm)' }}
                size="sm"
              >
                Sitemap
              </Text>
              <TreeList
                data={SITEMAP_TREE as unknown as TreeNode[]}
                showLines
                defaultExpanded={[
                  'products-node',
                  'company-node',
                  'resources-node',
                  'legal-node',
                ]}
                onSelect={(node) => {
                  const pageMap: Record<string, string> = {
                    'about-node': 'about',
                    'contact-node': 'contact',
                    'privacy-node': 'privacy',
                    'products-node': 'products',
                  };
                  if (pageMap[node.id]) setActivePage(pageMap[node.id]);
                }}
              />
            </div>
            <div>
              <Text
                weight="semibold"
                style={{ marginBottom: 'var(--azimuth-space-sm)' }}
                size="sm"
              >
                Latest Updates
              </Text>
              <Stack spacing="sm">
                <Text color="muted" size="xs">
                  May 2026
                </Text>
                <Text size="sm">v0.2.0 released with 10 new components</Text>
                <Text color="muted" size="xs">
                  Apr 2026
                </Text>
                <Text size="sm">WCAG 2.2 AA certification completed</Text>
                <Text color="muted" size="xs">
                  Mar 2026
                </Text>
                <Text size="sm">10,000 GitHub stars</Text>
              </Stack>
            </div>
            <div>
              <Text
                weight="semibold"
                style={{ marginBottom: 'var(--azimuth-space-sm)' }}
                size="sm"
              >
                Newsletter
              </Text>
              <Text
                color="secondary"
                style={{ marginBottom: 'var(--azimuth-space-md)' }}
                size="xs"
              >
                Get product updates and accessibility tips monthly.
              </Text>
              <InputGroup>
                <Input
                  placeholder="your@email.com"
                  size="sm"
                  aria-label="Email address"
                />
                <Button size="sm">Subscribe</Button>
              </InputGroup>
              <div style={{ marginTop: 'var(--azimuth-space-md)' }}>
                <Slider
                  defaultValue={75}
                  display={{ showValue: true, size: 'sm' }}
                  aria-label="Satisfaction level"
                />
                <Text
                  color="muted"
                  style={{ marginTop: 'var(--azimuth-space-xs)' }}
                  size="xs"
                >
                  Satisfaction level: 75%
                </Text>
              </div>
            </div>
          </Grid>
          <Divider style={{ margin: 'var(--azimuth-space-xl) 0' }} />
          <Stack direction="horizontal" justify="between" align="center" wrap>
            <Text color="muted" size="xs">
              &copy; 2026 Azimuth UI. Built with TypeScript, React 19, and CSS
              Modules.
            </Text>
            <Stack direction="horizontal" spacing="sm">
              <Menu
                side="right"
                items={[
                  { key: 'privacy', label: 'Privacy Policy' },
                  { key: 'terms', label: 'Terms of Service' },
                  { key: 'sep', label: '', separator: true },
                  { key: 'contact', label: 'Contact Us' },
                ]}
                onSelect={(key) =>
                  setActivePage(
                    key === 'privacy'
                      ? 'privacy'
                      : key === 'contact'
                        ? 'contact'
                        : activePage,
                  )
                }
              />
            </Stack>
          </Stack>
        </Container>
      </footer>

      <Modal
        visible={{ open: !!modalProduct, onClose: () => setModalProduct(null) }}
        content={{
          title: modalProduct?.name || '',
          subtitle: modalProduct?.tagline,
          size: 'lg',
        }}
        footer={
          <Stack direction="horizontal" justify="between" align="center">
            <Stack direction="horizontal" spacing="xs">
              <Text color="muted" size="xs">
                Version {modalProduct?.version}
              </Text>
              <Divider orientation="vertical" />
              <Tooltip
                content={`${modalProduct?.activeUsers.toLocaleString()} active users`}
              >
                <Text color="muted" size="xs">
                  {modalProduct?.activeUsers.toLocaleString()} users
                </Text>
              </Tooltip>
            </Stack>
            <Stack direction="horizontal" spacing="sm">
              <Button variant="secondary" onClick={() => setModalProduct(null)}>
                Close
              </Button>
              <Button>Get Started</Button>
            </Stack>
          </Stack>
        }
      >
        {modalProduct && (
          <Stack spacing="lg">
            <Grid cols={2} gap="md">
              <Card
                header={
                  <Text weight="semibold" size="sm">
                    Product Details
                  </Text>
                }
              >
                <Stack spacing="sm">
                  <div>
                    <Text color="muted" size="xs">
                      Price
                    </Text>
                    <Text weight="bold" size="h3">
                      {modalProduct.price === 0
                        ? 'Free'
                        : `$${modalProduct.price}/mo`}
                    </Text>
                  </div>
                  <div>
                    <Text color="muted" size="xs">
                      Category
                    </Text>
                    <Chip variant="accent" size="sm" onClick={() => {}}>
                      {modalProduct.category}
                    </Chip>
                  </div>
                  <div>
                    <Text color="muted" size="xs">
                      Rating
                    </Text>
                    <Text size="sm">{modalProduct.rating}/5</Text>
                  </div>
                </Stack>
              </Card>
              <Card
                header={
                  <Text weight="semibold" size="sm">
                    Key Features
                  </Text>
                }
              >
                <List bulleted>
                  {modalProduct.features.map((f) => (
                    <List.Item key={f}>{f}</List.Item>
                  ))}
                </List>
              </Card>
            </Grid>
            <Text color="secondary" size="sm">
              {modalProduct.description}
            </Text>
            <Stack direction="horizontal" spacing="xs" wrap>
              {modalProduct.badges.map((b) => (
                <Badge key={b.label} variant={b.variant}>
                  {b.label}
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}
      </Modal>

      <Drawer
        visible={{ open: drawerOpen, onClose: () => setDrawerOpen(false) }}
        config={{
          side: 'right',
          title: 'Notifications and Settings',
          size: 'sm',
        }}
        footer={
          <Stack direction="horizontal" spacing="sm">
            <Button
              variant="secondary"
              onClick={() => setDrawerOpen(false)}
              fullWidth
            >
              Close
            </Button>
            <Button
              onClick={() => {
                showRandomToast();
              }}
              fullWidth
            >
              Test Toast
            </Button>
          </Stack>
        }
      >
        <Stack spacing="md">
          <Text weight="semibold" size="sm">
            Notification Preferences
          </Text>
          <Toggle label="Push Notifications" defaultChecked />
          <Toggle label="Email Digest" defaultChecked />
          <Toggle label="Weekly Reports" />
          <Divider />
          <Text weight="semibold" size="sm">
            Display Settings
          </Text>
          <Select
            label="Font Size"
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Radio name="layout" label="Compact" />
          <Radio name="layout" label="Comfortable" defaultChecked />
          <Divider />
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={() => {
              setDialogVariant('danger');
              setDialogOpen(true);
            }}
          >
            Reset All Settings
          </Button>
        </Stack>
      </Drawer>

      <SlideSheet
        visible={{ open: sheetOpen, onClose: () => setSheetOpen(false) }}
        config={{
          side: 'bottom',
          title: 'Quick Help',
          height: '40vh',
          snapPoints: ['25vh', '40vh', '70vh'],
        }}
      >
        <Stack spacing="md">
          <Alert variant="info" title="Need help?" dismissible>
            Browse our documentation or contact support.
          </Alert>
          <SearchBar
            placeholder="Search help articles..."
            onSearch={() => {}}
            clearable
          />
          <Grid cols={2} gap="md">
            <Card
              header={
                <Text weight="semibold" size="sm">
                  Getting Started
                </Text>
              }
              footer={
                <Button size="sm" variant="tertiary">
                  Read
                </Button>
              }
            >
              <Text color="secondary" size="xs">
                Learn how to install and configure Azimuth in your project.
              </Text>
            </Card>
            <Card
              header={
                <Text weight="semibold" size="sm">
                  API Reference
                </Text>
              }
              footer={
                <Button size="sm" variant="tertiary">
                  Read
                </Button>
              }
            >
              <Text color="secondary" size="xs">
                Complete API documentation for all components and hooks.
              </Text>
            </Card>
          </Grid>
        </Stack>
      </SlideSheet>

      <Dialog
        visible={{ open: dialogOpen, onClose: () => setDialogOpen(false) }}
        content={{
          title:
            dialogVariant === 'danger'
              ? 'Reset Settings?'
              : dialogVariant === 'warning'
                ? 'Are you sure?'
                : 'Information',
          description:
            dialogVariant === 'danger'
              ? 'This will reset all your preferences to default values. This action cannot be undone.'
              : dialogVariant === 'warning'
                ? 'Please confirm this action before proceeding.'
                : 'This is an informational dialog demonstrating the Dialog component.',
          variant: dialogVariant,
        }}
        actions={{
          confirm: {
            label: 'Confirm',
            onConfirm: () => {
              toast({ title: 'Action confirmed!', variant: 'success' });
              setDialogOpen(false);
            },
          },
          cancel: {
            label: 'Cancel',
            onCancel: () => {
              toast({
                title: 'Action cancelled.',
                variant: 'info',
                duration: 2000,
              });
              setDialogOpen(false);
            },
          },
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 'var(--azimuth-space-lg)',
          right: 'var(--azimuth-space-lg)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 'var(--azimuth-space-sm)',
        }}
      >
        {chatOpen && !chatMinimized && (
          <div
            style={{
              width: '320px',
              height: '420px',
              boxShadow: 'var(--azimuth-shadow-lg)',
              borderRadius: 'var(--azimuth-radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--azimuth-color-surface)',
              border: '1px solid var(--azimuth-color-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--azimuth-space-sm) var(--azimuth-space-md)',
                borderBottom: '1px solid var(--azimuth-color-border)',
              }}
            >
              <Text weight="semibold" size="sm">
                Chat Support
              </Text>
              <Stack direction="horizontal" spacing="xs">
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setChatMinimized(true)}
                >
                  _
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setChatOpen(false)}
                >
                  X
                </Button>
              </Stack>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <Chat
                messages={chatMessages}
                onSend={(text) => {
                  const userMsg: ChatMessage = {
                    id: Date.now().toString(),
                    text,
                    sender: 'user',
                    timestamp: new Date(),
                  };
                  const reply: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    text: 'Thanks for your message! Our team will get back to you shortly.',
                    sender: 'other',
                    timestamp: new Date(),
                  };
                  setChatMessages((prev) => [...prev, userMsg, reply]);
                }}
                placeholder="Type a message..."
              />
            </div>
          </div>
        )}
        {chatMinimized && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setChatMinimized(false)}
          >
            Chat Support
          </Button>
        )}
        <Button
          size="lg"
          shape="circle"
          onClick={() => {
            setChatOpen(true);
            setChatMinimized(false);
          }}
          aria-label="Open chat support"
        >
          ?
        </Button>
      </div>
    </div>
  );
}
