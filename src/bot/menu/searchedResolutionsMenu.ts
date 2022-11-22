import { Menu, MenuRange } from '@grammyjs/menu';

import { InputFile } from 'grammy';

import { MyContext } from '../session';
import { getTorrentFile } from '../../api/nyaa/getTorrentFile';

export const searchedResolutionsMenu = new Menu<MyContext>('searchedResolutionsMenu')
  .dynamic(async (ctx) => {
    const range = new MenuRange<MyContext>();
    ctx.session.searchedResolutions.forEach(resolution => {
      range
        .text(resolution, async (ctx) => {
          ctx.session.selectedResolution = resolution;
          const {selectedAnime, selectedAnimeLastEpisode, selectedRelease, selectedResolution} = ctx.session;

          const { buffer, name } = await getTorrentFile(`${selectedAnime} - ${selectedAnimeLastEpisode} ${selectedRelease} ${selectedResolution}`);

          return ctx.api.sendDocument(ctx.chat!.id, new InputFile(new Uint8Array(buffer), name));
        })
        .row();
    });
    range.back('Go back');

    return range;
  });
