// import * as puppeteer from "puppeteer";
// export const scrapeWebComic = async () => {
//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const cookies = [
//     {
//       name: "mylist",
//       value: "78963%2C78973%2C74734%2C101160%2C745",
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

// scrapeWebComic();

// const setComicData = async (comic: puppeteer.ElementHandle<Element>) => {
//   // 漫画タイトル
//   const comicNameTag = await comic.$("div.entry-title > a");
//   const comicNameTextContent = await comicNameTag!.getProperty("textContent");
//   const comicNameEn = await comicNameTextContent.jsonValue();

//   // 漫画url
//   const comicUrlHref = await comicNameTag!.getProperty("href");
//   const comicUrlEn = await comicUrlHref.jsonValue();

//   // 掲載サイト
//   const SerializationSiteTag = await comic.$("div.entry-site > a");
//   const SerializationSiteTextContent = await SerializationSiteTag!.getProperty(
//     "textContent"
//   );
//   const SerializationSiteEn = await SerializationSiteTextContent.jsonValue();

//   // エピソードタイトル
//   const comicEpisodeTag = await comic.$("div.entry-text > a");
//   const comicEpisodeTextContent = await comicEpisodeTag!.getProperty(
//     "textContent"
//   );
//   let comicEpisodeEn = await comicEpisodeTextContent.jsonValue();
//   if (typeof comicEpisodeEn === "string") {
//     comicEpisodeEn = comicEpisodeEn.trim();
//   }
//   let comicEpisodeNonSlash;
//   if (typeof comicEpisodeEn === "string") {
//     comicEpisodeNonSlash = comicEpisodeEn.replace(/\//g, "-");
//   }
//   const comicEpisodeUrlHref = await comicEpisodeTag!.getProperty("href");
//   const comicEpisodeUrlEn = await comicEpisodeUrlHref.jsonValue();

//   // 更新日
//   const UpdateDateTag = await comic.$("div.entry-date");
//   const UpdateDateTextContent = await UpdateDateTag!.getProperty("textContent");
//   const UpdateDateEn = await UpdateDateTextContent.jsonValue();

//   console.log("comicNameEn: ", comicNameEn);
//   console.log("comicUrlEn: ", comicUrlEn);
//   console.log("SerializationSiteEn: ", SerializationSiteEn);

//   console.log("comicEpisodeEn: ", comicEpisodeEn);
//   console.log("comicEpisodeNonSlash", comicEpisodeNonSlash);
//   console.log("comicEpisodeUrlEn: ", comicEpisodeUrlEn);
//   console.log("UpdateDateEn: ", UpdateDateEn);
// };

// const PushBullet = require("pushbullet");
// const pusher = new PushBullet(process.env.PUSHBULLET_CLIENT);

// // pusher.note(
// //   process.env.PUSHBULLET_IDENTIFIER,
// //   "noteTitle",
// //   "https://google.com"
// // );
// pusher.link(
//   process.env.PUSHBULLET_IDENTIFIER,
//   "GitHub",
//   "https://github.com/",
//   "Note body text"
// );

// require("dotenv").config();
// import axios from "axios";
// const discord_url = process.env.DISCORD_WEBHOOK_URL!;
// console.log(process.env.DISCORD_WEBHOOK_URL);
// //ヘッダーなどの設定
// const config = {
//   headers: {
//     Accept: "application/json",
//     "Content-type": "application/json",
//   },
// };

// //送信するデータ
// const postData = {
//   username: "webcomic BOT",
//   content: "Node.jsaaaからポスdotenvトして\n る \nよ :)",
// };

// const main = async () => {
//   await axios.post(discord_url, postData, config);
//   // console.log(res);
// };

// main();
// const admin = require("firebase-admin");
// let serviceAccount = require("../../comic-notification-8c150-91eb54977881");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// let db = admin.firestore();

// let docRef = db.collection("users").doc("alovelace");

// let setAda = docRef.set({
//   first: "Ada",
//   last: "Lovelace",
//   born: 1815,
// });
