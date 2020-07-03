import * as functions from "firebase-functions";
import * as puppeteer from "puppeteer";

// cloud functionでfirestoreを使うのに必要な設定は以下の２行
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const fireStore = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.scrapeWebComic = functions.pubsub
  .schedule("every 1 hour")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const cookies = [
      {
        name: "mylist",
        value: "78963%2C78973%2C74734%2C101160",
        domain: "webcomics.jp", // ドメイン（省略可）
        path: "/", // パス（省略可）
      },
    ];

    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto("https://webcomics.jp/mylist");
    const comics = await page.$$("#main > div.list > div.entry");
    await Promise.all(comics.map(async (comic) => await setComicData(comic)));

    await browser.close();
  });

// const scrapeWebComic = async () => {
//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox"],
//   });
//   const cookies = [
//     {
//       name: "mylist",
//       value: "78963%2C78973%2C74734%2C101160",
//       domain: "webcomics.jp", // ドメイン（省略可）
//       path: "/", // パス（省略可）
//     },
//   ];

//   const page = await browser.newPage();
//   await page.setCookie(...cookies);
//   await page.goto("https://webcomics.jp/mylist");
//   const comics = await page.$$("#main > div.list > div.entry");
//   await Promise.all(comics.map(async (comic) => await setComicData(comic)));

//   await browser.close();
// };

const setComicData = async (comic: puppeteer.ElementHandle<Element>) => {
  // 漫画タイトル
  const comicNameTag = await comic.$("div.entry-title > a");
  const comicNameTextContent = await comicNameTag!.getProperty("textContent");
  const comicNameEn = await comicNameTextContent.jsonValue();

  // 漫画url
  const comicUrlHref = await comicNameTag!.getProperty("href");
  const comicUrlEn = await comicUrlHref.jsonValue();

  // 掲載サイト
  const SerializationSiteTag = await comic.$("div.entry-site > a");
  const SerializationSiteTextContent = await SerializationSiteTag!.getProperty(
    "textContent"
  );
  const SerializationSiteEn = await SerializationSiteTextContent.jsonValue();

  // エピソードタイトル
  const comicEpisodeTag = await comic.$("div.entry-text > a");
  const comicEpisodeTextContent = await comicEpisodeTag!.getProperty(
    "textContent"
  );
  const comicEpisodeEn = await comicEpisodeTextContent.jsonValue();
  // let comicEpisodeEnTrim;
  // if (typeof comicEpisodeEn === "string") {
  //   comicEpisodeEnTrim = comicEpisodeEn.trim();
  // }

  const comicEpisodeUrlHref = await comicEpisodeTag!.getProperty("href");
  const comicEpisodeUrlEn = await comicEpisodeUrlHref.jsonValue();

  // console.log("comicNameEn: ", comicNameEn);
  // console.log("comicUrlEn: ", comicUrlEn);
  // console.log("SerializationSiteEn: ", SerializationSiteEn);
  const comicData = {
    name: comicNameEn,
    Serialization: SerializationSiteEn,
    url: comicUrlEn,
  };
  // console.log("comicEpisodeEn: ", comicEpisodeEnTrim);
  // console.log("comicEpisodeUrlEn: ", comicEpisodeUrlEn);
  // console.log("UpdateDateEn: ", UpdateDateEn);

  const episodeData = {
    name: comicEpisodeEn,
    url: comicEpisodeUrlEn,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  const comicRef = fireStore.collection("comics").doc(comicNameEn);
  comicRef
    .get()
    .then((doc: any) => {
      if (!doc.exists) {
        comicRef.set(comicData);
        // fireStore.collection("comics").doc(comicNameEn).set(comicData);
      }
    })
    .catch((err: any) => {
      console.log("Error getting document", err);
    });

  const episodeRef = fireStore
    .collection("comics")
    .doc(comicNameEn)
    .collection("episodes")
    .doc(comicEpisodeEn);
  episodeRef
    .get()
    .then((doc: any) => {
      if (!doc.exists) {
        episodeRef.set(episodeData);
        // fireStore.collection("comics").doc(comicNameEn).set(comicData);
      }
    })
    .catch((err: any) => {
      console.log("Error getting document", err);
    });
};
