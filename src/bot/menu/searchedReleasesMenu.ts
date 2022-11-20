import { Menu, MenuRange } from '@grammyjs/menu';

import { MyContext } from '../session';

export const searchedReleasesMenu = new Menu<MyContext>('searchedReleasesMenu')
  .dynamic(async (ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedReleases.forEach(release => {
      range
        .text(release, () => {
          console.log(release);
        })
        .row();
    });
    range.back('Go back');

    return range;
  });
