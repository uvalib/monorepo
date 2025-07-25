import { genkit, z } from 'genkit';
import { LibrariesData } from './LibrariesData.js';
import type { Library } from './Library.js';
import { ArticlesData } from './ArticlesData.js';
import { CatalogData } from './CatalogData.js';
import { ImagesData } from './ImagesData.js';
import { EventsData } from './EventsData.js';
import { LibGuidesData } from './LibGuidesData.js';
import { NewsData } from './NewsData.js';
import { PersonData } from './PersonData.js';
import { WebsiteData } from './WebsiteData.js';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash-lite-preview-06-17',
});

export const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Gets the current weather in a given location',
    inputSchema: z.object({
      location: z.string().describe('The location to get the current weather for'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Here, we would typically make an API call or database query. For this
    // example, we just return a fixed value.
    return `The current weather in ${input.location} is 63°F and sunny.`;
  },
);

const allLibraries = new LibrariesData();

async function fetchLibrary(slug: string): Promise<Library> {
  const lib = await allLibraries.getLibrary(slug, true);
  if (!lib) throw new Error(`Library with slug "${slug}" not found`);
  try {
    await lib.fetchHours(new Date(), 7, true);
  } catch {
    /* ignore */
  }
  return lib;
}

export const listLibraries = ai.defineTool(
  {
    name: 'listLibraries',
    description: 'List all UVA libraries (slug and title).',
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      slug: z.string().describe('Library slug (e.g. "clemons-library")'),
      title: z.string().describe('Library title (e.g. "Clemons Library")'),
    })),
  },
  async () => {
    const { items } = await allLibraries.fetchData();
    return items.map(l => ({ slug: l.slug, title: l.title }));
  }
);

// ---------------------------------------------------------------------------
// Tool: searchWebsite
// ---------------------------------------------------------------------------

export const searchWebsite = ai.defineTool(
  {
    name: 'searchWebsite',
    description: 'Full-site search for library.virginia.edu content (pages, news, people, libraries).',
    inputSchema: z.object({
      query: z.string().describe('Keyword search term.'),
      limit: z.number().int().min(1).optional().default(10).describe('Maximum results (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }:{ query: string, limit: number }) => {
    const wd = new WebsiteData({ query, limit });

    // Ensure absolute Drupal endpoint URL when running outside the website.
    if (!(process as any)?.env?.DRUPAL_BASE_URL) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore protected
      wd.drupalEndpointURL = 'https://library.virginia.edu/jsonapi/index/default_index';
    }

    const { items, meta } = await wd.fetchData({ limit });
    return {
      total: meta.totalResults,
      items: items.slice(0, limit).map((r: any) => ({
        id: r.id,
        type: r.constructor?.name ?? 'Page',
        title: r.title,
        description: r.description,
        link: r.link ?? r.path,
      })),
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: searchStaff
// ---------------------------------------------------------------------------

export const searchStaff = ai.defineTool(
  {
    name: 'searchStaff',
    description: 'Search UVA Library staff directory (Drupal person nodes).',
    inputSchema: z.object({
      query: z.string().describe('Name, title, or keyword.'),
      limit: z.number().int().min(1).optional().default(10).describe('Maximum results (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    const pd = new PersonData({ query, limit });
    const { items, meta } = await pd.fetchData({ limit });
    return {
      total: meta.totalResults,
      items: items.slice(0, limit).map(p => ({
        id: p.id,
        name: p.name ?? p.title,
        jobTitle: p.jobTitle,
        email: p.email,
        link: p.link,
        description: p.description,
      })),
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: searchNews
// ---------------------------------------------------------------------------

export const searchNews = ai.defineTool(
  {
    name: 'searchNews',
    description: 'Search UVA Library news posts (Drupal articles).',
    inputSchema: z.object({
      query: z.string().describe('Search term.'),
      limit: z.number().int().min(1).optional().default(10).describe('Number of results (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    const nd = new NewsData({ query, limit });
    const { items, meta } = await nd.fetchData({ limit });
    return {
      total: meta.totalResults,
      items: items.slice(0, limit).map(n => ({
        id: n.id,
        title: n.title,
        description: n.description,
        link: n.link,
      })),
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: searchLibGuides
// ---------------------------------------------------------------------------

export const searchLibGuides = ai.defineTool(
  {
    name: 'searchLibGuides',
    description: 'Search UVA Library LibGuides (subject & course guides).',
    inputSchema: z.object({
      query: z.string().describe('Search term.'),
      limit: z.number().int().min(1).optional().default(10).describe('Max results (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    // Try to use LibGuidesData if a DOM is available. Otherwise, perform our own minimal parsing.
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const lg = new LibGuidesData({ query, limit });
      const { items, meta } = await lg.fetchData({ limit });
      return { total: meta.totalResults, items };
    }

    // Node environment – call API directly
    const apiURL = 'https://qmo3jwybkg.execute-api.us-east-1.amazonaws.com/production/library/libguides-proxy';
    const res = await fetch(`${apiURL}?q=${encodeURIComponent(query)}`).then(r => r.json());
    const html: string = res.data.results;
    const items: { title: string; description: string; link: string }[] = [];

    const resultRegex = /<div class="s-srch-result[\s\S]*?<\/div>\s*<\/div>/gi;
    const matches = html.match(resultRegex) || [];

    for (const block of matches.slice(0, limit)) {
      // title
      const titleMatch = block.match(/s-srch-result-title[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
      const title = titleMatch ? stripHTML(titleMatch[1]).trim() : '';

      // description – second .s-srch-result-meta
      const metaMatches = [...block.matchAll(/s-srch-result-meta[\s\S]*?>([\s\S]*?)<\/div>/gi)];
      const description = metaMatches.length > 1 ? stripHTML(metaMatches[1][1]).trim() : '';

      // link – href of first anchor under title
      const linkMatch = block.match(/s-srch-result-title[\s\S]*?<a[^>]*href="([^"]+)"/i);
      const link = linkMatch ? linkMatch[1] : '';

      items.push({ title, description, link });
    }

    return { total: items.length, items };

    // Helper
    function stripHTML(text: string) {
      return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: searchEvents
// ---------------------------------------------------------------------------

export const searchEvents = ai.defineTool(
  {
    name: 'searchEvents',
    description: 'Retrieve upcoming UVA Library events. Supports keyword, category, date ranges.',
    inputSchema: z.object({
      query: z.string().optional().describe('Keyword search term.'),
      category: z.string().optional().describe('LibCal category id.'),
      date: z.string().optional().describe('ISO date (YYYY-MM-DD) to fetch events for.'),
      days: z.number().int().min(1).optional().default(30).describe('Number of future days to include (default 30).'),
      limit: z.number().int().min(1).optional().describe('Maximum number of events to return.'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, category, date, days, limit }: { query?: string, category?: string, date?: string, days: number, limit?: number }) => {
    const ed = new EventsData({ query, category, date, days, limit });
    const { items, meta } = await ed.fetchData();
    // limit items if provided because ed.limit may not respect if API returns more.
    const trimmed = limit ? items.slice(0, limit) : items;
    return {
      total: meta.totalResults,
      items: trimmed.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start: e.start,
        end: e.end,
        location: e.location,
        category: e.category,
        link: e.link,
        registration: e.registration,
      })),
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: searchImages
// ---------------------------------------------------------------------------

export const searchImages = ai.defineTool(
  {
    name: 'searchImages',
    description: 'Search UVA Library image collections via Virgo.',
    inputSchema: z.object({
      query: z.string().describe('Search term.'),
      limit: z.number().int().min(1).optional().default(10).describe('Number of results (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    const id = new ImagesData({ query, limit });
    const { items, meta } = await id.fetchData();
    return {
      total: meta.totalResults,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        link: i.link,
        description: i.description,
        format: (i as any).format,
      })),
    };
  }
);

export const getLibraryInfo = ai.defineTool(
  {
    name: 'getLibraryInfo',
    description: 'Return details and hours info for the given library slug.',
    inputSchema: z.object({
      slug: z.string().describe('Library slug (e.g. "clemons-library")'),
    }),
    outputSchema: z.any(),
  },
  async ({ slug }: { slug: string }) => {
    const lib = await fetchLibrary(slug);
    const isOpen = lib.hours?.isOpen != null;
    return {
      id: lib.id,
      slug: lib.slug,
      title: lib.title,
      description: lib.description,
      phoneNumber: lib.phoneNumber,
      website: lib.siteLink?.uri,
      isOpen,
      nextOpeningTime: lib.hours?.nextOpeningTime ?? null,
      nextClosingTime: lib.hours?.nextClosingTime ?? null,
      hours: lib.hours?.rawDates ?? null,
    };
  }
);

export const getLibraryHours = ai.defineTool(
  {
    name: 'getLibraryHours',
    description: 'Return the raw LibCal hours schedule for the given library.',
    inputSchema: z.object({
      slug: z.string().describe('Library slug (e.g. "clemons-library")'),
      days: z.number().int().min(1).optional().default(7).describe('Number of days to include (starting today). Default 7.'),
    }),
    outputSchema: z.any(),
  },
  async ({ slug, days }: { slug: string, days: number }) => {
    const lib = await fetchLibrary(slug);
    await lib.fetchHours(new Date(), days, true);
    return lib.hours?.rawDates ?? null;
  }
);

// ---------------------------------------------------------------------------
// Tool: searchArticles
// ---------------------------------------------------------------------------

export const searchArticles = ai.defineTool(
  {
    name: 'searchArticles',
    description: 'Search for scholarly articles via Virgo (UVA discovery).',
    inputSchema: z.object({
      query: z.string().describe('Keyword or phrase to search.'),
      limit: z.number().int().min(1).optional().default(10).describe('Number of results to return (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    const ad = new ArticlesData({ query, limit });
    const { items, meta } = await ad.fetchData();
    return {
      total: meta.totalResults,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        link: i.link,
        authors: (i as any).author,
        datePublished: (i as any).datePublished,
        publicationType: (i as any).publicationType,
        format: (i as any).format,
      })),
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: searchCatalog
// ---------------------------------------------------------------------------

export const searchCatalog = ai.defineTool(
  {
    name: 'searchCatalog',
    description: 'Search the UVA Library catalog via Virgo.',
    inputSchema: z.object({
      query: z.string().describe('Search term.'),
      limit: z.number().int().min(1).optional().default(10).describe('Number of results to return (default 10).'),
    }),
    outputSchema: z.any(),
  },
  async ({ query, limit }: { query: string, limit: number }) => {
    const cd = new CatalogData({ query, limit });
    const { items, meta } = await cd.fetchData();
    return {
      total: meta.totalResults,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        link: i.link,
        description: i.description,
        format: (i as any).format,
      })),
    };
  }
);
