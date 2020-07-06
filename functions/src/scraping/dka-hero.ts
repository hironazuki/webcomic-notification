import * as puppeteer from "puppeteer";
import { ComicData } from "../types/comic";

const getDokukaiAhen = async (page: puppeteer.Page): Promise<ComicData[]> => {
  await page.goto("http://dka-hero.com/top.html");
  // body > center:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(5) > td:nth-child(2) > a

  // 堀さんと宮村くん
  // エピソードタイトル
  const frame = (await page.frames())[1];
  const HorimiyaEpisodeTag = await frame.$(
    "body > center:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > a"
  );
  const HorimiyaEpisodeTextContent = await HorimiyaEpisodeTag!.getProperty(
    "textContent"
  );
  const HorimiyaEpisodeEn = await HorimiyaEpisodeTextContent.jsonValue();
  let HorimiyaEpisodeTrim = "";
  if (typeof HorimiyaEpisodeEn === "string") {
    HorimiyaEpisodeTrim = HorimiyaEpisodeEn.trim();
  }
  let HorimiyaEpisodeNonSlash = "";
  if (typeof HorimiyaEpisodeEn === "string") {
    HorimiyaEpisodeNonSlash = HorimiyaEpisodeEn.trim().replace(/\//g, "-");
  }

  // エピソードurl
  const HorimiyaEpisodeUrlHref = await HorimiyaEpisodeTag!.getProperty("href");
  const HorimiyaEpisodeUrlEn = (await HorimiyaEpisodeUrlHref.jsonValue()) as string;

  // あことバンビ
  const AkoEpisodeTag = await frame.$(
    "body > center:nth-child(3) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(5) > td:nth-child(2) > a"
  );
  const AkoEpisodeTextContent = await AkoEpisodeTag!.getProperty("textContent");
  const AkoEpisodeEn = await AkoEpisodeTextContent.jsonValue();
  let AkoEpisodeTrim = "";
  if (typeof AkoEpisodeEn === "string") {
    AkoEpisodeTrim = AkoEpisodeEn.trim();
  }
  let AkoEpisodeNonSlash = "";
  if (typeof AkoEpisodeEn === "string") {
    AkoEpisodeNonSlash = AkoEpisodeEn.trim().replace(/\//g, "-");
  }

  // エピソードurl
  const AkoEpisodeUrlHref = await AkoEpisodeTag!.getProperty("href");
  const AkoEpisodeUrlEn = (await AkoEpisodeUrlHref.jsonValue()) as string;
  // 更新日

  const comicEpisodeDateEn = new Date()
    .toLocaleDateString("ja")
    .replace(/-/g, "/");

  // 漫画データ
  const HorimiyaTitleData = {
    name: "堀さんと宮村くん",
    Serialization: "読解アヘン",
    url: "http://dka-hero.com/top.html",
  };

  const AkoTitleData = {
    name: "あことバンビ",
    Serialization: "読解アヘン",
    url: "http://dka-hero.com/top.html",
  };

  // エピソードデータ
  const HorimiyaEpisodeData = {
    name: HorimiyaEpisodeTrim,
    url: HorimiyaEpisodeUrlEn,
    update_date: comicEpisodeDateEn,
  };

  const AkoEpisodeData = {
    name: AkoEpisodeTrim,
    url: AkoEpisodeUrlEn,
    update_date: comicEpisodeDateEn,
  };

  // スラッシュ置換データ
  const HorimiyaNonSlash = {
    comic: "堀さんと宮村くん",
    episode: HorimiyaEpisodeNonSlash,
  };

  const AkoNonSlash = {
    comic: "あことバンビ",
    episode: AkoEpisodeNonSlash,
  };

  return [
    {
      titleData: HorimiyaTitleData,
      episodeData: HorimiyaEpisodeData,
      nameNonSlash: HorimiyaNonSlash,
    },
    {
      titleData: AkoTitleData,
      episodeData: AkoEpisodeData,
      nameNonSlash: AkoNonSlash,
    },
  ];

  // return result;
};

export default getDokukaiAhen;
