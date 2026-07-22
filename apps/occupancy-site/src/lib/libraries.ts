/** Canonical library names as returned by the occupancy MCP service. */
export const LIBRARIES = [
  'Clemons',
  'Fine Arts',
  'Music',
  'Science & Engineering',
  'Shannon',
] as const;

export type LibraryName = (typeof LIBRARIES)[number];

export interface LibraryMeta {
  name: LibraryName;
  slug: string;
  shortName: string;
  description: string;
  /** Libraries with known imperfect camera coverage should surface estimate language. */
  estimateNote?: string;
}

export const LIBRARY_META: Record<string, LibraryMeta> = {
  clemons: {
    name: 'Clemons',
    slug: 'clemons',
    shortName: 'Clemons',
    description:
      'Clemons Library is UVA’s primary undergraduate library, with high student traffic across study floors and collaborative spaces.',
    estimateNote:
      'Clemons camera coverage and multi-entrance flow make counts an estimate. They remain substantially more reliable than the previous gate-counter system.',
  },
  'fine-arts': {
    name: 'Fine Arts',
    slug: 'fine-arts',
    shortName: 'Fine Arts',
    description:
      'The Fine Arts Library supports architecture, art, and related programs with collections and study space in Fiske Kimball.',
  },
  music: {
    name: 'Music',
    slug: 'music',
    shortName: 'Music',
    description:
      'The Music Library serves the McIntire Department of Music with scores, recordings, and study space.',
  },
  'science-engineering': {
    name: 'Science & Engineering',
    slug: 'science-engineering',
    shortName: 'SEL',
    description:
      'The Science & Engineering Library supports STEM teaching and research with study space and collections in Clark Hall.',
  },
  shannon: {
    name: 'Shannon',
    slug: 'shannon',
    shortName: 'Shannon',
    description:
      'Shannon Library is the University’s main research library, with extensive stacks, service points, and public study areas.',
    estimateNote:
      'Shannon’s size and complex entrance layout mean counts are an estimate. The current camera-based system still improves on historical gate counters.',
  },
};

export function slugifyLibrary(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .replace('science-and-engineering', 'science-engineering');
}

export function getLibraryMeta(nameOrSlug: string): LibraryMeta | undefined {
  const slug = slugifyLibrary(nameOrSlug);
  return LIBRARY_META[slug];
}

export function libraryDisplayOrder(): LibraryMeta[] {
  return LIBRARIES.map((name) => LIBRARY_META[slugifyLibrary(name)]).filter(
    Boolean,
  ) as LibraryMeta[];
}
