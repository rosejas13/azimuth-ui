'use client';

import {
  type InputHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './PhoneInput.module.css';

/** A country code entry in the phone input selector. */
export interface CountryCode {
  /** Dialing code, e.g. "+1" */
  code: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "US" */
  country: string;
  /** Full country name, e.g. "United States" */
  label: string;
}

/** Props for the PhoneInput component. */
export interface PhoneInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'defaultValue'
> {
  /** Label displayed above the input. */
  label?: string;
  /** Controlled value. */
  value?: { code: string; number: string };
  /** Uncontrolled initial value. */
  defaultValue?: { code: string; number: string };
  /** Called when the code or number changes. */
  onChange?: (value: { code: string; number: string }) => void;
  /** Error message displayed below the input. */
  error?: string;
  /** Help text displayed below the input. */
  helpText?: string;
  /** ISO 3166-1 alpha-2 default country code. @default 'US' */
  defaultCountry?: string;
}

const COUNTRIES: CountryCode[] = [
  { code: '+1', country: 'US', label: 'United States' },
  { code: '+44', country: 'GB', label: 'United Kingdom' },
  { code: '+1', country: 'CA', label: 'Canada' },
  { code: '+61', country: 'AU', label: 'Australia' },
  { code: '+49', country: 'DE', label: 'Germany' },
  { code: '+33', country: 'FR', label: 'France' },
  { code: '+39', country: 'IT', label: 'Italy' },
  { code: '+34', country: 'ES', label: 'Spain' },
  { code: '+31', country: 'NL', label: 'Netherlands' },
  { code: '+55', country: 'BR', label: 'Brazil' },
  { code: '+52', country: 'MX', label: 'Mexico' },
  { code: '+81', country: 'JP', label: 'Japan' },
  { code: '+86', country: 'CN', label: 'China' },
  { code: '+91', country: 'IN', label: 'India' },
  { code: '+82', country: 'KR', label: 'South Korea' },
  { code: '+65', country: 'SG', label: 'Singapore' },
  { code: '+64', country: 'NZ', label: 'New Zealand' },
  { code: '+353', country: 'IE', label: 'Ireland' },
  { code: '+46', country: 'SE', label: 'Sweden' },
  { code: '+47', country: 'NO', label: 'Norway' },
  { code: '+45', country: 'DK', label: 'Denmark' },
  { code: '+358', country: 'FI', label: 'Finland' },
  { code: '+41', country: 'CH', label: 'Switzerland' },
  { code: '+43', country: 'AT', label: 'Austria' },
  { code: '+32', country: 'BE', label: 'Belgium' },
  { code: '+351', country: 'PT', label: 'Portugal' },
  { code: '+48', country: 'PL', label: 'Poland' },
  { code: '+7', country: 'RU', label: 'Russia' },
  { code: '+27', country: 'ZA', label: 'South Africa' },
  { code: '+971', country: 'AE', label: 'United Arab Emirates' },
  { code: '+972', country: 'IL', label: 'Israel' },
  { code: '+90', country: 'TR', label: 'Turkey' },
  { code: '+54', country: 'AR', label: 'Argentina' },
  { code: '+57', country: 'CO', label: 'Colombia' },
  { code: '+56', country: 'CL', label: 'Chile' },
];

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

function findCountry(iso: string): CountryCode | undefined {
  return COUNTRIES.find((c) => c.country === iso.toUpperCase());
}

/** A phone input with a country code selector dropdown. */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      value,
      defaultValue,
      onChange,
      error,
      helpText,
      defaultCountry = 'US',
      className,
      id,
      disabled,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const defaultCode = useMemo(
      () => findCountry(defaultCountry)?.code ?? '+1',
      [defaultCountry],
    );
    const [selectedCode, setSelectedCode] = useState(
      value?.code ?? defaultValue?.code ?? defaultCode,
    );
    const [phoneNumber, setPhoneNumber] = useState(
      value?.number ?? defaultValue?.number ?? '',
    );
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isControlled = value !== undefined;

    useEffect(() => {
      if (isControlled) {
        setSelectedCode(value.code);
        setPhoneNumber(value.number);
      }
    }, [isControlled, value]);

    useEffect(() => {
      if (isOpen) {
        setSearchQuery('');
        setHighlightedIndex(-1);
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      const handleClick = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const filteredCountries = useMemo(
      () =>
        COUNTRIES.filter(
          (c) =>
            c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.includes(searchQuery) ||
            c.country.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      [searchQuery],
    );

    const handleCodeSelect = useCallback(
      (code: string) => {
        setSelectedCode(code);
        setIsOpen(false);
        onChange?.({ code, number: phoneNumber });
      },
      [phoneNumber, onChange],
    );

    const handleNumberChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value;
        setPhoneNumber(newNumber);
        onChange?.({ code: selectedCode, number: newNumber });
      },
      [selectedCode, onChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!isOpen || filteredCountries.length === 0) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredCountries.length - 1 ? prev + 1 : 0,
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCountries.length - 1,
          );
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          e.preventDefault();
          handleCodeSelect(filteredCountries[highlightedIndex].code);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      },
      [isOpen, filteredCountries, highlightedIndex, handleCodeSelect],
    );

    const currentCountry = COUNTRIES.find((c) => c.code === selectedCode);
    const flagEmoji = currentCountry
      ? getFlagEmoji(currentCountry.country)
      : undefined;

    const generatedId =
      id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn(styles.wrapper, error && styles.hasError, className)}>
        {label && (
          <label htmlFor={generatedId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.inputRow}>
          <div className={styles.countrySelector}>
            <button
              ref={buttonRef}
              type="button"
              className={styles.countryButton}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-label="Country code"
              disabled={disabled}
            >
              {flagEmoji && (
                <span aria-hidden="true" className={styles.flag}>
                  {flagEmoji}
                </span>
              )}
              <span>{selectedCode}</span>
              <span
                className={cn(styles.chevron, isOpen && styles.chevronOpen)}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div
                ref={dropdownRef}
                className={styles.dropdown}
                role="listbox"
                aria-label="Select country code"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  aria-label="Search countries"
                />
                <div className={styles.countryList}>
                  {filteredCountries.length === 0 ? (
                    <div className={styles.noResults}>No countries found</div>
                  ) : (
                    filteredCountries.map((country, i) => (
                      <button
                        key={country.country}
                        type="button"
                        className={cn(
                          styles.countryOption,
                          i === highlightedIndex &&
                            styles.countryOptionHighlighted,
                        )}
                        onClick={() => handleCodeSelect(country.code)}
                        role="option"
                        aria-selected={country.code === selectedCode}
                      >
                        <span>{getFlagEmoji(country.country)}</span>
                        <span>{country.label}</span>
                        <span className={styles.countryOptionCode}>
                          {country.code}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <input
            ref={ref}
            id={generatedId}
            type="tel"
            className={styles.phoneInput}
            value={phoneNumber}
            onChange={handleNumberChange}
            disabled={disabled}
            placeholder={placeholder || 'Phone number'}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={
              error
                ? `${generatedId}-error`
                : helpText
                  ? `${generatedId}-help`
                  : undefined
            }
            {...props}
          />
        </div>

        <div className={styles.footerArea}>
          {error && (
            <span
              id={`${generatedId}-error`}
              className={styles.errorMessage}
              role="alert"
            >
              {error}
            </span>
          )}
          {helpText && !error && (
            <span id={`${generatedId}-help`} className={styles.helpText}>
              {helpText}
            </span>
          )}
        </div>
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
