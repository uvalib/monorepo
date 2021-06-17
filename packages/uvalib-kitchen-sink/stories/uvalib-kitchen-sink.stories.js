import { html } from 'lit-html';
import '../src/uvalib-kitchen-sink.js';

export default {
  title: 'UvalibKitchenSink',
  component: 'uvalib-kitchen-sink',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <uvalib-kitchen-sink
      style="--uvalib-kitchen-sink-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </uvalib-kitchen-sink>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
