import { JSDOM } from 'jsdom';

import { Title } from '../anilist/types';

export async function getTitleReleases(title: Title, synonyms: string[], lastAiredEpisode: string): Promise<{ title: string, releases: string[] }> {
  for (const name of [title.romaji, ...synonyms]) {
    const res = await fetch(`https://nyaa.si/?c=1_2&q=${encodeURI(`${name} - ${lastAiredEpisode}`)}`);
    const data = await res.text();

    const { document } = new JSDOM(data).window;

    const nodes = document
      .querySelectorAll<HTMLLinkElement>('a[href*="/view/"]')
      .values();
    const releases = Array.from(nodes)
      .map(el => el.title)
      .map(title => /\[([^\]]+)]/.exec(title))
      .map(match => match?.[0] ?? '')
      .filter(Boolean);

    if (releases.length > 0) {
      const uniqueReleasesSet = new Set(releases);

      return {
        title: name,
        releases: Array.from(uniqueReleasesSet),
      };
    }
  }
  return {
    title: title.romaji,
    releases: [],
  };
}
