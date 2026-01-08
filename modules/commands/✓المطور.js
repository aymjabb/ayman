const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "المطور",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "عرض معلومات المطور مع ميزات خاصة لأيمن ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 10
};

module.exports.run = async ({ api, event, Users }) => {
  const { threadID, messageID, senderID } = event;
  const ayID = "61577861540407"; // الـ ID الخاص بك (أيمن)

  // روابط GIF أنمي مظلم وهيبة (خاصة لأيمن)
  const darkGifs = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndm0zd3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z/l41lS25867R0Y/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndm0zd3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z/tS9P4ZYm9H89G/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndm0zd3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z/vVzH2XY3m0hx6/giphy.gif",
    "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJndm0zd3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z3Z/h79uTUEYvA5fG/giphy.gif"
  ];

  // قائمة بـ 10 صور منوعة وفخمة
  const images = [
    "https://i.imgur.com/k6O6P6X.jpg", "https://i.imgur.com/mXWf9Z0.jpg",
    "https://i.imgur.com/8N4N3u8.png", "https://i.imgur.com/vHqQ9Wv.png",
    "https://i.imgur.com/6XN5lOa.png", "https://i.imgur.com/r6O5Msh.png",
    "https://i.imgur.com/3N4oU9F.png", "https://i.imgur.com/wVf590z.png",
    "https://i.imgur.com/XU7qE80.png", "https://i.imgur.com/Dba8SLo.png"
  ];

  const randomGif = darkGifs[Math.floor(Math.random() * darkGifs.length)];
  const randomImg = images[Math.floor(Math.random() * images.length)];
  const cachePath = path.join(__dirname, "cache", `dev_${senderID}.gif`);

  try {
    // تحديد الرابط حسب المرسل
    const targetUrl = (senderID == ayID) ? randomGif : randomImg;
    const response = await axios.get(targetUrl, { responseType: "arraybuffer" });
    fs.outputFileSync(cachePath, Buffer.from(response.data));

    let msg = "";
    if (senderID == ayID) {
      msg = `╭───━━━━━───╮\n   𓂀 𝔸𝕐𝕄𝔸ℕ 𝔸𝕃𝔹𝔸𝕂ℝ𝕀 𓂀\n╰───━━━━━───╯\n\n✨ أهـلاً بـمـلكي وسـيـدي أيمـن ✨\n\n🐾 الـوضـع: مـظـلـم / 𝗗𝗔𝗥𝗞 𝗠𝗢𝗗𝗘\n🐾 الـرتبـة: مـطـور سـيـرا الأسطوري\n🐾 الـحـالـة: هـيـبـة لا تـقـاوم 🔥\n\n" الـعـظـمـة لـيـسـت فـقـط فـي الـقـوة، بـل فـي الـتـأثـيـر.. "`;
    } else {
      msg = `╭───━━━━━───╮\n  ✨ 𝖣𝖤𝖵𝖤𝖫𝖮𝖯𝖤𝖱 𝖨𝖭𝖥𝖮 ✨\n╰───━━━━━───╯\n\n👑 الـمـطـور: 𝕒𝕪𝕞𝕒𝕟 𝕒𝕝𝕓𝕒𝕜𝕣𝕚\n🌍 الـبـلـد: الـعـراق 🇮🇶\n🎂 الـعـمـر: 18 سـنـة\n💻 مـبـرمـج نـظـام SERA\n\n🐾 سـيـرا تـقـول: " هـذا بـابـا أيمـن، أحـسـن مـبـرمـج بـالـكـون! " 🎀`;
    }

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage("🥺 سيرا تعبت وهي تحاول تجيب صور الهيبة.. جرب مرة ثانية!", threadID, messageID);
  }
};
