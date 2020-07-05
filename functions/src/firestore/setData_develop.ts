require("dotenv").config();
const admin = require("firebase-admin");
let serviceAccount = require("../../../comic-notification-8c150-91eb54977881.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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

          const _sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

          await _sleep(2000);
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
