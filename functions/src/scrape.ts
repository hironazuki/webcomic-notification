// import * as puppeteer from "puppeteer";
// export const scrapeWebComic = async () => {
//   const browser = await puppeteer.launch({
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
//   const comicEpisodeEn = await comicEpisodeTextContent.jsonValue();
//   let comicEpisodeEnTrim;
//   if (typeof comicEpisodeEn === "string") {
//     comicEpisodeEnTrim = comicEpisodeEn.trim();
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

//   console.log("comicEpisodeEn: ", comicEpisodeEnTrim);
//   console.log("comicEpisodeUrlEn: ", comicEpisodeUrlEn);
//   console.log("UpdateDateEn: ", UpdateDateEn);
// };
