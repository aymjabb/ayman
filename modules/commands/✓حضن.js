const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "حضن",
  version: "3.3.0",
  hasPermssion: 0,
  credits: "عمر & Sera Chan",
  description: "حضن شخص بتاغ 🥰🐱😺 - نسخة محسنة",
  commandCategory: "ترفية",
  usages: "[@منشن]",
  cooldowns: 5
};

module.exports.onLoad = async () => {
  const dir = path.join(__dirname, "cache/canvas/");
  const bgPath = path.join(dir, "hugv2.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(bgPath)) {
    const url = "https://i.ibb.co/6RF2LXMW/temp-1767738583265.jpg";
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(res.data));
  }
};

async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const __root = path.resolve(__dirname, "cache/canvas");
  const baseImg = await jimp.read(path.join(__root, "hugv2.png"));
  const bgWidth = baseImg.bitmap.width;
  const bgHeight = baseImg.bitmap.height;

  const pathImg = path.join(__root, `hug_${one}_${two}.png`);
  const avatarOnePath = path.join(__root, `avt_${one}.png`);
  const avatarTwoPath = path.join(__root, `avt_${two}.png`);

  // تحميل الصور
  const avatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarOnePath, Buffer.from(avatarOne));
  fs.writeFileSync(avatarTwoPath, Buffer.from(avatarTwo));

  const circleOne = await jimp.read(await circle(avatarOnePath));
  const circleTwo = await jimp.read(await circle(avatarTwoPath));

  // حجم الصور ديناميكي بالنسبة للخلفية
  const sizeOne = Math.floor(bgWidth * 0.25); // 25% من عرض الخلفية
  const sizeTwo = Math.floor(bgWidth * 0.22);

  // إحداثيات مناسبة لوضع الصور على الجسم وليس الوجه
  const posOne = { x: Math.floor(bgWidth * 0.25), y: Math.floor(bgHeight * 0.4) };
  const posTwo = { x: Math.floor(bgWidth * 0.55), y: Math.floor(bgHeight * 0.5) };

  baseImg.composite(circleOne.resize(sizeOne, sizeOne), posOne.x, posOne.y)
         .composite(circleTwo.resize(sizeTwo, sizeTwo), posTwo.x, posTwo.y);

  await baseImg.writeAsync(pathImg);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return pathImg;
}

module.exports.run = async function({ event, api, Users }) {
  const { threadID, messageID, senderID, mentions } = event;
  if (!Object.keys(mentions).length) 
    return api.sendMessage("😹 منشن شخص عشان تحضنه!", threadID, messageID);

  const targetID = Object.keys(mentions)[0];
  const nameSender = await Users.getNameUser(senderID);
  const nameTarget = await Users.getNameUser(targetID);

  const imagePath = await makeImage({ one: senderID, two: targetID });

  return api.sendMessage({
    body: `🥰 حضن دافئ لك ولـ ${nameTarget} 🐱😺`,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
