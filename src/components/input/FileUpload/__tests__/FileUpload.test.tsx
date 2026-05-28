import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../FileUpload';

function createMockFile(name: string, size: number, type = 'text/plain'): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('FileUpload', () => {
  it('renders the drop zone with correct text', () => {
    render(<FileUpload />);
    expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/)).toBeInTheDocument();
  });

  it('renders max file size text', () => {
    render(<FileUpload maxSize={5} />);
    expect(screen.getByText('Max file size: 5 MB')).toBeInTheDocument();
  });

  it('renders accepted file types when accept is provided', () => {
    render(<FileUpload accept=".jpg,.png" />);
    expect(screen.getByText(/: .jpg,.png/)).toBeInTheDocument();
  });

  it('shows multiple files text when multiple is true', () => {
    render(<FileUpload multiple={true} />);
    expect(screen.getByText(/(multiple files allowed)/)).toBeInTheDocument();
  });

  it('shows file list after files are added via drop', () => {
    const file = createMockFile('test.txt', 100);
    render(<FileUpload />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  it('calls onFilesSelected when files are added via drop', () => {
    const onFilesSelected = vi.fn();
    const file = createMockFile('test.txt', 100);
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('removes file when remove button clicked', async () => {
    const onFilesSelected = vi.fn();
    const file = createMockFile('test.txt', 100);
    const user = userEvent.setup();
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Remove test.txt'));
    expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    expect(onFilesSelected).toHaveBeenCalledWith([]);
  });

  it('shows error when file exceeds maxSize', () => {
    const file = createMockFile('bigfile.txt', 11 * 1024 * 1024);
    render(<FileUpload maxSize={10} />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(screen.getByRole('alert')).toHaveTextContent(/exceeds the 10 MB limit/);
  });

  it('shows drag over state when dragging', () => {
    render(<FileUpload />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.dragOver(zone);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('removes drag over state on drag leave', () => {
    render(<FileUpload />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.dragOver(zone);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
    fireEvent.dragLeave(zone);
    expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
  });

  it('handles drag over state class', () => {
    const { container } = render(<FileUpload />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.dragOver(zone);
    expect(container.firstChild).toHaveClass('dragOver');
    fireEvent.dragLeave(zone);
    expect(container.firstChild).not.toHaveClass('dragOver');
  });

  it('handles single file mode (multiple=false)', () => {
    const onFilesSelected = vi.fn();
    const file1 = createMockFile('first.txt', 100);
    const file2 = createMockFile('second.txt', 100);
    render(<FileUpload multiple={false} onFilesSelected={onFilesSelected} />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file1, file2] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file1]);
  });

  it('does not show multiple files text when multiple is false', () => {
    render(<FileUpload multiple={false} />);
    expect(screen.queryByText(/(multiple files allowed)/)).not.toBeInTheDocument();
  });

  it('does not call onFilesSelected when disabled', () => {
    const onFilesSelected = vi.fn();
    const file = createMockFile('test.txt', 100);
    render(<FileUpload onFilesSelected={onFilesSelected} disabled />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('does not show drag over when disabled', () => {
    render(<FileUpload disabled />);
    const zone = screen.getByLabelText('File upload area');
    fireEvent.dragOver(zone);
    expect(screen.getByText('Drag and drop files here')).toBeInTheDocument();
  });

  it('applies disabled class', () => {
    const { container } = render(<FileUpload disabled />);
    expect(container.firstChild).toHaveClass('disabled');
  });

  it('clicking zone triggers file input', async () => {
    const user = userEvent.setup();
    render(<FileUpload />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(screen.getByText('Drag and drop files here'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('does not trigger file input when disabled', async () => {
    const user = userEvent.setup();
    render(<FileUpload disabled />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(screen.getByText('Drag and drop files here'));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('handles file input change', () => {
    const onFilesSelected = vi.fn();
    const file = createMockFile('uploaded.txt', 200);
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
    expect(screen.getByText('uploaded.txt')).toBeInTheDocument();
  });

  it('handles paste from clipboard', () => {
    const onFilesSelected = vi.fn();
    const file = createMockFile('pasted.png', 500, 'image/png');
    render(<FileUpload onFilesSelected={onFilesSelected} />);
    const zone = screen.getByLabelText('File upload area');
    const items = [{ kind: 'file', getAsFile: () => file }];
    fireEvent.paste(zone, { clipboardData: { items } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('applies custom className', () => {
    const { container } = render(<FileUpload className="my-upload" />);
    expect(container.firstChild).toHaveClass('my-upload');
  });
});
