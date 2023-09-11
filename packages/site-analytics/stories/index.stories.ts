import { html, TemplateResult } from 'lit';
import '../src/site-analytics.js';

export default {
  title: 'SiteAnalytics',
  component: 'site-analytics',
  argTypes: {
    matomoURL: { control: 'text' },
    matomoId: { control: 'number' },
    spa: { control: 'boolean' },
    variables: { control: 'object' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  matomoURL?: string;
  matomoId?: number;
  spa?: boolean;
  variables?: Record<string, string>;
}

const Template: Story<ArgTypes> = ({
  matomoURL = 'https://analytics.lib.virginia.edu/',
  matomoId = 23,
  spa = false,
  variables = { "1": "foo", "2": "bar" },
}: ArgTypes) => html`
  <site-analytics
    .matomoURL=${matomoURL}
    .matomoId=${matomoId}
    .spa=${spa}
    .variables=${variables}
  ></site-analytics>
`;

export const Regular = Template.bind({});

export const WithSPA = Template.bind({});
WithSPA.args = {
  spa: true,
};

export const CustomVariables = Template.bind({});
CustomVariables.args = {
  variables: { "1": "customFoo", "2": "customBar" },
};
