'use client';

import {
  type ComponentPropsWithoutRef,
  type FormEvent,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { cn } from '@/utils/cn';
import styles from './LoginSignup.module.css';

export type AuthView = 'login' | 'signup' | 'reset';

export interface AuthProvider {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

export interface LoginSignupProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onSubmit'> {
  /** @default 'login' */
  defaultView?: AuthView;
  providers?: AuthProvider[];
  onLogin?: (data: {
    email: string;
    password: string;
    remember?: boolean;
  }) => void;
  onSignup?: (data: {
    name?: string;
    email: string;
    password: string;
  }) => void;
  onResetPassword?: (data: { email: string }) => void;
  onProviderAuth?: (providerId: string) => void;
  /** @default false */
  loading?: boolean;
  error?: string;
}

const VIEWS: { key: AuthView; label: string }[] = [
  { key: 'login', label: 'Log in' },
  { key: 'signup', label: 'Sign up' },
];

export const LoginSignup = forwardRef<HTMLDivElement, LoginSignupProps>(
  (
    {
      defaultView = 'login',
      providers,
      onLogin,
      onSignup,
      onResetPassword,
      onProviderAuth,
      loading = false,
      error,
      className,
      ...props
    },
    ref,
  ) => {
    const [view, setView] = useState<AuthView>(defaultView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [remember, setRemember] = useState(false);

    const handleSubmit = useCallback(
      (e: FormEvent) => {
        e.preventDefault();
        if (view === 'login') {
          onLogin?.({ email, password, remember });
        } else if (view === 'signup') {
          onSignup?.({ name: name || undefined, email, password });
        } else if (view === 'reset') {
          onResetPassword?.({ email });
        }
      },
      [view, email, password, name, remember, onLogin, onSignup, onResetPassword],
    );

    return (
      <div ref={ref} className={cn(styles.root, className)} {...props}>
        {view !== 'reset' && (
          <div className={styles.tabs} role="tablist" aria-label="Authentication">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                id={`auth-tab-${v.key}`}
                type="button"
                role="tab"
                className={cn(
                  styles.tab,
                  view === v.key && styles.tabActive,
                )}
                aria-selected={view === v.key}
                aria-controls="auth-panel"
                onClick={() => setView(v.key)}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div
          id="auth-panel"
          role="tabpanel"
          aria-labelledby={`auth-tab-${view}`}
        >
          <form
            className={styles.form}
            onSubmit={handleSubmit}
            aria-label={
              view === 'login'
                ? 'Log in'
                : view === 'signup'
                  ? 'Sign up'
                  : 'Reset password'
            }
            noValidate
          >
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}

          {view === 'reset' && (
            <p
              style={{
                margin: 0,
                fontSize: 'var(--azimuth-fs-sm)',
                color: 'var(--azimuth-color-text-secondary)',
              }}
            >
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          )}

          {view === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-name">
                Name
              </label>
              <input
                id="auth-name"
                className={styles.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              className={styles.input}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          {view !== 'reset' && (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                className={styles.input}
                type="password"
                required
                autoComplete={
                  view === 'login' ? 'current-password' : 'new-password'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          )}

          {view === 'login' && (
            <div className={styles.row}>
              <div className={styles.checkboxRow}>
                <input
                  id="auth-remember"
                  className={styles.checkbox}
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className={styles.checkboxLabel} htmlFor="auth-remember">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className={styles.link}
                onClick={() => setView('reset')}
              >
                Forgot password?
              </button>
            </div>
          )}

          {view === 'reset' && (
            <button
              type="button"
              className={styles.link}
              style={{ alignSelf: 'flex-start' }}
              onClick={() => setView('login')}
            >
              &larr; Back to log in
            </button>
          )}

          <button
            type="submit"
            className={styles.submit}
            disabled={loading}
          >
            {loading && <span className={styles.spinner} />}
            {view === 'login'
              ? 'Log in'
              : view === 'signup'
                ? 'Sign up'
                : 'Send reset link'}
          </button>
        </form>
      </div>

        {providers && providers.length > 0 && (
          <div className={styles.providers}>
            <span className={styles.providersLabel}>
              Or continue with
            </span>
            {providers.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={styles.providerBtn}
                onClick={() => onProviderAuth?.(provider.id)}
                style={
                  provider.color
                    ? { borderColor: provider.color, color: provider.color }
                    : undefined
                }
              >
                <span aria-hidden="true">{provider.icon}</span>
                {provider.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

LoginSignup.displayName = 'LoginSignup';
