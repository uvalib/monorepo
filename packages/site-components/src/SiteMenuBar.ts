import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import '@vaadin/menu-bar';

export class SiteMenuBar extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--site-components-text-color, #000);
    }
  `;

  @property({ type: Object }) items = [
    { text: 'View', href:"https://google.com" },
    { text: 'Edit' },
    {
      text: 'Share',
      children: [
        {
          text: 'On social media',
          children: [{ text: 'Facebook' }, { text: 'Twitter' }, { text: 'Instagram' }],
        },
        { text: 'By email' },
        { text: 'Get link' },
      ],
    },
    {
      text: 'Move',
      children: [{ text: 'To folder' }, { text: 'To trash' }],
    },
    { text: 'Duplicate' },
  ];

  @property({ type: Number }) counter = 5;

  itemSelected(e: any) {
    if (e.detail.value.href) 
      window.location = e.detail.value.href;
  }

  render() {
    return html`
      <vaadin-menu-bar .items="${this.items}" @item-selected="${this.itemSelected}"></vaadin-menu-bar>
    `;
  }

  
}
