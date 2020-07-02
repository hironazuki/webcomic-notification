import * as functions from "firebase-functions";
// cloud functionでfirestoreを使うのに必要な設定は以下の２行
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const fireStore = admin.firestore();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  // const comics = fireStore.collection("comics");
  // comics
  //   .get()
  //   .then((doc: any) => {
  //     if (!doc.exists) {
  //       response.send("No such document!");
  //     } else {
  //       response.send(doc.data());
  //     }
  //   })
  //   .catch((err: any) => {
  //     response.send("not found");
  //   });
  // 動作確認のため適当なデータをデータベースに保存
  const citiesRef = fireStore.collection("comics");
  const test = citiesRef.doc("メイドインアビス").set({
    name: "メイドインアビス",
    website: "webcomicガンマ",
  });
  console.log(test);
  const cityRef = fireStore.collection("comics").doc("メイドインアビス");
  cityRef
    .get()
    .then((doc: any) => {
      if (!doc.exists) {
        response.send("No such document!");
      } else {
        response.send(doc.data());
      }
    })
    .catch((err: any) => {
      response.send("not found");
    });
});
