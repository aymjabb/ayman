const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "نكته",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "ايمن 🐾 | ID: 61577861540407",
  description: "مجموعة ضخمة من النكت المضحكة والمزخرفة 😹🎉",
  commandCategory: "ترفيه",
  cooldowns: 0,
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  // تأكد من وجود مجلد cache
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  // روابط صور عشوائية
  const links = [
    "https://i.imgur.com/SmrAxPV.jpg",
    "https://i.imgur.com/WNXgwgX.jpg",
    "https://i.imgur.com/ILucq55.jpg",
    "https://i.imgur.com/CF8qAAo.jpg",
    "https://i.imgur.com/gqukE0K.jpg"
  ];

  // النكت
  const jokes = [
    "واحد وزوجته متخانقين ترك لها ورقة: صحيني الساعة 6★💥 ونص.. صحي الساعة 10 😹!",
    "مرة واحد شاف أخوه التوأم قال له: انت فين من الصبح؟ 👀 أمي جعلتني أتحمم مرتين 🤣",
    "حرامي دخل يسرق البيت، وجد العجوز بردانة 🥶 شغل عليها المكيف وهرب 💨",
    "واحد قام يساوي شاي لربع ☕ فلقى السكر خالص، اضطر يعمل الشاي بدون سكر 😹",
    "في وحدة كاتبة: سأوسيطرو على العالمي 🌎 انتِ سيطري على الكيبورد ⌨️"
    // أضف باقي النكت حسب حاجتك
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  const randomLink = links[Math.floor(Math.random() * links.length)];
  const imgPath = path.join(cacheDir, "zac.jpg");

  try {
    // تحميل الصورة باستخدام axios
    const response = await axios.get(randomLink, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(response.data));

    // إرسال الرسالة
    const info = await api.sendMessage({
      body: `💫🤣 نكتة عشوائية من سيرا تشان:\n\n${randomJoke}\n\n✨👑 بواسطة ايمن | ID: 61577861540407`,
      attachment: fs.createReadStream(imgPath)
    }, threadID);

    // حذف الرسالة بعد 5 دقائق
    setTimeout(() => api.unsendMessage(info.messageID).catch(() => {}), 5 * 60 * 1000);

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ حدث خطأ أثناء جلب النكتة.", threadID);
  }
};
