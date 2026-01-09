const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Canvas loader ذكي
let createCanvas, loadImage;
try {
  const canvas = require("canvas");
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
  console.log("✅ استخدام canvas العادي");
} catch (e) {
  const napi = require("@napi-rs/canvas");
  createCanvas = napi.createCanvas;
  loadImage = napi.loadImage;
  console.log("✅ fallback إلى @napi-rs/canvas");
}

module.exports.config = {
  name: "غيري",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SOMI",
  description: "تغيير خلفية الصورة ذكي مع fallback",
  commandCategory: "🖼️ صور",
  usages: "خلفية <وصف>",
  cooldowns: 15
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments?.[0])
      return api.sendMessage(
        "❌ رد على صورة واكتب:\nخلفية علم العراق",
        event.threadID,
        event.messageID
      );

    const query = args.join(" ");
    if (!query)
      return api.sendMessage("❌ اكتب وصف الخلفية", event.threadID);

    const imgUrl = event.messageReply.attachments[0].url;

    const userImg = path.join(__dirname, `/cache/user.png`);
    const outImg = path.join(__dirname, `/cache/out.png`);

    // تحميل صورة المستخدم
    const img = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(userImg, img.data);

    // جلب خلفية عشوائية من Unsplash
    const bgUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
    const bg = await loadImage(bgUrl);
    const person = await loadImage(userImg);

    // تركيب الصورة والخلفية
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(
      person,
      bg.width * 0.25,
      bg.height * 0.15,
      bg.width * 0.5,
      bg.height * 0.7
    );

    fs.writeFileSync(outImg, canvas.toBuffer("image/png"));

    api.sendMessage(
      {
        body: `✨ تم تغيير الخلفية: ${query}`,
        attachment: fs.createReadStream(outImg)
      },
      event.threadID,
      () => {
        fs.unlinkSync(userImg);
        fs.unlinkSync(outImg);
      }
    );

  } catch (err) {
    console.error(err);
    api.sendMessage("⚠️ فشل تغيير الخلفية (المكتبات أو الصورة)", event.threadID);
  }
};
