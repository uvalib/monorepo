import { css } from 'lit-element';
export default css`
  @import url('https://use.typekit.net/tgy5tlj.css');
  :host {
    display: block;
    font-family: franklin-gothic-urw, arial, sans-serif;
    font-weight: 500;
    margin: 0;
    padding: 0;
    width: 100%;
  }
  header {
    background-color: #232d4b;
    color: #fff;
    flex-direction: column;
    height: 60px;
    margin: 0;
    padding: 0;
  }
  #container,
  header {
    align-items: center;
    display: flex;
  }
  #container {
    flex-direction: row;
    max-width: 1200px;
    width: 100%;
  }
  #container a {
    padding: 0.625em;
  }
  .spacer {
    flex: 1;
  }
  uvalib-icon {
    fill: #fff;
  }
  a,
  a:link,
  a:visited {
    color: inherit;
  }
  /*# sourceMappingURL=src/UvalibHeader.css.map */
`;
