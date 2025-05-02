import { LibrariesData } from '@uvalib/data-wrap';
import { resetCounterBySlug } from './occupancy-client.js';

export default class LibraryHours {
    private prevLibraryOpen: Record<string, boolean> = {};

    public async checkLibraryHours(): Promise<void> {
        console.log('Starting library hours check');
        try {
            const libsData = new LibrariesData();
            console.log(`LibrariesData initialized; items before fetch: ${libsData.items.length}`);
            await libsData.fetchData();
            console.log(`Libraries fetched: ${libsData.items.length}`);
            console.log('Fetching hours for libraries');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await libsData.fetchHours(yesterday, 1);
            console.log('Library hours fetched', libsData.items.length);
            for (const lib of libsData.items) {
                console.log('Library hours', JSON.stringify(lib.hours));
                const slug = String(lib.slug ?? lib.id);
                const rawDates = lib.hours?.rawDates ?? {};
                const todayKey = new Date().toISOString().split('T')[0];
                const todayInfo = rawDates[todayKey];
                let isOpen: boolean;
                if (todayInfo && todayInfo.status === '24hours') {
                    isOpen = true;
                } else {
                    isOpen = libsData.isOpen(rawDates, new Date());
                }
                const wasOpen = this.prevLibraryOpen[slug];
                console.log(`Library [${slug}] wasOpen=${wasOpen}, isOpen=${isOpen}, todayStatus=${todayInfo?.status}`);
                if (wasOpen === undefined) {
                    this.prevLibraryOpen[slug] = isOpen;
                } else if (!isOpen && wasOpen) {
                    console.log(`Detected closure for library ${slug}`);
                    console.log(`Library closed: ${slug}, resetting occupancy counters`);
                    // reset occupancy counters for this library
                    await resetCounterBySlug(slug);
                    this.prevLibraryOpen[slug] = isOpen;
                } else {
                    this.prevLibraryOpen[slug] = isOpen;
                }
            }
        } catch (err) {
            console.error('Error checking library hours', err);
        }
    }
}