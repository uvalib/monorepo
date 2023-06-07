import { css } from 'lit';

export const SiteFabStyle = css`
  :host {
    --fab-size: 56px;
    --fab-font-size: 24px;
    --fab-bg-color: var(--uvalib-primary-blue, #007BAC);
    --fab-color: var(--uvalib-white, #fff);
    --fab-box-shadow: 0 2px 10px 0 rgba(0,0,0,.1);
  }

  button[part="button"], a[part="button"] {
    width: var(--fab-size);
    height: var(--fab-size);
    padding: 0;
    border-radius: 50%;
    background-color: var(--fab-bg-color);
    color: var(--fab-color);
    font-size: var(--fab-font-size);
    text-align: center;
    box-shadow: var(--fab-box-shadow);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

`;
