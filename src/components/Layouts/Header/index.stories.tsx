import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Header } from "./index";

export default {
  component: Header,
  title: "Components/Header",
} as Meta;

const Template: Story = (args) => <Header {...args} />;

export const Default = Template.bind({});

Default.args = {};
