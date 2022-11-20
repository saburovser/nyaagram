import { session } from 'grammy';

import { Anime } from '../../api/anilist/types';

export const mySession = session({
  initial: () => {
    const searchedAnimes = [] as Anime[];
    const searchedReleases = [] as string[];

    return {
      searchedAnimes,
      searchedReleases,
      menuMessageId: 0,
    }
  }
});
