import * as puppeteer from "puppeteer";
import { ComicData } from "../types/comic";

const getWebComicAntenna = async (
  page: puppeteer.Page
): Promise<ComicData[]> => {
  const cookies = [
    {
      name: "mylist",
      value: "78963%2C78973%2C74734%2C101160%2C745%2C87665",
      domain: "webcomics.jp", // ドメイン（省略可）
      path: "/", // パス（省略可）
    },
  ];
  // 78963   # メイドインアビス,
  // 78973   # メイドインアビス公式アンソロジー,
  // 74734   # 僕の心のヤバいやつ,
  // 101160  # フードコートで、また明日。,
  // 745     # 私がモテないのはどう考えてもお前らが悪い!
  // 87665   # SPY×FAMILY

  await page.setCookie(...cookies);
  await page.goto("https://webcomics.jp/mylist");
  const comics = await page.$$("#main > div.list > div.entry");

  const result = await Promise.all(
    comics.map(async (comic) => {
      // 漫画タイトル
      const comicNameTag = await comic.$("div.entry-title > a");
      const comicNameTextContent = await comicNameTag!.getProperty(
        "textContent"
      );
      let comicNameEn = (await comicNameTextContent.jsonValue()) as string;
      switch (comicNameEn) {
        case "私がモテないのはどう考えてもお前らが悪い...":
          comicNameEn = "私がモテないのはどう考えてもお前らが悪い!";
          break;
        default:
          comicNameEn;
      }

      let comicNameNonSlash = "";
      if (typeof comicNameEn === "string") {
        comicNameNonSlash = comicNameEn.replace(/\//g, "-");
      }

      // 漫画url
      const comicUrlHref = await comicNameTag!.getProperty("href");
      const comicUrlEn = (await comicUrlHref.jsonValue()) as string;

      // 掲載サイト
      const SerializationSiteTag = await comic.$("div.entry-site > a");
      const SerializationSiteTextContent = await SerializationSiteTag!.getProperty(
        "textContent"
      );
      const SerializationSiteEn = (await SerializationSiteTextContent.jsonValue()) as string;

      // エピソードタイトル
      const comicEpisodeTag = await comic.$("div.entry-text > a");
      const comicEpisodeTextContent = await comicEpisodeTag!.getProperty(
        "textContent"
      );
      const comicEpisodeEn = await comicEpisodeTextContent.jsonValue();
      let comicEpisodeTrim = "";
      if (typeof comicEpisodeEn === "string") {
        comicEpisodeTrim = comicEpisodeEn.trim();
      }
      let comicEpisodeNonSlash = "";
      if (typeof comicEpisodeEn === "string") {
        comicEpisodeNonSlash = comicEpisodeEn.trim().replace(/\//g, "-");
      }

      // エピソードurl
      const comicEpisodeUrlHref = await comicEpisodeTag!.getProperty("href");
      const comicEpisodeUrlEn = (await comicEpisodeUrlHref.jsonValue()) as string;

      // 更新日
      const comicEpisodeDateTag = await comic.$("div.entry-date");
      const comicEpisodeDateTextContent = await comicEpisodeDateTag!.getProperty(
        "textContent"
      );
      const comicEpisodeDateEn = (await comicEpisodeDateTextContent.jsonValue()) as string;

      // 漫画データ
      const titleData = {
        name: comicNameEn,
        Serialization: SerializationSiteEn,
        url: comicUrlEn,
      };

      // エピソードデータ
      const episodeData = {
        name: comicEpisodeTrim,
        url: comicEpisodeUrlEn,
        update_date: comicEpisodeDateEn,
      };

      // スラッシュ置換データ
      const nameNonSlash = {
        comic: comicNameNonSlash,
        episode: comicEpisodeNonSlash,
      };

      return {
        titleData,
        episodeData,
        nameNonSlash,
      };
    })
  );

  return result;
};

export default getWebComicAntenna;
