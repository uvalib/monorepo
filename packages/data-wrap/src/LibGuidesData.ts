import { GeneralData } from './GeneralData.js';

export class LibGuidesData extends GeneralData {
  protected readonly libGuidesAPIURL = 'https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/libguides-proxy?';

  async fetchData(params?: { limit?: number }) {
    return fetch(`${this.libGuidesAPIURL}q=${this.query}`)
      .then((r) => r.json())
      .then((d) => {
        this.meta.url = d.data.fulllink;
        this.parseResults(d.data.results);
        return {
          items: this.items.slice(0, params && params.limit ? params.limit : this.limit),
          meta: this.meta,
        };
      });
  }

  // Just putting this here in case we need to adjust the markup returned here
  protected descriptionMarkupFix(data: string) {
    return data;
  }

  protected parseResults(data: string) {
    const detachedDiv = document.createElement('div');
    detachedDiv.innerHTML = data;
    const resultNodes = detachedDiv.querySelectorAll('.s-srch-result');
    this.items = Array.from(resultNodes).map((node) => ({
      title: node.querySelector('.s-srch-result-title')?.innerHTML.replace(/\s\s/g, ' '),
      description: this.descriptionMarkupFix(
        node.querySelectorAll('.s-srch-result-meta')[1]?.innerHTML.replace(/\s\s/g, ' ')
      ),
      link: '',
    })).slice(0);

    detachedDiv.remove();
  }
}
