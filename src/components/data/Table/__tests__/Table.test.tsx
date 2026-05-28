import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Table } from '../Table';

describe('Table', () => {
  it('renders children', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Name</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('applies striped class', () => {
    render(
      <Table striped>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('table')?.className).toContain('striped');
  });

  it('applies bordered class', () => {
    render(
      <Table bordered>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('table')?.className).toContain('bordered');
  });

  it('applies hoverable class', () => {
    render(
      <Table hoverable>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('table')?.className).toContain('hoverable');
  });

  it('applies custom className', () => {
    render(
      <Table className="my-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('.my-table')).toBeInTheDocument();
  });

  it('applies size sm', () => {
    render(
      <Table size="sm">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('table')?.className).toContain('sm');
  });

  it('renders thead with th elements', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Col A</Table.HeadCell>
            <Table.HeadCell>Col B</Table.HeadCell>
          </Table.Row>
        </Table.Head>
      </Table>,
    );
    expect(screen.getByText('Col A').tagName).toBe('TH');
    expect(screen.getByText('Col B').tagName).toBe('TH');
  });

  it('renders tbody with td elements', () => {
    render(
      <Table>
        <Table.Body>
          <Table.Row>
            <Table.Cell>A</Table.Cell>
            <Table.Cell>B</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText('A').tagName).toBe('TD');
    expect(screen.getByText('B').tagName).toBe('TD');
  });

  it('renders all variants combined', () => {
    const { container } = render(
      <Table striped bordered hoverable size="sm">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Item</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    const table = container.querySelector('table');
    expect(table?.className).toContain('striped');
    expect(table?.className).toContain('bordered');
    expect(table?.className).toContain('hoverable');
    expect(table?.className).toContain('sm');
  });

  it('sub-components accept custom className', () => {
    render(
      <Table>
        <Table.Head className="head-class">
          <Table.Row className="row-class">
            <Table.HeadCell className="headcell-class">H</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body className="body-class">
          <Table.Row className="row-class2">
            <Table.Cell className="cell-class">D</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(document.querySelector('.head-class')).toBeInTheDocument();
    expect(document.querySelector('.body-class')).toBeInTheDocument();
    expect(document.querySelector('.row-class')).toBeInTheDocument();
    expect(document.querySelector('.headcell-class')).toBeInTheDocument();
    expect(document.querySelector('.cell-class')).toBeInTheDocument();
  });
});
