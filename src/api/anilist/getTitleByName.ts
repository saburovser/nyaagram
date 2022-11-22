import { Anime } from './types';

export async function fetchQuery<T = unknown>(query: string) {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const body = await res.json() as { data: T };

  return body.data;
}

/** returns airing titles with name and ID */
export async function getTitlesByName(name: string) {
  const query = `
    {
      Page(page: 1, perPage: 100) {
        media(search: "${name}", status: RELEASING, type: ANIME) {
          title {
            romaji
            native
            english
          }
          synonyms
          id
        }
      }
    }
  `;
  const res = await fetchQuery<{ Page: { media: Anime[] }}>(query);

  return res.Page.media;
}

/** returns last aired episode number in two digit format */
export async function getLastEpisodeById(id: number) {
  const query = `
    {
      Media(id: ${id}) {
        airingSchedule(notYetAired: true, perPage: 1) {
          nodes {
            episode
          }
        }
      }
    }
  `;
  const res = await fetchQuery<{ Media: { airingSchedule: { nodes: { episode: number }[] } } }>(query);

  const lastEpisode = res.Media.airingSchedule.nodes[0].episode - 1;

  return lastEpisode > 9 ? lastEpisode.toString() : `0${ lastEpisode }`;
}
