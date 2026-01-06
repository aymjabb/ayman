const fs = require("fs");
const request = require("request");
const { join } = require("path");

module.exports.config = {
  name: "سولو",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "أيمن", // تم تغيير اسم المطور
  description: "صور شخصية سونغ جين وو بـ 1000 دولار 💎✨",
  commandCategory: "صور",
  usages: "سولو",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, Users, Threads, Currencies }) => {
  const axios = global.nodemodule["axios"];
  const requestModule = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const link = [
    "https://i.imgur.com/JzD3mQl.jpg",
    "https://i.imgur.com/369Tq3O.jpg",
    "https://i.imgur.com/AH9gg98.jpg",
    "https://i.imgur.com/FIDuvIi.jpg",
    "https://i.imgur.com/C61We3b.jpg",
    "https://i.imgur.com/zdcWnlY.jpg",
    "https://i.imgur.com/L0icntQ.jpg",
    "https://i.imgur.com/WZWotoh.jpg",
    "https://i.imgur.com/XlOk8aU.jpg",
    "https://i.imgur.com/Jf7ozp7.jpg"
    // ممكن تضيف باقي الصور هنا
  ];

  const max = Math.floor(Math.random() * 6);
  const min = Math.floor(Math.random() * 2);

  const data = await Currencies.getData(event.senderID);
  const money = data.money;

  if (money < 1000) {
    return api.sendMessage(`🚨 أوه أوه! تحتاج 1000 دولار 💸 عشان تشوف صور سونغ جين وو 💞\nحاول تجميع الأموال يا بطل 😏✨`, event.threadID, event.messageID);
  } else {
    // خصم المال
    Currencies.setData(event.senderID, { money: money - 1000 });

    const randomImage = link[Math.floor(Math.random() * link.length)];

    const callback = () => {
      api.sendMessage({
        body: `🌟 يا ${global.data.userName.get(event.senderID) || "يا بطل"}! هذه صورة جديدة لـ **سونغ جين وو** 💞🔥\n💰 خصمنا 1000 دولار منك، بس تستاهل التجربة 😏✨\nاستمتع بالمغامرة يا مطورنا المحبوب أيمن! 💖`,
        attachment: fs.createReadStream(__dirname + "/cache/1.jpg")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"), event.messageID);
    };

    return requestModule(encodeURI(randomImage + (max - min))).pipe(fs.createWriteStream(__dirname + "/cache/1.jpg")).on("close", callback);
  }
};
