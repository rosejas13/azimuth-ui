import '../src/styles/global.css';
import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  Container, Grid, Stack, Divider,
  Button, Text, Icon, Input, Checkbox, Radio, Select, Toggle,
  Badge, Tag, Avatar, Loader, ProgressBar, Tooltip,
  Alert, Toast, Card, Modal, Drawer, SlideSheet,
  Breadcrumbs, Pagination, Tabs, DropdownList,
  DataTable, Dialog, Menu, Navbar, SearchBar, Slider,
  Calendar, Carousel, Chip, CodeBlock, DateTimePicker, DateRangePicker,
  EmptyState, Form, InputGroup, Kbd, List, PageLayout, SectionView,
  SegmentedButton, Skeleton, Table, TextArea, TextBox,
} from '../src';

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginBottom: 'var(--azimuth-space-3xl)' }}>
      <Text size="h2" style={{ marginBottom: 'var(--azimuth-space-lg)' }}>{title}</Text>
      {children}
    </div>
  );
}

function DemoBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 'var(--azimuth-space-md)', border: '1px dashed var(--azimuth-color-border)', borderRadius: 'var(--azimuth-radius-md)', marginBottom: 'var(--azimuth-space-md)' }}>
      <Text size="xs" color="muted" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>{label}</Text>
      <Stack direction="horizontal" spacing="sm" align="center" wrap>
        {children}
      </Stack>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <Button variant="secondary" size="sm" onClick={toggle}>
      {dark ? '☀ Light' : '☾ Dark'}
    </Button>
  );
}

export function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState('t1');
  const [alertVisible, setAlertVisible] = useState(true);
  const [toastVisible, setToastVisible] = useState(true);

  const NAV_ITEMS = [
    { key: 'buttons', label: 'Buttons', href: '#buttons' },
    { key: 'forms', label: 'Forms', href: '#forms' },
    { key: 'cards', label: 'Cards', href: '#cards' },
    { key: 'overlays', label: 'Overlays', href: '#overlays' },
  ];

  const BREADCRUMB_ITEMS = [
    { label: 'Home', href: '#' },
    { label: 'Components', href: '#' },
    { label: 'Button', href: '#' },
  ];

  const TABLE_DATA = [
    { name: 'React', type: 'Library', version: '19.0', status: 'Active' },
    { name: 'TypeScript', type: 'Language', version: '5.6', status: 'Active' },
    { name: 'Vitest', type: 'Testing', version: '2.1', status: 'Active' },
    { name: 'ESLint', type: 'Linting', version: '9.0', status: 'Active' },
    { name: 'Prettier', type: 'Formatting', version: '3.8', status: 'Active' },
  ];

  return (
    <div>
      <Navbar logo="Azimuth" items={NAV_ITEMS} actions={
        <Stack direction="horizontal" spacing="sm">
          <ThemeToggle />
        </Stack>
      } />

      <Container>
        <div style={{ padding: 'var(--azimuth-space-4xl) 0' }}>
          <Text size="h1" variant="display" style={{ marginBottom: 'var(--azimuth-space-md)' }}>
            Azimuth Component Library
          </Text>
          <Text size="lg" color="secondary" style={{ marginBottom: 'var(--azimuth-space-2xl)', maxWidth: '60ch' }}>
            A configurable, accessible React component library. Theme-driven with a single ThemeProvider.
            Built with TypeScript, CSS Modules, and WCAG 2.2 AA.
          </Text>

          {/* ===== BUTTONS ===== */}
          <Section id="buttons" title="Buttons">
            <DemoBox label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="link">Link</Button>
              <Button variant="danger">Danger</Button>
            </DemoBox>
            <DemoBox label="Sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </DemoBox>
            <DemoBox label="With Icons">
              <Button icon={<span>+</span>}>Add Item</Button>
              <Button icon={<span>→</span>} iconPosition="right">Next</Button>
              <Button icon={<span>X</span>} variant="secondary" aria-label="Close" />
            </DemoBox>
          </Section>

          <Divider />

          {/* ===== TYPOGRAPHY ===== */}
          <Section title="Typography">
            <Text size="h1">H1 Heading</Text>
            <Text size="h2">H2 Heading</Text>
            <Text size="h3">H3 Heading</Text>
            <Text size="h4">H4 Heading</Text>
            <Text size="h5">H5 Heading</Text>
            <Text size="base">Body text. The quick brown fox jumps over the lazy dog.</Text>
            <Text size="sm" color="secondary">Secondary small text</Text>
            <Text size="xs" color="muted">Muted extra-small text</Text>
          </Section>

          <Divider />

          {/* ===== FORM ELEMENTS ===== */}
          <Section id="forms" title="Form Elements">
            <Grid cols={2} gap="lg">
              <Input label="Email" type="email" placeholder="you@example.com" subtitle="We'll never share your email." />
              <Input label="Password" type="password" placeholder="••••••••" />
              <Input label="Number" type="number" showSteppers min={0} max={100} defaultValue={50} />
              <Input label="Username" error="Username is taken" />
            </Grid>
            <div style={{ marginTop: 'var(--azimuth-space-xl)' }}>
              <Grid cols={4} gap="md">
                <Select label="Country" placeholder="Select..." options={[{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }, { value: 'mx', label: 'Mexico' }]} />
                <DropdownList label="Framework" placeholder="Choose..." options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }]} />
                <div />
                <div />
              </Grid>
            </div>
            <Stack spacing="md" style={{ marginTop: 'var(--azimuth-space-xl)' }}>
              <Checkbox label="Accept terms and conditions" />
              <Stack direction="horizontal" spacing="lg">
                <Radio name="theme" label="Light" defaultChecked />
                <Radio name="theme" label="Dark" />
                <Radio name="theme" label="System" />
              </Stack>
              <Toggle label="Enable notifications" defaultChecked />
            </Stack>
          </Section>

          <Divider />

          {/* ===== ALERTS & TOASTS ===== */}
          <Section title="Alerts & Toasts">
            {alertVisible && (
              <Alert variant="success" title="Success!" dismissible onDismiss={() => setAlertVisible(false)}>
                Your changes have been saved successfully.
              </Alert>
            )}
            <Alert variant="warning" title="Warning" style={{ marginTop: 'var(--azimuth-space-md)' }}>
              Your session will expire in 5 minutes.
            </Alert>
            <Alert variant="alert" title="Error" style={{ marginTop: 'var(--azimuth-space-md)' }}>
              Failed to save changes. Please try again.
            </Alert>
            <Alert variant="info" title="Information" style={{ marginTop: 'var(--azimuth-space-md)' }}>
              A new version is available.
            </Alert>
            {toastVisible && (
              <div style={{ marginTop: 'var(--azimuth-space-md)' }}>
                <Toast variant="success" title="File uploaded" message="photo.jpg" dismissible onDismiss={() => setToastVisible(false)} expandable>
                  <div style={{ padding: 'var(--azimuth-space-sm) 0' }}>
                    <Text size="xs" color="secondary">Size: 2.4 MB</Text>
                    <Text size="xs" color="secondary">Uploaded: Just now</Text>
                  </div>
                </Toast>
              </div>
            )}
          </Section>

          <Divider />

          {/* ===== CARDS ===== */}
          <Section id="cards" title="Cards">
            <Grid cols={2} gap="lg">
              <Card header={<Text weight="semibold">Basic Card</Text>}>
                <Text size="sm" color="secondary">
                  This is a basic card with header and body content.
                </Text>
              </Card>
              <Card
                header={<Text weight="semibold">Expandable Card</Text>}
                expandable
                footer={
                  <Stack direction="horizontal" justify="end" spacing="sm">
                    <Button size="sm" variant="tertiary">Cancel</Button>
                    <Button size="sm">Confirm</Button>
                  </Stack>
                }
              >
                <Text size="sm" color="secondary">
                  Click the toggle in the header to expand or collapse this content.
                  This can be used for additional details.
                </Text>
              </Card>
            </Grid>
          </Section>

          <Divider />

          {/* ===== DATA TABLE ===== */}
          <Section title="Data Table">
            <DataTable
              title="Technologies"
              columns={[
                { key: 'name', title: 'Name', sortable: true },
                { key: 'type', title: 'Type', sortable: true },
                { key: 'version', title: 'Version' },
                { key: 'status', title: 'Status' },
              ]}
              data={TABLE_DATA}
              searchable
              searchPlaceholder="Search technologies..."
              pageSize={3}
              pageSizeOptions={[2, 3, 5]}
            />
          </Section>

          <Divider />

          {/* ===== TABS ===== */}
          <Section title="Tabs">
            <Tabs
              tabs={[
                { id: 't1', label: 'Preview', content: <div style={{ padding: 'var(--azimuth-space-md) 0' }}><Text>This is the preview content of tab 1.</Text></div> },
                { id: 't2', label: 'Code', content: <div style={{ padding: 'var(--azimuth-space-md) 0' }}><Text variant="mono" size="sm">{'<Button variant="primary">Click me</Button>'}</Text></div> },
                { id: 't3', label: 'Settings', content: <div style={{ padding: 'var(--azimuth-space-md) 0' }}><Toggle label="Auto-save" /></div>, disabled: true },
              ]}
              activeTab={tab}
              onChange={setTab}
              variant="underline"
            />
          </Section>

          <Divider />

          {/* ===== NAVIGATION ===== */}
          <Section title="Navigation">
            <Breadcrumbs items={BREADCRUMB_ITEMS} />
            <div style={{ marginTop: 'var(--azimuth-space-xl)' }}>
              <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} showFirstLast />
            </div>
          </Section>

          <Divider />

          {/* ===== OVERLAYS ===== */}
          <Section id="overlays" title="Overlays">
            <Stack direction="horizontal" spacing="md" wrap>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
              <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open Bottom Sheet</Button>
              <Button variant="danger" onClick={() => setDialogOpen(true)}>Delete Confirmation</Button>
            </Stack>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Profile" subtitle="Update your personal information" footer={
              <Stack direction="horizontal" justify="end" spacing="sm">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setModalOpen(false)}>Save Changes</Button>
              </Stack>
            }>
              <Stack spacing="md">
                <Input label="Full Name" defaultValue="John Doe" />
                <Input label="Email" type="email" defaultValue="john@example.com" />
                <Select label="Role" options={[{ value: 'dev', label: 'Developer' }, { value: 'design', label: 'Designer' }]} />
              </Stack>
            </Modal>

            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" side="right" footer={
              <Stack direction="horizontal" spacing="sm">
                <Button variant="secondary" onClick={() => setDrawerOpen(false)} fullWidth>Reset</Button>
                <Button onClick={() => setDrawerOpen(false)} fullWidth>Apply</Button>
              </Stack>
            }>
              <Stack spacing="md">
                <Checkbox label="Active" defaultChecked />
                <Checkbox label="Archived" />
                <Select label="Category" options={[{ value: 'all', label: 'All' }, { value: 'tech', label: 'Tech' }]} />
              </Stack>
            </Drawer>

            <SlideSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Details" side="bottom" height="50vh">
              <Text>Slide sheet content goes here. Drag the handle to resize.</Text>
            </SlideSheet>

            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Delete Item?"
              description="This action cannot be undone. Are you sure?"
              variant="danger"
              confirmLabel="Delete"
              onConfirm={() => setDialogOpen(false)}
              onCancel={() => setDialogOpen(false)}
            />
          </Section>

          <Divider />

          {/* ===== BADGES, TAGS, AVATARS ===== */}
          <Section title="Badges, Tags & Avatars">
            <DemoBox label="Badges">
              <Badge variant="neutral">New</Badge>
              <Badge variant="accent">Featured</Badge>
              <Badge variant="success">Done</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Failed</Badge>
              <Badge variant="info">Info</Badge>
            </DemoBox>
            <DemoBox label="Tags">
              <Tag variant="neutral">React</Tag>
              <Tag variant="accent">TypeScript</Tag>
              <Tag variant="success" removable onRemove={() => {}}>Approved</Tag>
              <Tag variant="danger" removable onRemove={() => {}}>Rejected</Tag>
            </DemoBox>
            <DemoBox label="Avatars">
              <Avatar fallback="John Doe" size="xs" />
              <Avatar fallback="Jane Smith" size="sm" />
              <Avatar fallback="Admin" size="md" />
              <Avatar fallback="User X" size="lg" />
              <Avatar fallback="R C" size="xl" />
              <Avatar fallback="SQ" size="md" square />
            </DemoBox>
          </Section>

          <Divider />

          {/* ===== MISC ===== */}
          <Section title="Loaders & Progress">
            <DemoBox label="Loaders">
              <Loader variant="circle" size="sm" />
              <Loader variant="circle" size="md" />
              <Loader variant="circle" size="lg" />
            </DemoBox>
            <DemoBox label="Loader with Label">
              <Loader variant="bar" size="md" label="Loading..." />
            </DemoBox>
            <DemoBox label="Progress">
              <ProgressBar value={30} color="primary" />
              <ProgressBar value={60} color="success" style={{ marginTop: 'var(--azimuth-space-md)' }} />
              <ProgressBar indeterminate style={{ marginTop: 'var(--azimuth-space-md)' }} />
            </DemoBox>
          </Section>

          <Divider />

          {/* ===== TOOLTIPS & MENUS ===== */}
          <Section title="Tooltips & Menus">
            <Stack direction="horizontal" spacing="md" align="center">
              <Tooltip content="This is a tooltip">
                <Button variant="secondary">Hover me</Button>
              </Tooltip>
              <Tooltip content="Top tooltip" position="top">
                <span style={{ cursor: 'help', borderBottom: '1px dotted var(--azimuth-color-text-muted)' }}>Top</span>
              </Tooltip>
              <Menu
                items={[
                  { key: 'edit', label: 'Edit', icon: <span>📝</span> },
                  { key: 'duplicate', label: 'Duplicate' },
                  { key: 'sep', label: '', separator: true },
                  { key: 'delete', label: 'Delete', danger: true },
                ]}
                onSelect={(key) => console.log(key)}
              />
            </Stack>
          </Section>

          <Divider />

          {/* ===== SLIDER & SEARCH ===== */}
          <Section title="Slider & Search">
            <Grid cols={2} gap="lg">
              <div>
                <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Volume</Text>
                <Slider defaultValue={50} showValue />
              </div>
              <div>
                <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Search</Text>
                <SearchBar placeholder="Search..." onSearch={(q) => console.log(q)} clearable />
              </div>
            </Grid>
          </Section>

          <Divider />

          {/* ===== MORE COMPONENTS ===== */}
          <Section title="Chips & Segmented Button">
            <DemoBox label="Chips">
              <Chip variant="neutral" onClick={() => {}}>Filter</Chip>
              <Chip variant="accent" selected onClick={() => {}}>Selected</Chip>
              <Chip variant="success" onClick={() => {}}>Online</Chip>
              <Chip variant="danger" onClick={() => {}}>Offline</Chip>
              <Chip variant="neutral" deletable onDelete={() => {}}>Removable</Chip>
            </DemoBox>
            <DemoBox label="Segmented Button">
              <SegmentedButton
                options={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                ]}
                defaultValue="week"
                onChange={(v) => console.log(v)}
              />
            </DemoBox>
          </Section>

          <Divider />

          <Section title="TextArea & TextBox">
            <Grid cols={2} gap="lg">
              <TextArea label="Bio" placeholder="Tell us about yourself..." rows={3} />
              <TextBox label="Rich Content" placeholder="Enter styled content..." />
            </Grid>
          </Section>

          <Divider />

          <Section title="Skeleton & Kbd">
            <DemoBox label="Skeleton">
              <Skeleton width="200px" height="16px" />
              <Skeleton width="150px" height="16px" />
              <Skeleton width="180px" height="16px" />
            </DemoBox>
            <DemoBox label="Keyboard shortcuts">
              <Kbd>⌘</Kbd> + <Kbd>C</Kbd>
              <span style={{ margin: '0 var(--azimuth-space-sm)' }}>|</span>
              <Kbd>⌘</Kbd> + <Kbd>V</Kbd>
              <span style={{ margin: '0 var(--azimuth-space-sm)' }}>|</span>
              <Kbd>⌘</Kbd> + <Kbd>⌫</Kbd>
            </DemoBox>
          </Section>

          <Divider />

          <Section title="List & Table">
            <Grid cols={2} gap="lg">
              <Card header={<Text weight="semibold">List</Text>}>
                <List>
                  <List.Item>React</List.Item>
                  <List.Item>TypeScript</List.Item>
                  <List.Item>Vitest</List.Item>
                  <List.Item>Storybook</List.Item>
                </List>
              </Card>
              <Card header={<Text weight="semibold">Table</Text>}>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Alice</td><td>Engineer</td></tr>
                    <tr><td>Bob</td><td>Designer</td></tr>
                  </tbody>
                </Table>
              </Card>
            </Grid>
          </Section>

          <Divider />

          <Section title="CodeBlock & InputGroup">
            <DemoBox label="Code Block (highlighted)">
              <CodeBlock
                language="tsx"
                showCopyButton
                highlight
                code={`import { Button } from '@azimuth/ui';\n\nfunction App() {\n  return <Button>Click me</Button>;\n}`}
              />
            </DemoBox>
            <DemoBox label="Input Group">
              <InputGroup>
                <Input placeholder="First name" />
                <Input placeholder="Last name" />
              </InputGroup>
            </DemoBox>
          </Section>

          <Divider />

          <Section title="PageLayout & SectionView">
            <PageLayout
              sidebar={
                <div style={{ padding: 'var(--azimuth-space-md)' }}>
                  <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Sidebar</Text>
                  <List>
                    <List.Item active>Overview</List.Item>
                    <List.Item>Settings</List.Item>
                    <List.Item>Billing</List.Item>
                  </List>
                </div>
              }
            >
              <SectionView title="Overview">
                <Text size="sm" color="secondary">PageLayout with sidebar and SectionView for content organization.</Text>
              </SectionView>
            </PageLayout>
          </Section>

          <Divider />

          <Section title="Calendar, DateTimePicker & Date Range">
            <Grid cols={2} gap="lg">
              <div>
                <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Calendar</Text>
                <Calendar onChange={(d) => console.log(d)} />
              </div>
              <div>
                <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>DateTime Picker</Text>
                <DateTimePicker onChange={(d) => console.log(d)} />
              </div>
            </Grid>
            <div style={{ marginTop: 'var(--azimuth-space-xl)' }}>
              <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Date Range Picker</Text>
              <DateRangePicker
                label="Select dates"
                onChange={(range) => console.log(range)}
              />
            </div>
          </Section>

          <Divider />

          <Section title="EmptyState & Carousel">
            <DemoBox label="Empty State">
              <EmptyState
                title="No results found"
                description="Try adjusting your search or filter criteria."
                action={<Button size="sm" variant="secondary">Clear Filters</Button>}
              />
            </DemoBox>
            <DemoBox label="Carousel (auto-rotate 3s)">
              <Carousel autoRotate={3000}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ padding: 'var(--azimuth-space-xl)', textAlign: 'center', background: 'var(--azimuth-color-surface-hover)', borderRadius: 'var(--azimuth-radius-md)' }}>
                    <Text size="h4">Slide {i}</Text>
                    <Text size="sm" color="secondary">Auto-advances every 3 seconds</Text>
                  </div>
                ))}
              </Carousel>
            </DemoBox>
          </Section>

          <Divider />

          {/* ===== THEME CONFIG ===== */}
          <Section title="Theme Configuration">
            <Text size="sm" color="secondary" style={{ marginBottom: 'var(--azimuth-space-md)' }}>
              This demo uses the default Azimuth theme. Customize via ThemeProvider config:
            </Text>
            <DemoBox label="Config Options">
              <CodeBlock
                language="tsx"
                highlight
                code={`<ThemeProvider config={{\n  accentColor: '#e8734a',\n  borderRadius: 'md',\n  flat: false,\n  spacing: 'normal',\n  mode: 'system',\n  motion: 'snappy',\n  animations: true,\n  fontDisplay: 'Inter, sans-serif',\n  fontBody: 'Inter, sans-serif',\n}}>\n  <App />\n</ThemeProvider>`}
              />
            </DemoBox>
          </Section>

          <Divider />

          {/* ===== FORM ===== */}
          <Section title="Form Component">
            <Card>
              <Form
                onSubmit={(data) => {
                  alert(`Submitted: ${JSON.stringify(Object.fromEntries(data.entries()))}`);
                }}
              >
                <Stack spacing="md">
                  <Form.Field label="Full Name" required>
                    <Input placeholder="Enter your name" />
                  </Form.Field>
                  <Form.Field label="Email" required helpText="We'll never share it.">
                    <Input type="email" placeholder="you@example.com" />
                  </Form.Field>
                  <Form.Field label="Message" error="This field is required">
                    <textarea
                      placeholder="Your message..."
                      style={{
                        width: '100%', minHeight: '100px', padding: 'var(--azimuth-space-sm) var(--azimuth-space-md)',
                        border: '1px solid var(--azimuth-color-error-text)', borderRadius: 'var(--azimuth-radius-md)',
                        fontFamily: 'var(--azimuth-font-body)', fontSize: 'var(--azimuth-fs-base)',
                        background: 'var(--azimuth-color-surface)', color: 'var(--azimuth-color-text)',
                      }}
                    />
                  </Form.Field>
                  <Stack direction="horizontal" justify="end" spacing="sm">
                    <Button variant="secondary" type="button">Cancel</Button>
                    <Button type="submit">Submit</Button>
                  </Stack>
                </Stack>
              </Form>
            </Card>
          </Section>
        </div>
      </Container>

      <footer style={{
        textAlign: 'center', padding: 'var(--azimuth-space-xl) 0',
        borderTop: '1px solid var(--azimuth-color-border)',
        fontSize: 'var(--azimuth-fs-sm)', color: 'var(--azimuth-color-text-muted)',
      }}>
        Azimuth — Built with TypeScript, React 19, and CSS Modules
      </footer>
    </div>
  );
}
