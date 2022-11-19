export interface Anime {
  title: {
    romaji: string;
    native: string;
  }
  id: number;
}

export async function getAnimeByName(name: string) {
  const query = `
    {
      Page(page: 1, perPage: 100) {
        media(search: "${name}", status: RELEASING, type: ANIME) {
          title {
            romaji
            native
          }
          id
        }
      }
    }
  `;

  return await fetch('https://graphql.anilist.co', {
    method: 'POST',
    body: JSON.stringify({query}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }).then(res => res.json()).then(body => body.data.Page.media).catch(() => []) as Anime[];
}
