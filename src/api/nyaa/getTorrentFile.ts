import { JSDOM } from 'jsdom';

export async function getTorrentFile(search: string) {
  const res = await fetch(`https://nyaa.si/?c=1_2&q=${encodeURI(search)}`);
  const data = await res.text();

  const { document } = new JSDOM(data).window;

  const link = document.querySelector<HTMLLinkElement>('a[href*=".torrent"]')!;

  const buffer = await fetch('https://nyaa.si' + link.href).then(res => res.arrayBuffer());

  return {
    buffer,
    name: link.href.match(/[0-9]+.torrent/)![0],
  }
}
