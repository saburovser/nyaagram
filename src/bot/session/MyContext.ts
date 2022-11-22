import { Context, SessionFlavor } from 'grammy';

import { Anime } from '../../api/anilist/types';

export interface SessionData {
  searchedAnimes: Anime[];
  selectedAnime?: string;
  selectedAnimeLastEpisode?: string;
  searchedReleases: string[];
  selectedRelease?: string;
  searchedResolutions: string[];
  selectedResolution?: string;
  menuMessageId: number;
}

export type MyContext = Context & SessionFlavor<SessionData>;
