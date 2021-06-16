import { html } from 'lit-html';
import '../uvalib-logos.js';

export default {
  title: 'wc-logos',
  component: 'uvalib-logos',
  argTypes: {
  },
};

function Template({  }) {
  return html`
    <uvalib-logos></uvalib-logos>
  `;
}

export const Regular = Template.bind({});
