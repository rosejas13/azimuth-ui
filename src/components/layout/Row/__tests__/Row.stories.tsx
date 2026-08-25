import type { Meta, StoryObj } from '@storybook/react';
import { Row } from '../Row';
import { Form } from '../../../input/Form';
import { Input } from '../../../input/Input';

const meta: Meta<typeof Row> = {
  title: 'Components/Row',
  component: Row,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Row>;

export const InForm: Story = {
  render: () => (
    <Form onSubmit={(data) => console.log(data)}>
      <Row gap="sm">
        <Input label="First name" name="firstName" placeholder="Ada" />
        <Input label="Middle initial" name="middleInitial" placeholder="M" />
        <Input label="Last name" name="lastName" placeholder="Lovelace" />
      </Row>
    </Form>
  ),
};
