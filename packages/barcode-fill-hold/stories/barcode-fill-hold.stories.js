import { html } from 'lit-html';
import '../src/barcode-fill-hold.js';

export default {
  title: 'BarcodeFillHold',
  component: 'barcode-fill-hold',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <barcode-fill-hold
      style="--barcode-fill-hold-background-color: ${backgroundColor ||
      'white'}"
      .title=${title}
    >
    </barcode-fill-hold>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
