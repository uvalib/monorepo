import { html } from 'lit-html';
import '../src/uvalib-catalog-lite.js';

export default {
  title: 'UvalibCatalogLite',
  component: 'uvalib-catalog-lite',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <uvalib-catalog-lite
      style="--uvalib-catalog-lite-background-color: ${backgroundColor ||
      'white'}"
      .title=${title}
    >
    </uvalib-catalog-lite>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
