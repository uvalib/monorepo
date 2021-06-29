import { html } from 'lit-html';
import '../src/uvalib-aeon.js';

export default {
  title: 'UvalibAeon',
  component: 'uvalib-aeon',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <uvalib-aeon
      style="--uvalib-aeon-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </uvalib-aeon>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
