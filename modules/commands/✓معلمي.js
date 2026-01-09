const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "معلمي",
  version: "2.7.4",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "Teacher appreciation message",
  commandCategory: "info",
  usages: ".معلمي",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  // معرف المعلم
  const teacherUID = "61584059280197";

  // رابط الصورة بدون access_token (مستقر على Render)
  const imgURL = `https://graph.facebook.com/${teacherUID}/picture?width=512&height=512`;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch (err) {
      console.error("فشل إنشاء مجلد الكاش:", err);
    }
  }

  const imgPath = path.join(cacheDir, `sensei_${Date.now()}.jpg`);

  // النص العربي
  const line = "──────────────────";
  const msg =
    "\n🌸 سـلامٌ مـن سـيـرا تـشـان! 🌸\n" +
    line +
    "\n✨ إلـى الـمـعـلـم الـفـاضـل.. ✨\n\n" +
    "🙏 يـسـرّنـي أن أقـدم لـك خـالـص الـشـكـر والـتـقـديـر، فـأنـت مـن وضـع حـجـر الأسـاس وألـهـم أيـمـن لـصـنـاعـتـي وتـطـويـري.\n\n" +
    "📖 \"بـفـضـل تـعـلـيـمـك وبـرعـتـك، أصـبـح لـلإبـداع عـنـوان.\"\n\n" +
    "💖 شـكـراً لـك يـا سـيـدي عـلـى كـل وقـتـك ومـجـهـودك.. سيرا وأيمن يـمـتـنّـان لـك للأبـد! 🐾\n" +
    line;

  try {
    const res = await axios.get(imgURL, {
      responseType: "arraybuffer",
      timeout: 15000
    });

    fs.writeFileSync(imgPath, Buffer.from(res.data));

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      (err) => {
        if (err) console.error("خطأ الإرسال:", err);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      },
      messageID
    );

  } catch (err) {
    console.error("خطأ جلب الصورة:", err.message);
    return api.sendMessage(
      "🥺 فشل جلب الصورة، لكن محبتنا لك لا تفشل يا معلمي! ✨",
      threadID,
      messageID
    );
  }
};
