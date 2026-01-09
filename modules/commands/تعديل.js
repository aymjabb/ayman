const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// تحميل Canvas (مع fallback على @napi-rs/canvas)
let createCanvas, loadImage;
try {
  const canvas = require("canvas");
  createCanvas = canvas.createCanvas;
  loadImage = canvas.loadImage;
} catch (e) {
  const napi = require("@napi-rs/canvas");
  createCanvas = napi.createCanvas;
  loadImage = napi.loadImage;
}

module.exports.config = {
  name: "تغير",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "SOMI & Sera",
  description: "تغيير خلفية الصورة مع fallback تلقائي",
  commandCategory: "🖼️ صور",
  usages: "خلفية <وصف> (رد على صورة)",
  cooldowns: 15
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, messageReply } = event;

  try {
    // التحقق من الرد على صورة
    if (!messageReply || !messageReply.attachments?.[0] || messageReply.attachments[0].type !== "photo")
      return api.sendMessage(
        "❌ يرجى الرد على صورة واكتب:\nخلفية <وصف>",
        threadID,
        messageID
      );

    const query = args.join(" ");
    if (!query)
      return api.sendMessage("❌ اكتب وصف الخلفية", threadID);

    const imgUrl = messageReply.attachments[0].url;

    // مسارات الملفات المؤقتة
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    const userImg = path.join(cacheDir, `user_${Date.now()}.png`);
    const outImg = path.join(cacheDir, `out_${Date.now()}.png`);

    // تحميل صورة المستخدم
    const imgData = await axios.get(imgUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(userImg, imgData.data);

    // تحميل خلفية من Unsplash
    const bgUrl = `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
    const bg = await loadImage(bgUrl);
    const person = await loadImage(userImg);

    // إنشاء الكانفاس
    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    // رسم الخلفية وصورة المستخدم
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);
    ctx.drawImage(
      person,
      bg.width * 0.25,
      bg.height * 0.15,
      bg.width * 0.5,
      bg.height * 0.7
    );

    // حفظ الصورة الناتجة
    fs.writeFileSync(outImg, canvas.toBuffer("image/png"));

    // إرسال الصورة مع طابع سيرا تشان
    await api.sendMessage(
      {
        body: `✨ تم تغيير الخلفية بنجاح: ${query}\n🐾 بواسطة سيرا تشان`,
        attachment: fs.createReadStream(outImg)
      },
      threadID
    );

    // حذف الملفات المؤقتة
    [userImg, outImg].forEach(file => fs.existsSync(file) && fs.unlinkSync(file));

  } catch (err) {
    console.error("خطأ أثناء تغيير الخلفية:", err);
    return api.sendMessage("⚠️ فشل تغيير الخلفية، حاول مرة أخرى.", threadID, messageID);
  }
};
