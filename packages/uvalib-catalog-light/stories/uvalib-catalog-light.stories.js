import { html } from 'lit-html';
import '../src/uvalib-catalog-light.js';

export default {
  title: 'UvalibCatalogLight',
  component: 'uvalib-catalog-light',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <uvalib-catalog-light
      style="--uvalib-catalog-light-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </uvalib-catalog-light>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
