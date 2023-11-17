import { session } from 'grammy';

import { MyContext, SessionData } from './MyContext';

export const mySession = session<SessionData, MyContext>({
  initial: () => ({
    searchedAnimes: [],
    searchedReleases: [],
    searchedResolutions: [],
  })
});
