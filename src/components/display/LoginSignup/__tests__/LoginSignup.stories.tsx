import type { Meta, StoryObj } from '@storybook/react';
import { LoginSignup } from '../LoginSignup';

const meta: Meta<typeof LoginSignup> = {
  title: 'Components/LoginSignup',
  component: LoginSignup,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginSignup>;

export const DefaultLogin: Story = {
  args: {
    defaultView: 'login',
    auth: {
      onLogin: (data) => console.log('Login:', data),
      onSignup: (data) => console.log('Signup:', data),
    },
  },
};

export const SignupView: Story = {
  args: {
    defaultView: 'signup',
    auth: {
      onLogin: (data) => console.log('Login:', data),
      onSignup: (data) => console.log('Signup:', data),
    },
  },
};

export const WithSocialProviders: Story = {
  args: {
    defaultView: 'login',
    auth: {
      onLogin: (data) => console.log('Login:', data),
    },
    social: {
      providers: [
        { id: 'github', label: 'GitHub', color: '#24292e' },
        { id: 'google', label: 'Google', color: '#4285F4' },
      ],
      onProviderAuth: (id) => console.log('Provider:', id),
    },
  },
};

export const WithError: Story = {
  args: {
    defaultView: 'login',
    auth: {
      onLogin: (data) => console.log('Login:', data),
    },
    status: {
      error: 'Invalid email or password. Please try again.',
    },
  },
};

export const Loading: Story = {
  args: {
    defaultView: 'login',
    auth: {
      onLogin: (data) => console.log('Login:', data),
    },
    status: {
      loading: true,
    },
  },
};
