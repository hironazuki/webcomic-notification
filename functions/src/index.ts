import * as functions from "firebase-functions";
import * as puppeteer from "puppeteer";

import getWebComicAntenna from "./scraping/webComicAntenna";
import getDokukaiAhen from "./scraping/dka-hero";

import setFirestore from "./firestore/setData";
import { ComicData } from "./types/comic";

exports.scrapeWebComic = functions.pubsub
  .schedule("every 1 hours")
  .timeZone("Asia/Tokyo")
  .onRun(async (_context) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const comicAntennaData = await getWebComicAntenna(page);
    const DokukaiAhenData = await getDokukaiAhen(page);

    const data: ComicData[] = comicAntennaData.concat(DokukaiAhenData);
    await setFirestore(data);

    await browser.close();
  });
