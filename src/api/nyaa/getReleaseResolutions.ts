import { JSDOM } from 'jsdom';

export async function getReleaseResolutions(title: string, lastAiredEpisode: string, release: string) {
  const res = await fetch(`https://nyaa.si/?c=1_2&q=${encodeURI(`${title} - ${lastAiredEpisode} [${release}]`)}`);
  const data = await res.text();

  const { document } = new JSDOM(data).window;

  const nodes = document
    .querySelectorAll<HTMLLinkElement>('a[href*="/view/"]')
    .values();
  const resolutions = Array.from(nodes)
    .map(el => el.title)
    .map(title => /[[(]([^\]]*[0-9]{3,4}[px].*?)[)\]]/.exec(title))
    .map(match => match?.[0] ?? '')
    .filter(Boolean)
  const uniqueReleasesSet = new Set(resolutions);

  return Array.from(uniqueReleasesSet);
}
