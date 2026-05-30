import { useState, useRef, useEffect } from 'react';
import { Button, Text, Stack, Card } from '../src';
import { componentMap } from './componentMap';
import type { ComponentDoc } from './component-data';

function generateDefaultCode(componentName: string): string {
  const templates: Record<string, string> = {
    Button: `return React.createElement(Button, { variant: 'primary', size: 'md' }, 'Click Me')`,
    Text: `return React.createElement(Text, { element: { size: 'h2' }, color: 'primary' }, 'Heading Text')`,
    Badge: `return React.createElement(Badge, { variant: 'accent' }, 'New')`,
    Tag: `return React.createElement(Tag, { variant: 'success' }, 'Approved')`,
    Chip: `return React.createElement(Chip, { variant: 'accent', onClick: () => alert('Clicked!') }, 'Filter')`,
    Toggle: `return React.createElement(Toggle, { label: 'Enable feature', defaultChecked: true })`,
    Checkbox: `return React.createElement(Checkbox, { label: 'Agree to terms', defaultChecked: true })`,
    Input: `return React.createElement(Input, { label: 'Email', placeholder: 'you@example.com', size: 'md' })`,
    Select: `return React.createElement(Select, { label: { text: 'Framework' }, placeholder: 'Choose...', options: [{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }], size: 'md' })`,
    Slider: `return React.createElement(Slider, { defaultValue: 50, showValue: true })`,
    ProgressBar: `return React.createElement(ProgressBar, { value: 65, color: 'success' })`,
    Loader: `return React.createElement(Loader, { variant: 'circle', size: 'md', label: 'Loading...' })`,
    Avatar: `return React.createElement(Avatar, { fallback: 'JD', size: 'lg' })`,
    Alert: `return React.createElement(Alert, { variant: 'info', title: 'Notice' }, 'This is an informational alert.')`,
    Card: `return React.createElement(Card, { header: React.createElement(Text, { weight: 'semibold' }, 'Card Title') }, React.createElement(Text, { element: { size: 'sm' }, color: 'secondary' }, 'Card body content here.'))`,
    Kbd: `return React.createElement(Kbd, null, 'Ctrl + K')`,
    Skeleton: `return React.createElement(Skeleton, { width: '60%', height: '16px' })`,
    Toast: `return React.createElement(Toast, { title: 'Notification', message: 'This is a toast message.', variant: 'info' })`,
    Table: `return React.createElement(Table, { striped: true, size: 'sm' }, React.createElement(Table.Head, null, React.createElement(Table.Row, null, React.createElement(Table.HeadCell, null, 'Name'), React.createElement(Table.HeadCell, null, 'Status'))), React.createElement(Table.Body, null, React.createElement(Table.Row, null, React.createElement(Table.Cell, null, 'Alice'), React.createElement(Table.Cell, null, 'Active'))))`,
    List: `return React.createElement(List, { bulleted: true }, React.createElement(List.Item, null, 'First'), React.createElement(List.Item, null, 'Second'))`,
    Stack: `return React.createElement(Stack, { spacing: 'md' }, React.createElement(Badge, { variant: 'info' }, 'One'), React.createElement(Badge, { variant: 'success' }, 'Two'))`,
    Grid: `return React.createElement(Grid, { cols: 2, gap: 'sm' }, React.createElement(Card, null, React.createElement(Text, null, 'A')), React.createElement(Card, null, React.createElement(Text, null, 'B')))`,
  };
  return (
    templates[componentName] ||
    `return React.createElement(${componentName}, {}, '${componentName} component')`
  );
}

function evaluateCode(
  codeStr: string,
  componentName: string,
): { result: React.ReactNode; error: string | null } {
  const Comp = componentMap[componentName];
  if (!Comp)
    return {
      result: null,
      error: `Component "${componentName}" is not available in the sandbox.`,
    };
  try {
    const createElement = (...args: any[]) => args;
    const fn = new Function('React', componentName, codeStr);
    const result = fn({ createElement }, Comp);
    return { result: result as React.ReactNode, error: null };
  } catch (e: any) {
    return { result: null, error: e.message || String(e) };
  }
}

export function Playground({ doc }: { doc: ComponentDoc }) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const defaultCode = generateDefaultCode(doc.name);
    setCode(defaultCode);
    const { result, error: err } = evaluateCode(defaultCode, doc.name);
    setOutput(result);
    setError(err);
  }, [doc.name]);

  const handleChange = (value: string) => {
    setCode(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const { result, error: err } = evaluateCode(value, doc.name);
      setOutput(result);
      setError(err);
    }, 500);
  };

  const handleRun = () => {
    const { result, error: err } = evaluateCode(code, doc.name);
    setOutput(result);
    setError(err);
  };

  const importCode = `import { ${doc.name} } from 'azimuth-ui';`;

  return (
    <Stack spacing="lg">
      <Card>
        <Stack spacing="md">
          <Text element={{ size: 'sm' }} weight="semibold">
            Import
          </Text>
          <div
            style={{
              padding: 'var(--azimuth-space-sm) var(--azimuth-space-md)',
              background: 'var(--azimuth-color-bg)',
              borderRadius: 'var(--azimuth-radius-sm)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 'var(--azimuth-fs-sm)',
              color: 'var(--azimuth-color-text)',
              lineHeight: '1.6',
            }}
          >
            {importCode}
          </div>
          <Text element={{ size: 'xs' }} color="muted">
            You can add other components to the import line above to use them
            together.
          </Text>
        </Stack>
      </Card>

      <Card>
        <Stack spacing="md">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text element={{ size: 'sm' }} weight="semibold">
              Code Editor
            </Text>
            <Button size="sm" onClick={handleRun}>
              Run
            </Button>
          </div>
          <textarea
            value={code}
            onChange={(e) => handleChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '200px',
              padding: 'var(--azimuth-space-md)',
              border: '1px solid var(--azimuth-color-border)',
              borderRadius: 'var(--azimuth-radius-md)',
              background: 'var(--azimuth-color-bg)',
              color: 'var(--azimuth-color-text)',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: 'var(--azimuth-fs-sm)',
              lineHeight: '1.6',
              resize: 'vertical',
              tabSize: 2,
            }}
            spellCheck={false}
          />
        </Stack>
      </Card>

      {error && (
        <Card style={{ borderColor: 'var(--azimuth-color-error-text)' }}>
          <Text
            element={{ size: 'sm' }}
            style={{ color: 'var(--azimuth-color-error-text)' }}
          >
            {error}
          </Text>
        </Card>
      )}

      <Card>
        <Stack spacing="md">
          <Text element={{ size: 'sm' }} weight="semibold">
            Rendered Output
          </Text>
          <div
            style={{
              padding: 'var(--azimuth-space-lg)',
              border: '1px dashed var(--azimuth-color-border)',
              borderRadius: 'var(--azimuth-radius-md)',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {output || (
              <Text element={{ size: 'sm' }} color="muted">
                Run the code to see the component
              </Text>
            )}
          </div>
        </Stack>
      </Card>
    </Stack>
  );
}
