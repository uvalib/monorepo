import { html, TemplateResult } from 'lit';
import '../src/site-button.js';

export default {
  title: 'SiteButton',
  component: 'site-button',
  argTypes: {
    label: { control: 'text' },
    alt: { control: 'boolean' },
    basic: { control: 'boolean' },
    subtle: { control: 'boolean' },
    outline: { control: 'boolean' },
    inverse: { control: 'boolean' },
    small: { control: 'boolean' },
    large: { control: 'boolean' },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    visited: { control: 'boolean' },
    hovered: { control: 'boolean' },
    activated: { control: 'boolean' }
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label?: string;
  alt?: boolean;
  basic?: boolean;
  subtle?: boolean;
  outline?: boolean;
  inverse?: boolean;
  small?: boolean;
  large?: boolean;
  disabled?: boolean;
  href?: string;
  visited?: boolean;
  hovered?: boolean;
  activated?: boolean;
  slot?: TemplateResult;
}

const Template: Story<ArgTypes> = ({
  label = 'Click me!',
  alt = false,
  basic = false,
  subtle = false,
  outline = false,
  inverse = false,
  small = false,
  large = false,
  disabled = false,
  href = '',
  visited = false,
  hovered = false,
  activated = false,
  slot,
}: ArgTypes) => html`
  <site-button
    label=${label}
    ?alt=${alt}
    ?basic=${basic}
    ?subtle=${subtle}
    ?outline=${outline}
    ?inverse=${inverse}
    ?small=${small}
    ?large=${large}
    ?disabled=${disabled}
    href=${href}
    ?visited=${visited}
    ?hovered=${hovered}
    ?activated=${activated}
  >
    ${slot}
  </site-button>
`;

export const Regular = Template.bind({});

export const LargeAlt = Template.bind({});
LargeAlt.args = {
  label: 'Large Alt Button',
  alt: true,
  large: true
};

export const SmallSubtle = Template.bind({});
SmallSubtle.args = {
  label: 'Small Subtle Button',
  subtle: true,
  small: true
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Button',
  disabled: true
};

export const AsLink = Template.bind({});
AsLink.args = {
  label: 'Go to OpenAI',
  href: 'https://www.openai.com'
};
