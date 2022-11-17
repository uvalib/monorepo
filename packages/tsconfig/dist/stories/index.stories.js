import { html } from 'lit';
import '../src/bento-box.js';
export default {
    title: 'BentoBox',
    component: 'bento-box',
    argTypes: {
        title: { control: 'text' },
        counter: { control: 'number' },
        textColor: { control: 'color' },
    },
};
const Template = ({ title = 'Hello world', counter = 5, textColor, slot, }) => html `
  <bento-box
    style="--bento-box-text-color: ${textColor || 'black'}"
    .title=${title}
    .counter=${counter}
  >
    ${slot}
  </bento-box>
`;
export const Regular = Template.bind({});
export const CustomTitle = Template.bind({});
CustomTitle.args = {
    title: 'My title',
};
export const CustomCounter = Template.bind({});
CustomCounter.args = {
    counter: 123456,
};
export const SlottedContent = Template.bind({});
SlottedContent.args = {
    slot: html `<p>Slotted content</p>`,
};
SlottedContent.argTypes = {
    slot: { table: { disable: true } },
};
//# sourceMappingURL=index.stories.js.map