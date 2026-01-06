const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

// دالة زخرفة النص بأسلوب ASCII أنمي
function decorateText(text) {
  const symbols = ["★","☆","✧","✦","✩","✪","⚡","☄","☯","❂","❉"];
  return text.split("").map(c => {
    if (c === " ") return "  ";
    return symbols[Math.floor(Math.random()*symbols.length)] + c + symbols[Math.floor(Math.random()*symbols.length)];
  }).join("");
}

module.exports.config = {
  name: "معلمي",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Sera",
  description: "معلومات المعلم بطابع أنمي ASCII مزخرف + شكر وتقدير",
  commandCategory: "معلومات",
  usages: ".معلمي",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  const bgURL = "https://i.ibb.co/99N6spNX/temp-1767739835381.jpg";
  const avatarURL = "https://graph.facebook.com/61584059280197/picture?width=512&height=512";

  const bgPath = path.join(__dirname, "cache", "bg.jpg");
  const avatarPath = path.join(__dirname, "cache", "avatar.jpg");
  const finalPath = path.join(__dirname, "cache", "teacher_final.png");

  try {
    // تحميل الخلفية
    const bgRes = await axios.get(bgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(bgRes.data));

    // تحميل الصورة الشخصية
    const avatarRes = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(avatarPath, Buffer.from(avatarRes.data));

    // قراءة الصور
    const bg = await jimp.read(bgPath);
    const avatar = await jimp.read(avatarPath);

    // تكبير وتصغير الصورة الشخصية ووضعها على الصدر
    avatar.resize(200, 200);
    const x = bg.bitmap.width / 2 - 100;
    const y = bg.bitmap.height / 2;
    bg.composite(avatar, x, y);

    // تحميل خط
    const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

    // المعلومات مع زخارف ASCII
    const infoLines = [
      decorateText("🌀 الأب الروحي للبوتات والتطوير"),
      decorateText("🇾🇪 من اليمن"),
      decorateText("🎂 عمره 20 سنة"),
      decorateText("💻 مطور ومبرمج")
    ];

    // شكر وتقدير أسفل الصورة
    const thanksLines = [
      decorateText("🙏 شكر وتقدير للمعلم الكريم 🌸"),
      decorateText("✨ على كل الدعم والتطوير والمجهود الكبير ✨"),
      decorateText("🌟 دائما مثال وقدوة لنا في البرمجة والبوتات 🌟")
    ];

    // كتابة المعلومات
    let offsetY = y + 220;
    for (let line of infoLines) {
      bg.print(font, 50, offsetY, line);
      offsetY += 50;
    }

    // كتابة الشكر أسفل المعلومات
    let thanksY = offsetY + 30;
    for (let line of thanksLines) {
      bg.print(font, 50, thanksY, line);
      thanksY += 50;
    }

    // حفظ الصورة النهائية
    await bg.writeAsync(finalPath);

    // إرسال الرسالة
    await api.sendMessage({
      body: "✨ معلومات المعلم + شكر وتقدير بطابع سيرا ASCII 🌸",
      attachment: fs.createReadStream(finalPath)
    }, threadID, () => {
      fs.unlinkSync(bgPath);
      fs.unlinkSync(avatarPath);
      fs.unlinkSync(finalPath);
    });

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ حدث خطأ أثناء تجهيز الصورة.", threadID);
  }
};
