import React, { useState } from 'react';
import {
  Button, Text, Input, Checkbox, Radio, Select, Toggle,
  Container, Grid, Stack, Divider, Badge, Tag, Chip, Avatar,
  Card, Modal, Drawer, Dialog, Alert, Tooltip, Flyout, Menu,
  Navbar, Tabs, Pagination, Breadcrumbs, DataTable, Table, List,
  Form, SearchBar, Slider, ProgressBar, Loader, Skeleton, EmptyState,
  CodeBlock, Calendar, DateTimePicker, DateRangePicker, Carousel,
  SectionView, SegmentedButton, Kbd, TextArea, TextBox, PageLayout,
  ResizablePanel, TreeList, DropdownList, LoginSignup, Chat, FileUpload,
  SlideSheet, Icon, useToast,
  Rating, Timeline, NotificationBadge, OTPInput, SplitButton,
  BreadcrumbPageHeader, Combobox, Sidebar, ColorPicker,
  CommandPalette, DiffViewer,
  Clock, Accordion, ImageViewer, ErrorPage,
  MediaPlayer, SimpleChart, MapDisplay,
} from '../src';
import { COMPONENT_DATA, type ComponentDoc } from './component-data';
import { Playground } from './Playground';
import { componentMap } from './componentMap';

class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <Text size="sm" color="muted">Preview unavailable</Text>;
    return this.props.children;
  }
}

function ComponentPreview({ doc, onShowModal, onShowDrawer, onShowDialog, onShowSheet, onShowToast, onShowAlert }: {
  doc: ComponentDoc;
  onShowModal: () => void;
  onShowDrawer: () => void;
  onShowDialog: () => void;
  onShowSheet: () => void;
  onShowToast: (variant: 'success' | 'error' | 'warning' | 'info') => void;
  onShowAlert?: (variant: 'info' | 'success' | 'warning' | 'caution') => void;
}) {
  const previews: Record<string, React.ReactNode> = {
    Button: (
      <Stack direction="horizontal" spacing="sm" wrap>
        {['primary', 'secondary', 'tertiary', 'link', 'danger'].map(v => (
          <Button key={v} variant={v as any} size="sm">{v}</Button>
        ))}
        <Button size="sm" icon={<span>+</span>}>Icon</Button>
        <Button size="sm" fullWidth>Full Width</Button>
      </Stack>
    ),
    Text: (
      <Stack spacing="sm">
        <Text size="h1">Heading 1</Text>
        <Text size="h2">Heading 2</Text>
        <Text size="base">Body text</Text>
        <Text size="sm" color="secondary">Secondary small text</Text>
      </Stack>
    ),
    Badge: (
      <Stack direction="horizontal" spacing="xs" wrap>
        {['neutral', 'accent', 'success', 'warning', 'danger', 'info'].map(v => (
          <Badge key={v} variant={v as any}>{v}</Badge>
        ))}
      </Stack>
    ),
    Tag: (
      <Stack direction="horizontal" spacing="xs" wrap>
        {['neutral', 'accent', 'success', 'warning', 'danger', 'info'].map(v => (
          <Tag key={v} variant={v as any}>{v}</Tag>
        ))}
      </Stack>
    ),
    Chip: (
      <Stack direction="horizontal" spacing="xs" wrap>
        <Chip variant="neutral" onClick={() => {}}>Filter</Chip>
        <Chip variant="accent" selected onClick={() => {}}>Selected</Chip>
        <Chip variant="success" onClick={() => {}}>Active</Chip>
        <Chip variant="neutral" deletable onDelete={() => {}}>Removable</Chip>
      </Stack>
    ),
    Card: (
      <Grid cols={2} gap="md">
        <Card header={<Text weight="semibold">Basic Card</Text>}>
          <Text size="sm" color="secondary">Card body content with description text.</Text>
        </Card>
        <Card header={<Text weight="semibold">With Footer</Text>}
          footer={<Button size="sm" fullWidth>Action</Button>}>
          <Text size="sm" color="secondary">Card with a footer action button.</Text>
        </Card>
      </Grid>
    ),
    Toggle: (
      <Stack spacing="sm">
        <Toggle label="Toggle me" defaultChecked />
        <Toggle label="Disabled toggle" disabled />
      </Stack>
    ),
    Checkbox: (
      <Stack spacing="sm">
        <Checkbox label="Option one" defaultChecked />
        <Checkbox label="Option two" />
        <Checkbox label="Disabled" disabled />
      </Stack>
    ),
    Radio: (
      <Stack spacing="sm">
        <Radio name="demo-radio" label="Choice A" defaultChecked />
        <Radio name="demo-radio" label="Choice B" />
        <Radio name="demo-radio" label="Choice C" disabled />
      </Stack>
    ),
    Slider: (
      <div style={{ padding: 'var(--azimuth-space-md)' }}>
        <Slider defaultValue={50} showValue />
        <Slider defaultValue={30} orientation="vertical" size="sm" />
      </div>
    ),
    ProgressBar: (
      <Stack spacing="md">
        <ProgressBar value={30} color="primary" />
        <ProgressBar value={70} color="success" />
        <ProgressBar indeterminate />
        <ProgressBar value={50} color="warning" size="sm" />
      </Stack>
    ),
    Loader: (
      <Stack direction="horizontal" spacing="md" align="center">
        <Loader variant="circle" size="sm" />
        <Loader variant="circle" size="md" />
        <Loader variant="circle" size="lg" />
        <Loader variant="bar" size="md" label="Loading..." />
      </Stack>
    ),
    Alert: (
      <Stack spacing="md">
        <Stack direction="horizontal" spacing="sm" wrap>
          {(['info', 'success', 'warning', 'caution'] as const).map(v => (
            <Button key={v} size="sm" variant={v === 'caution' ? 'danger' : 'secondary'}
              onClick={() => onShowAlert?.(v)}>
              Show {v}
            </Button>
          ))}
        </Stack>
        <Text size="xs" color="muted">Click a button above to see the alert appear on the page.</Text>
      </Stack>
    ),
    Tooltip: (
      <Stack direction="horizontal" spacing="md">
        <Tooltip content="Tooltip on top" position="top">
          <Button variant="secondary" size="sm">Hover top</Button>
        </Tooltip>
        <Tooltip content="Tooltip on bottom">
          <Button variant="secondary" size="sm">Hover bottom</Button>
        </Tooltip>
        <Tooltip content="Tooltip on left" position="left">
          <Button variant="secondary" size="sm">Hover left</Button>
        </Tooltip>
      </Stack>
    ),
    Avatar: (
      <Stack direction="horizontal" spacing="sm" align="center">
        <Avatar fallback="JD" size="sm" />
        <Avatar fallback="Jane Smith" size="md" />
        <Avatar fallback="Admin" size="lg" />
        <Avatar fallback="User" size="xl" />
        <Avatar fallback="SQ" size="md" square />
        <Avatar src="" fallback="EP" size="md" />
      </Stack>
    ),
    Kbd: (
      <Stack direction="horizontal" spacing="sm" align="center">
        <Kbd>Ctrl</Kbd> <Text size="sm">+</Text> <Kbd>C</Kbd>
        <Text size="sm" style={{ margin: '0 var(--azimuth-space-sm)' }}>|</Text>
        <Kbd>Cmd</Kbd> <Text size="sm">+</Text> <Kbd>Shift</Kbd> <Text size="sm">+</Text> <Kbd>Z</Kbd>
      </Stack>
    ),
    Skeleton: (
      <Stack spacing="sm">
        <Skeleton width="60%" height="16px" />
        <Skeleton width="40%" height="16px" />
        <Skeleton width="80%" height="16px" />
        <div style={{ display: 'flex', gap: 'var(--azimuth-space-sm)', alignItems: 'center' }}>
          <Skeleton variant="circle" width="40px" height="40px" />
          <Stack spacing="xs">
            <Skeleton width="120px" height="12px" />
            <Skeleton width="80px" height="12px" />
          </Stack>
        </div>
      </Stack>
    ),
    EmptyState: (
      <EmptyState
        title="No results found"
        description="Try adjusting your search or filter criteria."
        action={<Button size="sm" variant="secondary">Clear Filters</Button>}
      />
    ),
    Tabs: (
      <Tabs
        tabs={[
          { id: 'a', label: 'Tab A', content: <Text size="sm">Content A</Text> },
          { id: 'b', label: 'Tab B', content: <Text size="sm">Content B</Text> },
          { id: 'c', label: 'Tab C', disabled: true, content: <Text size="sm">Content C</Text> },
        ]}
        variant="underline"
      />
    ),
    SegmentedButton: (
      <SegmentedButton
        options={[
          { value: 'd', label: 'Day' },
          { value: 'w', label: 'Week' },
          { value: 'm', label: 'Month' },
        ]}
        defaultValue="w"
        onChange={() => {}}
      />
    ),
    List: (
      <Grid cols={2} gap="md">
        <Card header={<Text weight="semibold" size="sm">Bulleted</Text>}>
          <List bulleted><List.Item>Item one</List.Item><List.Item>Item two</List.Item></List>
        </Card>
        <Card header={<Text weight="semibold" size="sm">Ordered</Text>}>
          <List ordered><List.Item>First</List.Item><List.Item>Second</List.Item></List>
        </Card>
      </Grid>
    ),
    Table: (
      <Table striped size="sm">
        <Table.Head><Table.Row>
          <Table.HeadCell>Name</Table.HeadCell><Table.HeadCell>Role</Table.HeadCell><Table.HeadCell>Status</Table.HeadCell>
        </Table.Row></Table.Head>
        <Table.Body>
          <Table.Row><Table.Cell>Alice</Table.Cell><Table.Cell>Engineer</Table.Cell><Table.Cell><Badge variant="success">Active</Badge></Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Bob</Table.Cell><Table.Cell>Designer</Table.Cell><Table.Cell><Badge variant="warning">Away</Badge></Table.Cell></Table.Row>
        </Table.Body>
      </Table>
    ),
    Input: (
      <Stack spacing="sm">
        <Input label="Email" type="email" placeholder="you@example.com" size="sm" />
        <Input label="Password" type="password" placeholder="Enter password" size="sm" />
        <Input label="With Error" error="Invalid value" size="sm" />
        <Input label="Number" type="number" showSteppers min={0} max={100} size="sm" />
      </Stack>
    ),
    Select: (
      <Select
        label="Framework" placeholder="Choose..."
        options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }, { value: 'svelte', label: 'Svelte' }]}
        size="sm"
      />
    ),
    TextArea: (
      <TextArea label="Message" placeholder="Type your message..." rows={3} size="sm" />
    ),
    SearchBar: (
      <SearchBar placeholder="Search..." onSearch={() => {}} clearable />
    ),
    Pagination: (
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} showFirstLast size="sm" />
    ),
    Breadcrumbs: (
      <Breadcrumbs items={[{ label: 'Home' }, { label: 'Section' }, { label: 'Current' }]} />
    ),
    Calendar: (
      <Calendar onChange={() => {}} />
    ),
    Chat: (
      <div style={{ height: '220px' }}>
        <Chat
          messages={[
            { id: '1', text: 'Hello!', sender: 'other', timestamp: new Date() },
            { id: '2', text: 'How can I help?', sender: 'user', timestamp: new Date() },
          ]}
          onSend={() => {}}
        />
      </div>
    ),
    FileUpload: (
      <FileUpload onFilesSelected={() => {}} accept="image/*,.pdf" maxSize={5} />
    ),
    CodeBlock: (
      <CodeBlock
        language="tsx" showCopyButton highlight
        code={`function Hello() {\n  return <Text>Hi</Text>;\n}`}
        maxHeight="120px"
      />
    ),
    Carousel: (
      <Carousel showArrows showDots>
        <div style={{ padding: 'var(--azimuth-space-lg)', textAlign: 'center', background: 'var(--azimuth-color-surface-hover)', borderRadius: 'var(--azimuth-radius-md)' }}>
          <Text size="h4">Slide 1</Text><Text size="sm" color="secondary">First slide content</Text>
        </div>
        <div style={{ padding: 'var(--azimuth-space-lg)', textAlign: 'center', background: 'var(--azimuth-color-surface-hover)', borderRadius: 'var(--azimuth-radius-md)' }}>
          <Text size="h4">Slide 2</Text><Text size="sm" color="secondary">Second slide content</Text>
        </div>
        <div style={{ padding: 'var(--azimuth-space-lg)', textAlign: 'center', background: 'var(--azimuth-color-surface-hover)', borderRadius: 'var(--azimuth-radius-md)' }}>
          <Text size="h4">Slide 3</Text><Text size="sm" color="secondary">Third slide content</Text>
        </div>
      </Carousel>
    ),
    DataTable: (
      <DataTable
        title="Sample" searchable
        columns={[
          { key: 'name', title: 'Name', sortable: true },
          { key: 'value', title: 'Value', sortable: true },
          { key: 'status', title: 'Status' },
        ]}
        data={[
          { name: 'Alpha', value: 10, status: 'Active' },
          { name: 'Beta', value: 20, status: 'Active' },
          { name: 'Gamma', value: 15, status: 'Inactive' },
        ]}
        pageSize={5}
        actions={<Button size="sm" variant="secondary">Export</Button>}
      />
    ),
    DropdownList: (
      <DropdownList label="Choose" placeholder="Select..."
        options={[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }, { value: 'c', label: 'Option C', disabled: true }]}
      />
    ),
    SectionView: (
      <SectionView title="Click to expand">
        <Text size="sm" color="secondary">This content is collapsible with smooth animation.</Text>
      </SectionView>
    ),
    ResizablePanel: (
      <div style={{ height: '100px' }}>
        <ResizablePanel direction="horizontal" minSize={30}>
          <div style={{ padding: 'var(--azimuth-space-sm)' }}><Text size="sm">Left panel</Text></div>
          <div style={{ padding: 'var(--azimuth-space-sm)' }}><Text size="sm">Right panel</Text></div>
        </ResizablePanel>
      </div>
    ),
    TreeList: (
      <TreeList
        data={[
          { id: '1', label: 'Parent', children: [{ id: '1a', label: 'Child 1' }, { id: '1b', label: 'Child 2' }] },
          { id: '2', label: 'Item 2' },
        ]}
        showLines onSelect={() => {}}
      />
    ),
    Stack: (
      <Stack spacing="sm">
        <Badge variant="info">Item 1</Badge>
        <Badge variant="success">Item 2</Badge>
        <Badge variant="warning">Item 3</Badge>
      </Stack>
    ),
    Grid: (
      <Grid cols={3} gap="sm">
        <Card><Text size="sm">A</Text></Card>
        <Card><Text size="sm">B</Text></Card>
        <Card><Text size="sm">C</Text></Card>
      </Grid>
    ),
    Container: (
      <Container><Text size="sm" color="secondary">Centered content container with max-width constraint.</Text></Container>
    ),
    Divider: (
      <Stack spacing="sm">
        <Text size="sm">Above</Text>
        <Divider />
        <Text size="sm">Below</Text>
        <Stack direction="horizontal" spacing="sm" align="center">
          <Text size="sm">Left</Text>
          <Divider orientation="vertical" />
          <Text size="sm">Right</Text>
        </Stack>
      </Stack>
    ),
    Toast: (
      <Stack direction="horizontal" spacing="sm" wrap>
        {(['success', 'error', 'warning', 'info'] as const).map(v => (
          <Button key={v} size="sm" variant={v === 'error' ? 'danger' : 'secondary'} onClick={() => onShowToast(v)}>
            Show {v}
          </Button>
        ))}
      </Stack>
    ),
    Dialog: (
      <Stack direction="horizontal" spacing="sm" wrap>
        {(['info', 'warning', 'danger'] as const).map(v => (
          <Button key={v} size="sm" variant={v === 'danger' ? 'danger' : 'secondary'} onClick={onShowDialog}>
            {v === 'danger' ? 'Delete Dialog (danger)' : v === 'warning' ? 'Warning Dialog' : 'Info Dialog'}
          </Button>
        ))}
      </Stack>
    ),
    Modal: (
      <Stack direction="horizontal" spacing="sm">
        <Button size="sm" onClick={onShowModal}>Open Modal</Button>
        <Button size="sm" variant="secondary">Default</Button>
      </Stack>
    ),
    Drawer: (
      <Button size="sm" onClick={onShowDrawer}>Open Drawer (right side)</Button>
    ),
    SlideSheet: (
      <Button size="sm" onClick={onShowSheet}>Open Sheet</Button>
    ),
    PageLayout: (
      <PageLayout
        sidebar={<div style={{ padding: 'var(--azimuth-space-sm)' }}><Text size="sm">Sidebar</Text></div>}
      >
        <Text size="sm">Main content area with sidebar layout.</Text>
      </PageLayout>
    ),
    Flyout: (
      <Stack direction="horizontal" spacing="md">
        <Flyout trigger={<Button variant="secondary" size="sm">Hover me</Button>}
          content={<div style={{ padding: 'var(--azimuth-space-md)' }}><Text size="sm">Flyout content here</Text></div>} />
        <Flyout trigger={<Button variant="secondary" size="sm">Top</Button>} side="top"
          content={<div style={{ padding: 'var(--azimuth-space-md)' }}><Text size="sm">Top flyout</Text></div>} />
      </Stack>
    ),
    Menu: (
      <Stack direction="horizontal" spacing="md">
        <Menu
          items={[
            { key: 'edit', label: 'Edit', icon: <span>E</span> },
            { key: 'dup', label: 'Duplicate' },
            { key: 'sep', label: '', separator: true },
            { key: 'del', label: 'Delete', danger: true },
          ]}
          onSelect={() => {}}
        />
      </Stack>
    ),
    Navbar: (
      <div style={{ border: '1px solid var(--azimuth-color-border)', borderRadius: 'var(--azimuth-radius-md)' }}>
        <Navbar
          logo={<Text weight="bold" size="sm">Logo</Text>}
          items={[{ key: 'a', label: 'Home' }, { key: 'b', label: 'About' }]}
          actions={<Button size="sm">Action</Button>}
        />
      </div>
    ),
    LoginSignup: (
      <div style={{ maxWidth: '320px' }}>
        <LoginSignup defaultView="login"
          providers={[{ id: 'github', label: 'GitHub' }, { id: 'google', label: 'Google' }]}
        />
      </div>
    ),
    DateTimePicker: (
      <DateTimePicker onChange={() => {}} showTime={false} />
    ),
    DateRangePicker: (
      <DateRangePicker label="Range" onChange={() => {}} />
    ),
    TextBox: (
      <Stack spacing="sm">
        <TextBox variant="plain">Plain text box content with standard styling.</TextBox>
        <TextBox variant="code">const x = 42;</TextBox>
      </Stack>
    ),
    Icon: (
      <Stack direction="horizontal" spacing="sm" align="center">
        <Icon size="sm"><span>icon</span></Icon>
        <Icon size="md"><span>icon</span></Icon>
        <Icon size="lg"><span>icon</span></Icon>
        <Icon size="xl"><span>icon</span></Icon>
      </Stack>
    ),
    Rating: <Rating onChange={() => {}} />,
    Timeline: (
      <Timeline
        items={[
          { id: '1', title: 'Event 1', date: '2026', description: 'First event.' },
          { id: '2', title: 'Event 2', date: '2026', description: 'Second event.' },
          { id: '3', title: 'Event 3', date: '2026', description: 'Third event.' },
        ]}
      />
    ),
    NotificationBadge: (
      <Stack direction="horizontal" spacing="xl" align="center">
        <NotificationBadge count={5}>
          <Button variant="secondary" size="sm">Inbox</Button>
        </NotificationBadge>
        <NotificationBadge count={120} max={99}>
          <Button variant="secondary" size="sm">Notifications</Button>
        </NotificationBadge>
        <NotificationBadge dot>
          <Button variant="secondary" size="sm">Alerts</Button>
        </NotificationBadge>
      </Stack>
    ),
    OTPInput: <OTPInput length={4} onChange={() => {}} />,
    SplitButton: (
      <SplitButton
        label="Save"
        onClick={() => {}}
        options={[
          { key: 'save-as', label: 'Save As' },
          { key: 'export', label: 'Export' },
        ]}
      />
    ),
    BreadcrumbPageHeader: (
      <BreadcrumbPageHeader
        title="Page Title"
        description="Page description text."
        breadcrumbs={[{ label: 'Home' }, { label: 'Section' }, { label: 'Current' }]}
        actions={<Button size="sm">Action</Button>}
      />
    ),
    Combobox: (
      <Combobox
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        value=""
        onChange={() => {}}
        onSelect={() => {}}
        label="Framework"
      />
    ),
    Sidebar: (
      <div style={{ height: '200px', border: '1px solid var(--azimuth-color-border)', borderRadius: 'var(--azimuth-radius-md)', overflow: 'hidden' }}>
        <Sidebar
          header={<Text weight="bold" size="sm" style={{ padding: 'var(--azimuth-space-sm)' }}>Logo</Text>}
          items={[
            { key: 'a', label: 'Home', icon: <span>H</span> },
            { key: 'b', label: 'Settings', icon: <span>S</span>, badge: 3 },
          ]}
          activeKey="a"
          onSelect={() => {}}
        />
      </div>
    ),
    ColorPicker: <ColorPicker value="#2563eb" presets={['#2563eb', '#e8734a', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']} onChange={() => {}} />,
    CommandPalette: (
      <Button variant="secondary" size="sm" onClick={() => {}}>Press Ctrl+K to open</Button>
    ),
    DiffViewer: (
      <DiffViewer
        oldCode="const x = 1;\nconst y = 2;"
        newCode="const x = 2;\nconst y = 3;\nconst z = 4;"
        language="js"
        maxHeight="150px"
      />
    ),
    Clock: <Clock mode="clock" size="md" />,
    Accordion: (
      <Accordion
        items={[
          { id: '1', title: 'Section 1', content: <Text size="sm">First section content.</Text> },
          { id: '2', title: 'Section 2', content: <Text size="sm">Second section content.</Text> },
          { id: '3', title: 'Section 3', content: <Text size="sm">Third section content.</Text> },
        ]}
      />
    ),
    ImageViewer: <Button variant="secondary" size="sm" disabled>Requires images array</Button>,
    ErrorPage: (
      <ErrorPage status={404} title="Page not found"
        description="The page you are looking for does not exist."
        action={<Button size="sm">Go Home</Button>}
      />
    ),
    MediaPlayer: <MediaPlayer src="" title="Demo video" controls={false} />,
    SimpleChart: (
      <SimpleChart type="bar"
        data={[{ label: 'A', value: 30 }, { label: 'B', value: 50 }, { label: 'C', value: 20 }]}
        width={300} height={200}
      />
    ),
    MapDisplay: <MapDisplay title="Demo map" height="200px" />,
    Cursor: <Text size="sm" color="secondary">The Cursor component sets cursor behavior on child elements. Use useCursor() hook to set a global cursor.</Text>,
    VisuallyHidden: <div><Text size="sm">There is hidden text below this line:</Text><VisuallyHidden>This text is only visible to screen readers.</VisuallyHidden></div>,
  };

  return (
    <div style={{ minHeight: '120px' }}>
      {previews[doc.name] || <Text size="sm" color="muted">Preview not available for {doc.name}</Text>}
    </div>
  );
}

export function ComponentsPage() {
  const [selected, setSelected] = useState(COMPONENT_DATA[0]?.name || '');
  const [tab, setTab] = useState('preview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [alerts, setAlerts] = useState<Array<{ id: string; variant: 'info' | 'success' | 'warning' | 'caution'; title: string; message: string }>>([]);
  const [exitingAlerts, setExitingAlerts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const doc = COMPONENT_DATA.find(d => d.name === selected);
  if (!doc) return <Text>Loading...</Text>;

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      <div style={{
        width: sidebarCollapsed ? '48px' : '240px',
        minWidth: sidebarCollapsed ? '48px' : '240px',
        height: '100%',
        borderRight: '1px solid var(--azimuth-color-border)',
        overflowY: 'auto',
        padding: sidebarCollapsed ? 'var(--azimuth-space-sm)' : 'var(--azimuth-space-md)',
        transition: 'width var(--azimuth-transition-base), min-width var(--azimuth-transition-base)',
      }}>
        <Stack direction="horizontal" justify="between" align="center" style={{ marginBottom: 'var(--azimuth-space-md)' }}>
          {!sidebarCollapsed && <Text weight="semibold" size="sm">Components</Text>}
          <Button variant="tertiary" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{sidebarCollapsed ? '>' : '<'}
          </Button>
        </Stack>
        {COMPONENT_DATA.map(item => (
          <button key={item.name}
            onClick={() => setSelected(item.name)}
            style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: sidebarCollapsed ? 'var(--azimuth-space-xs)' : 'var(--azimuth-space-xs) var(--azimuth-space-sm)',
              border: 'none', borderRadius: 'var(--azimuth-radius-sm)',
              background: selected === item.name ? 'var(--azimuth-color-primary-subtle)' : 'transparent',
              color: selected === item.name ? 'var(--azimuth-color-primary)' : 'var(--azimuth-color-text)',
              fontSize: 'var(--azimuth-fs-sm)', fontWeight: selected === item.name ? 600 : 400,
              cursor: 'pointer', fontFamily: 'var(--azimuth-font-body)', marginBottom: '2px',
            }}
          >
            {sidebarCollapsed ? item.name.slice(0, 2) : item.name}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '0 var(--azimuth-space-xl)', overflowY: 'auto', height: '100%' }}>
        <Stack spacing="lg">
          <div>
            <Stack direction="horizontal" spacing="sm" align="center" style={{ marginBottom: 'var(--azimuth-space-xs)' }}>
              <Text size="h2" style={{ margin: 0 }}>{doc.name}</Text>
              <Badge variant="neutral">{doc.category}</Badge>
            </Stack>
            <Text size="sm" color="secondary">{doc.description}</Text>
          </div>

          <Tabs variant="pills" activeTab={tab} onChange={setTab}
            tabs={[
              {
                id: 'preview', label: 'Preview',
                content: (
                  <Card>
                    <PreviewErrorBoundary>
                      <ComponentPreview doc={doc}
                        onShowModal={() => setModalOpen(true)}
                        onShowDrawer={() => setDrawerOpen(true)}
                        onShowDialog={() => setDialogOpen(true)}
                        onShowSheet={() => setSheetOpen(true)}
                        onShowToast={(v) => {
                          toast({ title: `${v} notification`, message: 'This is a demonstration toast.', variant: v, duration: 4000 });
                        }}
                        onShowAlert={(v) => {
                          const id = Date.now().toString();
                          setAlerts(prev => [...prev, {
                            id,
                            variant: v,
                            title: v.charAt(0).toUpperCase() + v.slice(1),
                            message: `This is a ${v} alert demonstration. It shows how alerts appear on the page.`,
                          }]);
                          setTimeout(() => {
                            setExitingAlerts(prev => new Set(prev).add(id));
                            setTimeout(() => {
                              setAlerts(prev => prev.filter(a => a.id !== id));
                              setExitingAlerts(prev => { const n = new Set(prev); n.delete(id); return n; });
                            }, 300);
                          }, 6000);
                        }}
                      />
                    </PreviewErrorBoundary>
                  </Card>
                ),
              },
              {
                id: 'features', label: 'Features',
                content: (
                  <Card>
                    <Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Features</Text>
                    {doc.features.length > 0 ? (
                      <List bulleted>{doc.features.map(f => <List.Item key={f}>{f}</List.Item>)}</List>
                    ) : <Text size="sm" color="muted">No features listed.</Text>}
                    {doc.variants.length > 0 && (
                      <><Divider /><Text size="sm" weight="semibold" style={{ marginBottom: 'var(--azimuth-space-sm)' }}>Variants</Text>
                        <Stack direction="horizontal" spacing="xs" wrap>
                          {doc.variants.map(v => <Tag key={v} variant="accent">{v}</Tag>)}
                        </Stack>
                      </>
                    )}
                  </Card>
                ),
              },
              {
                id: 'api', label: 'API',
                content: (
                  <Card header={<Text weight="semibold">Props</Text>}>
                    {doc.props.length > 0 ? (
                      <Table striped size="sm">
                        <Table.Head><Table.Row>
                          <Table.HeadCell>Name</Table.HeadCell><Table.HeadCell>Type</Table.HeadCell><Table.HeadCell>Default</Table.HeadCell><Table.HeadCell>Description</Table.HeadCell>
                        </Table.Row></Table.Head>
                        <Table.Body>
                          {doc.props.map(p => (
                            <Table.Row key={p.name}>
                              <Table.Cell><Text size="sm" weight="semibold">{p.name}</Text></Table.Cell>
                              <Table.Cell><CodeBlock code={p.type} language="ts" maxHeight="none" highlight={false} /></Table.Cell>
                              <Table.Cell>{p.default ? <Tag variant="neutral">{p.default}</Tag> : '-'}</Table.Cell>
                              <Table.Cell><Text size="sm">{p.description}</Text></Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    ) : <Text size="sm" color="muted">No props documented.</Text>}
                  </Card>
                ),
              },
              {
                id: 'css', label: 'CSS Vars',
                content: (
                  <Card header={<Text weight="semibold">CSS Custom Properties</Text>}>
                    {doc.cssVars.length > 0 ? (
                      <Table striped size="sm">
                        <Table.Head><Table.Row><Table.HeadCell>Variable</Table.HeadCell><Table.HeadCell>Description</Table.HeadCell></Table.Row></Table.Head>
                        <Table.Body>
                          {doc.cssVars.map(v => (
                            <Table.Row key={v.name}>
                              <Table.Cell><CodeBlock code={v.name} language="css" maxHeight="none" highlight={false} /></Table.Cell>
                              <Table.Cell><Text size="sm">{v.description}</Text></Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table>
                    ) : <Text size="sm" color="muted">No CSS variables documented.</Text>}
                  </Card>
                ),
              },
              {
                id: 'playground', label: 'Playground',
                content: <Playground doc={doc} />,
              },
            ]}
          />
        </Stack>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Demo Modal" subtitle="This demonstrates the Modal component"
        footer={<Stack direction="horizontal" justify="end" spacing="sm">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={() => setModalOpen(false)}>Save</Button>
        </Stack>}
      >
        <Stack spacing="md">
          <Input label="Name" defaultValue="Jane Doe" />
          <Input label="Email" type="email" defaultValue="jane@example.com" />
        </Stack>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Demo Drawer" side="right" size="sm"
        footer={<Stack direction="horizontal" spacing="sm">
          <Button variant="secondary" onClick={() => setDrawerOpen(false)} fullWidth>Cancel</Button>
          <Button onClick={() => setDrawerOpen(false)} fullWidth>Apply</Button>
        </Stack>}
      >
        <Stack spacing="md">
          <Toggle label="Option A" defaultChecked />
          <Toggle label="Option B" />
          <Select label="Category" options={[{ value: 'a', label: 'All' }, { value: 'b', label: 'Tech' }]} />
        </Stack>
      </Drawer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm Action"
        description="Are you sure you want to proceed? This action can be undone."
        variant="warning" confirmLabel="Confirm" cancelLabel="Cancel"
        onConfirm={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />

      <SlideSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Demo Sheet" side="bottom" height="40vh"
        snapPoints={['25vh', '40vh']}
      >
        <Stack spacing="md">
          <Text size="sm">Slide sheet content with drag handle for resizing.</Text>
          <Input placeholder="Type something..." />
        </Stack>
      </SlideSheet>

      <div style={{ position: 'fixed', top: 'var(--azimuth-space-lg)', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 'var(--azimuth-space-sm)', pointerEvents: 'none' }}>
        {alerts.map(a => (
          <div key={a.id} style={{
            pointerEvents: 'auto',
            transition: 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease, margin 0.3s ease',
            opacity: exitingAlerts.has(a.id) ? 0 : 1,
            transform: exitingAlerts.has(a.id) ? 'translateX(-100%)' : 'translateX(0)',
            maxHeight: exitingAlerts.has(a.id) ? '0' : '200px',
            marginBottom: exitingAlerts.has(a.id) ? '0' : '',
            overflow: 'hidden',
          }}>
            <Alert variant={a.variant} title={a.title} dismissible onDismiss={() => {
              setExitingAlerts(prev => new Set(prev).add(a.id));
              setTimeout(() => {
                setAlerts(prev => prev.filter(x => x.id !== a.id));
                setExitingAlerts(prev => { const n = new Set(prev); n.delete(a.id); return n; });
              }, 300);
            }}>
              {a.message}
            </Alert>
          </div>
        ))}
      </div>
    </div>
  );
}
