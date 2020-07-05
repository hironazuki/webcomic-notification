import * as functions from "firebase-functions";
import axios from "axios";

const config = {
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
};

const admin = require("firebase-admin");
const discord_url = functions.config().discord.webhook;

admin.initializeApp(functions.config().firebase);
const fireStore = admin.firestore();

type ComicData = {
  comicData: {
    name: string;
    Serialization: string;
    url: string;
  };
  episodeData: {
    name: string;
    url: string;
    update_date: string;
  };
  nameNonSlash: {
    comic: string;
    episode: string;
  };
};
const setFirestore = async (data: ComicData[]) => {
  data.forEach((d) => {
    const comicRef = fireStore.collection("comics").doc(d.nameNonSlash.comic);
    comicRef
      .get()
      .then((doc: any) => {
        if (!doc.exists) {
          comicRef.set(d.comicData);
        }
      })
      .catch((err: any) => {
        console.log("Error getting document", err);
      });

    const episodeRef = fireStore
      .collection("comics")
      .doc(d.comicData.name)
      .collection("episodes")
      .doc(d.nameNonSlash.episode);
    episodeRef
      .get()
      .then(async (doc: any) => {
        if (!doc.exists) {
          //送信するデータ

          console.log(d.comicData.name, d.episodeData.name);

          //送信するデータ
          const postData = {
            username: "webcomic BOT",
            content: `@everyone \n${d.comicData.name}\n${d.episodeData.name}\n${d.episodeData.url}`,
          };

          // 2秒スリープ
          const _sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

          await _sleep(2000);

          // web hookでdiscordに通知
          await axios.post(discord_url, postData, config);
          // firestoreに保存
          await episodeRef.set(d.episodeData);
        }
      })
      .catch((err: any) => {
        console.log("Error getting document", err);
      });
  });
};

export default setFirestore;
