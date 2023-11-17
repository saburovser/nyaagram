import { Context, SessionFlavor } from 'grammy';

import { Anime } from '../../api/anilist/types';

export interface SessionData {
  searchedAnimes: Anime[];
  selectedAnime?: string;
  selectedAnimeLastEpisode?: string;
  selectedAnimeID?: number;
  searchedReleases: string[];
  selectedRelease?: string;
  searchedResolutions: string[];
  selectedResolution?: string;
}

export type MyContext = Context & SessionFlavor<SessionData>;
