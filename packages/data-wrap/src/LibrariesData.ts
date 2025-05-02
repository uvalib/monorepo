/* eslint-disable camelcase */
import { Library, parse } from './Library.js';
import { DrupalSearchData } from './DrupalSearchData.js';
import { HoursData } from './HoursData.js';

export class LibrariesData extends DrupalSearchData {
  protected type: string = 'library';

  public items: Library[] = [];

  parseResults(n: any) {
    // Setup Library results
    this.items = n.data.map(parse);
  }

  public async getLibrary(id: string, children: boolean = false): Promise<Library | null | undefined> {
    const promise = this.items && this.items.length > 0 ? Promise.resolve(this.items) : this.fetchData();
    return promise
      .then((libs) => {
        if (libs) {
          const lib = this.items.find((lib) => lib.slug === id);
          return lib;
        }
        return null;
      })
      .then((lib) => {
        if (children && lib) return this.getChildren(id).then(() => lib);
        return lib;
      });
  }

  public async getChildren(libId: string) {
    return this.getLibrary(libId).then((lib) => {
      if (lib) {
        if (lib.children) return lib.children;
        // eslint-disable-next-line no-param-reassign
        lib.children = this.items.filter((l) => l.parent === lib.id);
        return lib.children;
      } 
      return null;
    });
  }

  // While individual Library entities should be able to fetch their own hours, we
  // need to be able to make a single api fetch when necessary (to save on network data)
  async fetchHours(start: Date = new Date(), count?: number, hoursIds?: number[]) {
    if (!hoursIds)
      hoursIds = this.items
        .map((lib) => lib.hoursId)
        .filter((id) => id !== null)
        .map((id) => parseInt(<string>id, 10));
    return new HoursData({ ids: hoursIds })
      .fetchHours(start, count)
      .then((hours: any) => {
        this.items.forEach((library) => {
          if (library.hoursId) {
//console.log('hours');
//console.log(hours);            
            const matchingHours = hours.find(
              (h: { id: string | undefined }) => parseInt(<string>h.id, 10) === parseInt(<string>library.hoursId, 10)
            );
            if (matchingHours) {
              library.setHours(matchingHours);
            } else {
              console.warn(`No matching hours found for library with hoursId: ${library.hoursId}`);
            }
          }
        });
      });
  }

  /**
   * Determine if a library is open based on rawDates schedule.
   * @param rawDates Map of ISO date strings to hours info
   * @param now Current Date for evaluation
   */
  public isOpen(rawDates: Record<string, any>, now: Date = new Date()): boolean {
    const timeZone = 'America/New_York';
    // Determine today's date string in Eastern Time (YYYY-MM-DD)
    const dateString = new Intl.DateTimeFormat('en-CA', { timeZone }).format(now);
    // Current time for range comparisons in specified timezone
    const currentTime = new Date(now.toLocaleString('en-US', { timeZone }));
    console.log(`LibrariesData.isOpen: now=${now.toISOString()}, ET dateString=${dateString}, rawDates keys=${Object.keys(rawDates).join(',')}`);
    // Check previous day's hours extending past midnight
    const prevDate = new Date(currentTime);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateString = prevDate.toISOString().split('T')[0];
    const prevInfo = rawDates[prevDateString];
    if (prevInfo) {
      if (prevInfo.status === '24hours') return true;
      if (prevInfo.status === 'open' && Array.isArray(prevInfo.hours)) {
        for (const h of prevInfo.hours) {
          const fm = h.from.replace(/(am|pm)/, ' $1').toUpperCase();
          const tm = h.to.replace(/(am|pm)/, ' $1').toUpperCase();
          const fromDate = new Date(`${prevDateString} ${fm}`);
          const toDate = new Date(`${prevDateString} ${tm}`);
          // extends past midnight
          if (toDate.getHours() <= new Date(`${prevDateString} ${fm}`).getHours()) toDate.setDate(toDate.getDate() + 1);
          if (currentTime >= fromDate && currentTime <= toDate) return true;
        }
      }
    }
    const todayInfo = rawDates[dateString];
    if (!todayInfo) return false;
    // 24-hour open
    if (todayInfo.status === '24hours') return true;
    // open with hours ranges
    if (todayInfo.status === 'open' && Array.isArray(todayInfo.hours)) {
      for (const h of todayInfo.hours) {
        const fm = h.from.replace(/(am|pm)/, ' $1').toUpperCase();
        const tm = h.to.replace(/(am|pm)/, ' $1').toUpperCase();
        const from = new Date(`${dateString} ${fm}`);
        const to = new Date(`${dateString} ${tm}`);
        if (to.getHours() < from.getHours()) to.setDate(to.getDate() + 1);
        if (currentTime >= from && currentTime <= to) return true;
      }
    }
    return false;
  }
}
