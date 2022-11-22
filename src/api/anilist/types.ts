export interface Title {
  romaji: string;
  native: string;
  english: string;
}

export interface Anime {
  title: Title;
  id: number;
  synonyms: string[];
}
