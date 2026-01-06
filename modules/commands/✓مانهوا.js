const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "مانهوا",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Ayman 61577861540407",
  description: "✨ اقتراح مانهوا عشوائي حسب النوع مع سيرا تشان",
  commandCategory: "افلام",
  usages: ".مانهوا [نوع]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {

  const manhwaDB = {
    رومانسي: [
      "https://i.imgur.com/Toz6idU.jpg",
      "https://i.imgur.com/bjRfO9j.jpg",
      "https://i.imgur.com/OtYoJi3.jpg"
    ],
    أكشن: [
      "https://i.imgur.com/3eosy6m.jpg",
      "https://i.imgur.com/FhoBQXa.jpg",
      "https://i.imgur.com/DVYPXpK.jpg"
    ],
    كوميدي: [
      "https://i.imgur.com/dDHOkhE.jpg",
      "https://i.imgur.com/cKY16UR.jpg",
      "https://i.imgur.com/dZn9AGk.jpg"
    ]
  };

  // اختر النوع الذي حدده المستخدم أو اختر عشوائي
  let type = args[0] ? args[0].toLowerCase() : null;
  if (!type || !manhwaDB[type]) {
    // لو النوع غير معروف، اختر عشوائي من كل الأنواع
    const allTypes = Object.keys(manhwaDB);
    type = allTypes[Math.floor(Math.random() * allTypes.length)];
  }

  const selectedImage = manhwaDB[type][Math.floor(Math.random() * manhwaDB[type].length)];
  const cachePath = __dirname + "/cache/manhwa.jpg";

  // تنزيل الصورة وحفظها مؤقتًا
  return request(encodeURI(selectedImage))
    .pipe(fs.createWriteStream(cachePath))
    .on("close", () => {
      api.sendMessage({
        body: `✨ سيرا تشان تختار لك اليوم مانهوا من نوع: ${type.toUpperCase()} 💖\n\n🌸 استمتع بالمشاهدة وعيش التجربة!`,
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);
    });
};
