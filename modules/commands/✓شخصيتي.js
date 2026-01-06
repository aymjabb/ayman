const fs = require("fs");
const request = require("request");
const { join } = require("path");

module.exports.config = {
  name: "شخصيتي",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "أيمن", // تم استبدال اسم المطور باسمك
  description: "لو كنت شخصية انمي شو هتكون؟ 😎✨",
  commandCategory: "صور",
  usages: "ا",
  cooldowns: 0,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, Users, Currencies }) => {
  try {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const userName = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);

    // فقط الإيدي الخاص بك
    if (event.senderID != "61577861540407") return api.sendMessage("🚫 هههه آسف يا صديقي، هذا الأمر مخصوص ليك 😏💖", event.threadID, event.messageID);

    var link = [
      "https://i.imgur.com/RRnddBS.jpg",
      "https://i.imgur.com/4av6OnG.jpg",
      "https://i.imgur.com/bID48JU.jpg",
      "https://i.imgur.com/Kkc5CZs.jpg",
      "https://i.imgur.com/T9WwPxL.jpg",
      "https://i.imgur.com/R7trNF3.jpg",
      "https://i.imgur.com/pp3L51v.jpg",
      "https://i.imgur.com/nmTpfIV.jpg",
      "https://i.imgur.com/G7Cmlm5.jpg",
      "https://i.imgur.com/gyk1KTE.jpg",
      "https://i.imgur.com/0C40VMA.jpg",
      "https://i.imgur.com/b0YCfBO.jpg",
      "https://i.imgur.com/EF63R6y.jpg",
      "https://i.imgur.com/uaBmGDh.jpg",
      "https://i.imgur.com/J68g1dP.jpg"
    ];

    var max = Math.floor(Math.random() * 6);
    var min = Math.floor(Math.random() * 2);

    var data = await Currencies.getData(event.senderID);
    var money = data.money;

    if (money < 500) {
      return api.sendMessage(`💸 يا بطل! تحتاج 500 دولار لتعرف شخصيتك الأنمي! حاول تجميع النقود 🤪`, event.threadID, event.messageID);
    } else {
      Currencies.setData(event.senderID, { money: money - 500 });
      var randomLink = link[Math.floor(Math.random() * link.length)];

      const callback = () => {
        api.sendMessage({
          body: `✨🎭 لو كان ${userName} شخصية أنمي، فسيكون: \n\n😎 المغامرات كلها على الأبواب! 🌟\n💬 ها، شو رأيك في الشخصية؟ جاوبني! 💖\n\n🔮 هذا كله بطابع سيرا تشان العفوي والساخر 😏`,
          attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));
      };

      return request(encodeURI(randomLink + (max - min))).pipe(fs.createWriteStream(__dirname + "/cache/1.jpg")).on("close", callback);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage(`🤖 حدث خطأ غير متوقع! يبدو أن البوت حاول أن يصبح شخصية أنمي لكنه تعثر 😅`, event.threadID, event.messageID);
  }
};
