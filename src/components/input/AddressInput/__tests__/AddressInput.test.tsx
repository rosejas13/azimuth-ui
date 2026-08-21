import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AddressInput } from '../AddressInput';
import type { AddressSuggestion } from '../AddressInput';
import { Form } from '../../Form/Form';

const FULL: AddressSuggestion['value'] = {
  line1: '1600 Amphitheatre Pkwy',
  city: 'Mountain View',
  state: 'CA',
  postalCode: '94043',
  country: 'United States',
};

const SUGGESTIONS: AddressSuggestion[] = [
  {
    label: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
    value: FULL,
  },
  {
    label: '1600 Court Pl, Denver, CO 80202',
    value: {
      line1: '1600 Court Pl',
      city: 'Denver',
      state: 'CO',
      postalCode: '80202',
      country: 'United States',
    },
  },
];

describe('AddressInput', () => {
  describe('multi layout', () => {
    it('renders six structured fields by default', () => {
      render(<AddressInput />);
      const group = screen.getByRole('group');
      expect(group).toBeInTheDocument();
      expect(screen.getByLabelText('Address line 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Address line 2')).toBeInTheDocument();
      expect(screen.getByLabelText('City')).toBeInTheDocument();
      expect(screen.getByLabelText('State / Region')).toBeInTheDocument();
      expect(screen.getByLabelText('Postal code')).toBeInTheDocument();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('renders a group label', () => {
      render(<AddressInput label="Business address" />);
      const group = screen.getByRole('group', { name: 'Business address' });
      expect(group).toBeInTheDocument();
    });

    it('calls onChange with the full structured address on field edit', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<AddressInput value={FULL} onChange={onChange} />);
      await user.type(screen.getByLabelText('City'), 'x');
      expect(onChange).toHaveBeenCalled();
      const last = onChange.mock.calls.at(-1)![0];
      expect(last.city).toBe('Mountain Viewx');
      expect(last.line1).toBe('1600 Amphitheatre Pkwy');
    });

    it('works uncontrolled with defaultValue', async () => {
      const user = userEvent.setup();
      render(<AddressInput defaultValue={FULL} />);
      const city = screen.getByLabelText('City');
      expect(city).toHaveValue('Mountain View');
      await user.type(city, '!');
      expect(city).toHaveValue('Mountain View!');
    });

    it('renders the error once with role alert', () => {
      render(<AddressInput error="Address not found" />);
      expect(screen.getAllByRole('alert')).toHaveLength(1);
      expect(screen.getByRole('alert')).toHaveTextContent('Address not found');
    });

    it('marks non-optional fields required when required', () => {
      render(<AddressInput required />);
      expect(screen.getByLabelText('Address line 1')).toBeRequired();
      expect(screen.getByLabelText('Address line 2')).not.toBeRequired();
    });

    it('disables all fields', () => {
      render(<AddressInput disabled />);
      expect(screen.getByLabelText('City')).toBeDisabled();
      expect(screen.getByLabelText('Country')).toBeDisabled();
    });

    it('inherits size from a wrapping Form', () => {
      render(
        <Form size="lg">
          <AddressInput />
        </Form>,
      );
      const wrapper = screen
        .getByLabelText('City')
        .closest('[class*="wrapper"]');
      expect(wrapper?.className).toContain('lg');
    });
  });

  describe('single layout', () => {
    it('renders one search field, no structured fields', () => {
      render(<AddressInput layout="single" />);
      expect(screen.queryByLabelText('City')).toBeNull();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('fires onSearch on each keystroke', async () => {
      const onSearch = vi.fn();
      const user = userEvent.setup();
      render(<AddressInput layout="single" onSearch={onSearch} />);
      await user.type(screen.getByRole('textbox'), '16');
      expect(onSearch).toHaveBeenCalledWith('1');
      expect(onSearch).toHaveBeenCalledWith('16');
    });

    it('shows suggestions and applies the chosen structured value', async () => {
      const onChange = vi.fn();
      const onSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <AddressInput
          layout="single"
          onChange={onChange}
          suggestions={{ options: SUGGESTIONS, onSelect }}
        />,
      );
      const box = screen.getByRole('combobox');
      await user.type(box, '1600 Am');
      const option = screen.getByRole('option', {
        name: '1600 Amphitheatre Pkwy, Mountain View, CA 94043',
      });
      await user.click(option);
      expect(onSelect).toHaveBeenCalledWith(SUGGESTIONS[0]);
      const last = onChange.mock.calls.at(-1)![0];
      expect(last.city).toBe('Mountain View');
      expect(last.postalCode).toBe('94043');
    });

    it('applies defaultValue to the single field', () => {
      render(<AddressInput layout="single" defaultValue={FULL} />);
      expect(screen.getByRole('textbox')).toHaveValue('1600 Amphitheatre Pkwy');
    });
  });

  describe('plug-and-play', () => {
    it('is fully functional with no props at all', () => {
      render(<AddressInput />);
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByLabelText('City')).toHaveValue('');
    });

    it('switching layout preserves the current value', () => {
      const { rerender } = render(<AddressInput layout="multi" value={FULL} />);
      rerender(<AddressInput layout="single" value={FULL} />);
      expect(screen.getByRole('textbox')).toHaveValue('1600 Amphitheatre Pkwy');
    });

    it('falls back to internal state when value is removed mid-flight', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <AddressInput layout="multi" value={FULL} onChange={() => {}} />,
      );
      rerender(<AddressInput layout="multi" onChange={() => {}} />);
      const city = screen.getByLabelText('City');
      // value removed → component keeps its last synced internal state
      expect(city).toHaveValue('Mountain View');
      await user.type(city, '!');
      expect(city).toHaveValue('Mountain View!');
    });

    it('renders error exactly once in single layout', () => {
      render(<AddressInput layout="single" error="Address not found" />);
      expect(screen.getAllByRole('alert')).toHaveLength(1);
    });

    it('marks fields aria-invalid and describes the group error in multi layout', () => {
      render(<AddressInput error="Invalid address" />);
      expect(screen.getByLabelText('City')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
      expect(screen.getByLabelText('City')).toHaveAttribute('aria-describedby');
    });

    it('wires name attributes for native form serialization', () => {
      render(<AddressInput name="site" />);
      expect(screen.getByLabelText('City')).toHaveAttribute(
        'name',
        'site.city',
      );
      expect(screen.getByLabelText('Postal code')).toHaveAttribute(
        'name',
        'site.postalCode',
      );
    });
  });
});
