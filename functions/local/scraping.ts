import * as puppeteer from "puppeteer";
import getWebComicAntenna from "../src/scraping/webComicAntenna";
import getDokukaiAhen from "../src/scraping/dka-hero";
import { ComicData } from "../src/types/comic";

export const scrapeWebComic = async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // headless: false,
  });
  const page = await browser.newPage();
  // web漫画アンテナ
  const comicAntennaData = await getWebComicAntenna(page);
  // 読解アヘン
  const DokukaiAhenData = await getDokukaiAhen(page);

  const data: ComicData[] = comicAntennaData.concat(DokukaiAhenData);
  console.log("scrapeWebComic -> data", data);
  await browser.close();
};

scrapeWebComic();
