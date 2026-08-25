import type { Meta, StoryObj } from '@storybook/react';
import { DescriptionList } from '../DescriptionList';

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Default: Story = {
  render: () => (
    <DescriptionList>
      <DescriptionList.Item term="Region">us-east-1</DescriptionList.Item>
      <DescriptionList.Item term="Runtime">Node 22 LTS</DescriptionList.Item>
      <DescriptionList.Item term="Deployed">Aug 24, 2026</DescriptionList.Item>
    </DescriptionList>
  ),
};

export const Bordered: Story = {
  render: () => (
    <DescriptionList bordered>
      <DescriptionList.Item term="CPU">4 vCPU</DescriptionList.Item>
      <DescriptionList.Item term="Memory">16 GB</DescriptionList.Item>
      <DescriptionList.Item term="Storage">256 GB SSD</DescriptionList.Item>
    </DescriptionList>
  ),
};
