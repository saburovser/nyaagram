import { JSDOM } from 'jsdom';
import { getLastEpisodeById } from '../anilist/getTitleByName';

export async function getTitleReleases(name: string, anilistId: number) {
  const res = await fetch(`https://nyaa.si/?c=1_2&q=${encodeURI(name)}`);
  const data = await res.text();

  const { document } = new JSDOM(data).window;

  const lastAiredEpisode = await getLastEpisodeById(anilistId);

  const nodes = document
    .querySelectorAll<HTMLLinkElement>(`a[href*="/view/"][title*="${lastAiredEpisode}"]`)
    .values();
  const releases = Array.from(nodes)
    .map(el => el.title)
    .map(title => /\[([^\]]+)]/.exec(title))
    .map(match => match?.[0] ?? '')
    .filter(Boolean)
    .map(release => release.slice(1, release.length - 1))
  const uniqueReleasesSet = new Set(releases);

  return Array.from(uniqueReleasesSet);
}
