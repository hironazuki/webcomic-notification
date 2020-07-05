import * as functions from "firebase-functions";
import * as puppeteer from "puppeteer";
import axios from "axios";
const discord_url = functions.config().discord.webhook;

const config = {
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
};

const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const fireStore = admin.firestore();

exports.scrapeWebComic = functions.pubsub
  .schedule("every 1 hours")
  .timeZone("Asia/Tokyo")
  .onRun(async (context) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });
    const cookies = [
      {
        name: "mylist",
        value: "78963%2C78973%2C74734%2C101160%2C745%2C87665",
        domain: "webcomics.jp",
        path: "/",
      },
    ];
    // 78963   # メイドインアビス,
    // 78973   # メイドインアビス公式アンソロジー,
    // 74734   # 僕の心のヤバいやつ,
    // 101160  # フードコートで、また明日。,
    // 745     # 私がモテないのはどう考えてもお前らが悪い!
    // 87665   # SPY×FAMILY

    const page = await browser.newPage();
    await page.setCookie(...cookies);
    await page.goto("https://webcomics.jp/mylist");
    const comics = await page.$$("#main > div.list > div.entry");
    await Promise.all(comics.map(async (comic) => await setComicData(comic)));

    await browser.close();
  });

const setComicData = async (comic: puppeteer.ElementHandle<Element>) => {
  // 漫画タイトル
  const comicNameTag = await comic.$("div.entry-title > a");
  const comicNameTextContent = await comicNameTag!.getProperty("textContent");
  let comicNameEn = await comicNameTextContent.jsonValue();
  switch (comicNameEn) {
    case "私がモテないのはどう考えてもお前らが悪い...":
      comicNameEn = "私がモテないのはどう考えてもお前らが悪い!";
      break;
    default:
      comicNameEn;
  }

  let comicNameNonSlash;
  if (typeof comicNameEn === "string") {
    comicNameNonSlash = comicNameEn.replace(/\//g, "-");
  }

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
  let comicEpisodeTrim: string = "";
  if (typeof comicEpisodeEn === "string") {
    comicEpisodeTrim = comicEpisodeEn.trim();
  }
  let comicEpisodeNonSlash;
  if (typeof comicEpisodeEn === "string") {
    comicEpisodeNonSlash = comicEpisodeEn.trim().replace(/\//g, "-");
  }

  // エピソードurl
  const comicEpisodeUrlHref = await comicEpisodeTag!.getProperty("href");
  const comicEpisodeUrlEn = await comicEpisodeUrlHref.jsonValue();

  // 更新日
  const comicEpisodeDateTag = await comic.$("div.entry-date");
  const comicEpisodeDateTextContent = await comicEpisodeDateTag!.getProperty(
    "textContent"
  );
  const comicEpisodeDateEn = await comicEpisodeDateTextContent.jsonValue();

  const comicData = {
    name: comicNameEn,
    Serialization: SerializationSiteEn,
    url: comicUrlEn,
  };

  const episodeData = {
    name: comicEpisodeTrim,
    url: comicEpisodeUrlEn,
    update_date: comicEpisodeDateEn,
  };

  const comicRef = fireStore.collection("comics").doc(comicNameNonSlash);
  comicRef
    .get()
    .then((doc: any) => {
      if (!doc.exists) {
        comicRef.set(comicData);
      }
    })
    .catch((err: any) => {
      console.log("Error getting document", err);
    });

  const episodeRef = fireStore
    .collection("comics")
    .doc(comicNameEn)
    .collection("episodes")
    .doc(comicEpisodeNonSlash);
  episodeRef
    .get()
    .then(async (doc: any) => {
      if (!doc.exists) {
        console.log(comicNameEn, comicEpisodeTrim);

        //送信するデータ
        const postData = {
          username: "webcomic BOT",
          content: `@everyone \n${comicNameEn}\n${comicEpisodeTrim}\n${comicEpisodeUrlEn}`,
        };

        // 2秒スリープ
        const _sleep = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        await _sleep(2000);

        // web hookでdiscordに通知
        await axios.post(discord_url, postData, config);

        // firestoreに保存
        episodeRef.set(episodeData);
      }
    })
    .catch((err: any) => {
      console.log("Error getting document", err);
    });
};
