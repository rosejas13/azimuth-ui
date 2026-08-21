'use client';

import { forwardRef, useEffect, useId, useState } from 'react';
import { cn } from '@/utils/cn';
import { Input } from '../Input/Input';
import { useInputConfig } from '../input-config';
import styles from './AddressInput.module.css';

/** A structured postal address. `line2` is optional; the rest are required for a complete address. */
export interface AddressValue {
  /** Street line 1, e.g. "1600 Amphitheatre Pkwy". */
  line1: string;
  /** Apartment, suite, unit — optional second line. */
  line2?: string;
  /** City / locality. */
  city: string;
  /** State / province / region. */
  state: string;
  /** Postal / ZIP code. */
  postalCode: string;
  /** Country name or code. */
  country: string;
}

/** A single address suggestion. `label` is the formatted address shown to the user. */
export interface AddressSuggestion {
  /** Formatted one-line display string, e.g. "1600 Amphitheatre Pkwy, Mountain View, CA 94043". Labels should be unique — the selected suggestion is resolved by label. */
  label: string;
  /** The structured address to apply when this suggestion is selected. */
  value: AddressValue;
}

/** Props for the AddressInput component. */
export interface AddressInputProps {
  /** Controlled address. Pair with `onChange`. When omitted the input is uncontrolled. */
  value?: AddressValue;
  /** Initial address for uncontrolled use. */
  defaultValue?: AddressValue;
  /** Called with the full address on every field change or suggestion selection. */
  onChange?: (value: AddressValue) => void;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;

  /** Label for the whole address group. @default 'Address' */
  label?: string;
  /** Helper text rendered below the label. */
  subtitle?: string;
  /** Validation error rendered once below the fields and associated with them. */
  error?: string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';

  /**
   * `multi` renders structured fields (line1, line2, city, state, postal code, country).
   * `single` renders one combined search field intended for use with `suggestions`.
   * The value shape is identical either way.
   * @default 'multi'
   */
  layout?: 'single' | 'multi';

  /**
   * Address suggestions shown while typing (single layout). azimuth never fetches
   * these for you — supply them from your own geocoding service and own the
   * attribution its license requires.
   *
   * ToS note: the public nominatim.openstreetmap.org endpoint forbids autocomplete
   * use and caps at 1 request/second for ALL your users combined — do not wire
   * it to `onSearch`. Use a self-hosted Nominatim instance, Photon, or a
   * commercial provider instead.
   */
  suggestions?: {
    options: AddressSuggestion[];
    /** Called with the full chosen suggestion. */
    onSelect?: (suggestion: AddressSuggestion) => void;
  };

  /** Fired on each keystroke in `single` layout so the consumer can run their (debounced) lookup. */
  onSearch?: (query: string) => void;

  /**
   * Base name for the fields. In `multi` layout each input gets `${name}.line1`,
   * `${name}.city`, etc.; in `single` layout the field is `${name}.line1`.
   * Without a `name`, the address is omitted from native form serialization.
   */
  name?: string;

  /** Styling for the underlying group element. */
  className?: string;
  /** Placeholder for the single-layout search field. */
  placeholder?: string;
  id?: string;
}

const EMPTY_ADDRESS: AddressValue = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const FIELDS: Array<{
  key: keyof AddressValue;
  label: string;
  optional?: boolean;
}> = [
  { key: 'line1', label: 'Address line 1' },
  { key: 'line2', label: 'Address line 2', optional: true },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State / Region' },
  { key: 'postalCode', label: 'Postal code' },
  { key: 'country', label: 'Country' },
];

/**
 * An address input with single-line (search) and multi-line (structured) layouts.
 * The value is always a structured `AddressValue`, whichever layout is used.
 * Suggestion data is injected by the consumer — azimuth ships no geocoding client.
 */
export const AddressInput = forwardRef<HTMLFieldSetElement, AddressInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      disabled = false,
      required = false,
      label,
      subtitle,
      error,
      size,
      layout = 'multi',
      suggestions,
      onSearch,
      name,
      className,
      placeholder,
      id,
    },
    ref,
  ) => {
    const { size: configSize } = useInputConfig();
    const resolvedSize = size ?? configSize ?? 'md';
    const generatedId = useId();
    const groupId = id || generatedId;
    const errorId = `${groupId}-error`;
    const subtitleId = `${groupId}-subtitle`;

    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<AddressValue>(
      () => defaultValue ?? EMPTY_ADDRESS,
    );

    useEffect(() => {
      if (value !== undefined) {
        setInternal(value);
      }
    }, [value]);

    const current = isControlled ? value : internal;

    const setValue = (next: AddressValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const setField = (field: keyof AddressValue, fieldValue: string) => {
      if (!isControlled) {
        setInternal((prev) => ({ ...prev, [field]: fieldValue }));
      }
      onChange?.({ ...current, [field]: fieldValue });
    };

    return (
      <fieldset
        ref={ref}
        className={cn(styles.group, className)}
        disabled={disabled}
      >
        {label && (
          <legend
            className={cn(
              styles.groupLabel,
              required && styles.groupLabelRequired,
            )}
          >
            {label}
            {required && (
              <span className={styles.requiredIndicator} aria-hidden="true">
                {' *'}
              </span>
            )}
          </legend>
        )}
        {subtitle && (
          <span id={subtitleId} className={styles.subtitle}>
            {subtitle}
          </span>
        )}

        {layout === 'single' ? (
          <Input
            value={current.line1}
            onChange={(query) => {
              setField('line1', query);
              onSearch?.(query);
            }}
            placeholder={placeholder}
            required={required}
            size={resolvedSize}
            name={name ? `${name}.line1` : undefined}
            aria-label={label}
            error={error}
            suggestions={
              suggestions && suggestions.options.length > 0
                ? {
                    options: suggestions.options.map((s) => s.label),
                    filter: false,
                    onSelect: (labelText) => {
                      const chosen = suggestions.options.find(
                        (s) => s.label === labelText,
                      );
                      if (chosen) {
                        setValue(chosen.value);
                        suggestions.onSelect?.(chosen);
                      }
                    },
                  }
                : undefined
            }
          />
        ) : (
          <div className={styles.fields}>
            {FIELDS.map(({ key, label: fieldLabel, optional }) => (
              <Input
                key={key}
                label={fieldLabel}
                value={current[key] ?? ''}
                onChange={(fieldValue) => setField(key, fieldValue)}
                required={required && !optional}
                size={resolvedSize}
                name={name ? `${name}.${key}` : undefined}
                {...(error
                  ? { 'aria-invalid': true, 'aria-describedby': errorId }
                  : {})}
              />
            ))}
          </div>
        )}

        {error && layout === 'multi' && (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </fieldset>
    );
  },
);

AddressInput.displayName = 'AddressInput';
