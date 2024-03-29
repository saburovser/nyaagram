import { Menu, MenuRange } from '@grammyjs/menu';

import { MyContext } from '../session';
import { getLastEpisodeById } from '../../api/anilist';
import { searchedReleasesMenu } from './searchedReleasesMenu';
import { getTitleReleases } from '../../api/nyaa/getTitleReleases';

export const searchResultsMenu = new Menu<MyContext>('searchResultsMenu')
  .dynamic(async (ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedAnimes.forEach(anime => {
      range
        .submenu(`${anime.title.romaji} / ${anime.title.native}`, 'searchedReleasesMenu', async ctx => {
          ctx.session.selectedAnimeID = anime.id;

          const selectedAnimeLastEpisode = await getLastEpisodeById(anime.id);
          ctx.session.selectedAnimeLastEpisode = selectedAnimeLastEpisode;

          const { title, releases } = await getTitleReleases(anime.title, anime.synonyms, selectedAnimeLastEpisode);
          ctx.session.selectedAnime = title;
          ctx.session.searchedReleases = releases;
        })
        .row();
    });

    return range;
  });
