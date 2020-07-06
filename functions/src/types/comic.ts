type TitleData = {
  name: string;
  Serialization: string;
  url: string;
};

type EpisodeData = {
  name: string;
  url: string;
  update_date: string;
};

type NameNonSlash = {
  comic: string;
  episode: string;
};

export type ComicData = {
  titleData: TitleData;
  episodeData: EpisodeData;
  nameNonSlash: NameNonSlash;
};
