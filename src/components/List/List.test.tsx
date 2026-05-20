import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { List } from './List';

describe('List', () => {
  it('renders ul by default', () => {
    render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(document.querySelector('ul')).toBeInTheDocument();
  });

  it('renders ol when ordered', () => {
    render(
      <List ordered>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    );
    expect(document.querySelector('ol')).toBeInTheDocument();
  });

  it('applies bulleted class', () => {
    render(
      <List bulleted>
        <List.Item>Item 1</List.Item>
      </List>,
    );
    expect(document.querySelector('.bulleted')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <List className="my-list">
        <List.Item>Item</List.Item>
      </List>,
    );
    expect(document.querySelector('.my-list')).toBeInTheDocument();
  });

  it('renders List.Item with custom className', () => {
    render(
      <List>
        <List.Item className="my-item">Item</List.Item>
      </List>,
    );
    expect(document.querySelector('.my-item')).toBeInTheDocument();
  });

  it('renders li elements', () => {
    render(
      <List>
        <List.Item>Item 1</List.Item>
        <List.Item>Item 2</List.Item>
      </List>,
    );
    expect(document.querySelectorAll('li').length).toBe(2);
  });

  it('applies spacing class', () => {
    render(
      <List spacing="lg">
        <List.Item>Item</List.Item>
      </List>,
    );
    expect(document.querySelector('.lg')).toBeInTheDocument();
  });

  it('does not render bulleted by default', () => {
    render(
      <List>
        <List.Item>Item</List.Item>
      </List>,
    );
    expect(document.querySelector('.bulleted')).toBeNull();
  });

  it('renders nested lists', () => {
    render(
      <List>
        <List.Item>
          Parent
          <List>
            <List.Item>Child</List.Item>
          </List>
        </List.Item>
      </List>,
    );
    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
