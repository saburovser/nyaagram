import { Menu, MenuRange } from '@grammyjs/menu';

import { MyContext } from '../session';
import { getReleaseResolutions } from '../../api/nyaa/getReleaseResolutions';

export const searchedReleasesMenu = new Menu<MyContext>('searchedReleasesMenu')
  .dynamic((ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedReleases.forEach(release => {
      range
        .submenu(release, 'searchedResolutionsMenu', async () => {
          ctx.session.selectedRelease = release;

          ctx.session.searchedResolutions =
            await getReleaseResolutions(ctx.session.selectedAnime!, ctx.session.selectedAnimeLastEpisode!, release);
        })
        .row();
    });
    range.back('Go back');

    return range;
  });
