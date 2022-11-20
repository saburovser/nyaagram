import { Context, SessionFlavor } from 'grammy';

import { Anime } from '../../api/anilist/types';

export interface SessionData {
  searchedAnimes: Anime[];
  searchedReleases: string[];
  menuMessageId: number;
}

export type MyContext = Context & SessionFlavor<SessionData>;
