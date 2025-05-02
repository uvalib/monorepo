import { LibrariesData } from '@uvalib/data-wrap';
import { resetCounterBySlug } from './occupancy-client.js';
export default class LibraryHours {
    constructor() {
        this.prevLibraryOpen = {};
    }
    async checkLibraryHours() {
        var _a, _b, _c;
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
                const slug = String((_a = lib.slug) !== null && _a !== void 0 ? _a : lib.id);
                const rawDates = (_c = (_b = lib.hours) === null || _b === void 0 ? void 0 : _b.rawDates) !== null && _c !== void 0 ? _c : {};
                const todayKey = new Date().toISOString().split('T')[0];
                const todayInfo = rawDates[todayKey];
                let isOpen;
                if (todayInfo && todayInfo.status === '24hours') {
                    isOpen = true;
                }
                else {
                    isOpen = libsData.isOpen(rawDates, new Date());
                }
                const wasOpen = this.prevLibraryOpen[slug];
                console.log(`Library [${slug}] wasOpen=${wasOpen}, isOpen=${isOpen}, todayStatus=${todayInfo === null || todayInfo === void 0 ? void 0 : todayInfo.status}`);
                if (wasOpen === undefined) {
                    this.prevLibraryOpen[slug] = isOpen;
                }
                else if (!isOpen && wasOpen) {
                    console.log(`Detected closure for library ${slug}`);
                    console.log(`Library closed: ${slug}, resetting occupancy counters`);
                    // reset occupancy counters for this library
                    await resetCounterBySlug(slug);
                    this.prevLibraryOpen[slug] = isOpen;
                }
                else {
                    this.prevLibraryOpen[slug] = isOpen;
                }
            }
        }
        catch (err) {
            console.error('Error checking library hours', err);
        }
    }
}
