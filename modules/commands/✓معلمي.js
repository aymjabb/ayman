const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "معلمي",
  version: "2.7.3",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "Teacher appreciation message",
  commandCategory: "info",
  usages: ".معلمي",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  // معرف المعلم ورابط الصورة
  const teacherUID = "61584059280197";
  const imgURL = `https://graph.facebook.com/${teacherUID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`; 
  
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
      try { fs.mkdirSync(cacheDir, { recursive: true }); } 
      catch (err) { console.error(err); }
  }

  const imgPath = path.join(cacheDir, `sensei_${Date.now()}.jpg`);

  // وضع النص العربي في متغير بترميز واضح
  const line = "──────────────────";
  const msg = 
    "\n🌸 سـلامٌ مـن سـيـرا تـشـان! 🌸\n" + line +
    "\n✨ إلـى الـمـعـلـم الـفـاضـل.. ✨\n\n" +
    "🙏 يـسـرّنـي أن أقـدم لـك خـالـص الـشـكـر والـتـقـديـر، فـأنـت مـن وضـع حـجـر الأسـاس وألـهـم أيـمـن لـصـنـاعـتـي وتـطـويـري.\n\n" +
    "📖 \"بـفـضـل تـعـلـيـمـك وبـرعـتـك، أصـبـح لـلإبـداع عـنـوان.\"\n\n" +
    "💖 شـكـراً لـك يـا سـيـدي عـلـى كـل وقـتـك ومـجـهـودك.. سيرا وأيمن يـمـتـنّـان لـك للأبـد! 🐾\n" + line;

  try {
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(res.data));

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(imgPath)
    }, threadID, (err) => {
        if (err) console.error(err);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (e) {
    console.error(e);
    // رسالة خطأ بسيطة بدون رموز معقدة
    return api.sendMessage("🥺 فشل جلب الصورة، شكراً لك يا معلمي! ✨", threadID, messageID);
  }
};
