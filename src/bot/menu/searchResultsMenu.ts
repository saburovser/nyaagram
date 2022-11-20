import { Menu, MenuRange } from '@grammyjs/menu';

import { MyContext } from '../session';
import { searchedReleasesMenu } from './searchedReleasesMenu';
import { getTitleReleases } from '../../api/nyaa/getTitleReleases';

export const searchResultsMenu = new Menu<MyContext>('searchResultsMenu')
  .dynamic(async (ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedAnimes.forEach(anime => {
      range
        .submenu(`${anime.title.romaji} / ${anime.title.native}`, 'searchedReleasesMenu', async ctx => {
          ctx.session.searchedReleases = await getTitleReleases(anime.title.romaji, anime.id);
        })
        .row();
    });

    return range;
  });
