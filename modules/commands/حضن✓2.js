const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "حضن2",
  version: "8.0.0",
  hasPermssion: 0,
  credits: "عمر & Sera Chan",
  description: "حضن شخص بمنشن 🥰🐱😺 - نسخة أنمي متقدمة مع ظل وأسماء",
  commandCategory: "صور",
  usages: "[@منشن]",
  cooldowns: 5
};

module.exports.onLoad = async() => {
  const dir = path.join(__dirname, "cache/canvas/");
  const bgPath = path.join(dir, "hugv4.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(bgPath)) {
    const url = "https://i.ibb.co/wFkRNNYp/temp-1767738730490.jpg";
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(res.data));
  }
};

async function circle(image) {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two, nameOne, nameTwo }) {
  const __root = path.resolve(__dirname, "cache/canvas");
  const base_img = await jimp.read(path.join(__root, "hugv4.png"));
  const bgWidth = base_img.bitmap.width;
  const bgHeight = base_img.bitmap.height;

  const pathImg = path.join(__root, `hug_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  // تحميل الصور الشخصية
  const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne));
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo));

  // عمل دائرة للصور
  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  // حجم الصور بالنسبة للخلفية
  const avatarSize = Math.floor(bgWidth * 0.25);

  // المواقع الديناميكية
  const posOne = { x: Math.floor(bgWidth * 0.2), y: Math.floor(bgHeight * 0.3) };
  const posTwo = { x: Math.floor(bgWidth * 0.55), y: Math.floor(bgHeight * 0.5) };

  // إضافة ظل خفيف أسفل الصور
  const shadow = new jimp(avatarSize, avatarSize, 0x00000080); // نصف شفاف
  base_img.composite(shadow, posOne.x + 10, posOne.y + 10, { mode: jimp.BLEND_SOURCE_OVER });
  base_img.composite(shadow, posTwo.x + 10, posTwo.y + 10, { mode: jimp.BLEND_SOURCE_OVER });

  // تركيب الصور
  base_img.composite(circleOne.resize(avatarSize, avatarSize), posOne.x, posOne.y)
          .composite(circleTwo.resize(avatarSize, avatarSize), posTwo.x, posTwo.y);

  // تحميل خط Jimp
  const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

  // كتابة أسماء الأشخاص أعلى الصور
  base_img.print(font, posOne.x, posOne.y - 40, nameOne, avatarSize);
  base_img.print(font, posTwo.x, posTwo.y - 40, nameTwo, avatarSize);

  const raw = await base_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  // حذف الصور المؤقتة
  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

module.exports.run = async function({ api, event, Users }) {
  const { threadID, messageID, senderID, mentions } = event;
  if (!Object.keys(mentions).length) 
    return api.sendMessage("😹 منشن شخص عشان تحضنه!", threadID, messageID);

  const targetID = Object.keys(mentions)[0];
  const nameSender = await Users.getNameUser(senderID);
  const nameTarget = await Users.getNameUser(targetID);

  const imagePath = await makeImage({ one: senderID, two: targetID, nameOne: nameSender, nameTwo: nameTarget });

  return api.sendMessage({
    body: `🥰 حضن أنمي دافئ لك ولـ ${nameTarget} 🐱😺`,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
