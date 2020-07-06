require("dotenv").config();
import axios from "axios";
const discord_url = process.env.DISCORD_WEBHOOK_URL!;
// //ヘッダーなどの設定
const config = {
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
};

//送信するデータ
const postData = {
  username: "webcomic BOT",
  content: "@everyone Node.jsaaaからポスdotenvトして\n る \nよ :)",
};

const main = async () => {
  await axios.post(discord_url, postData, config);
  // console.log(res);
};

main();
