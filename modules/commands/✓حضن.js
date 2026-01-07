const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "حضن",
  version: "3.4.0",
  hasPermssion: 0,
  credits: "عمر & Sera Chan",
  description: "حضن شخص بتاغ 🥰🐱😺 - بدون ظل أو نصوص إضافية",
  commandCategory: "ترفيه",
  usages: "[@منشن]",
  cooldowns: 5
};

module.exports.onLoad = async () => {
  const dir = path.join(__dirname, "cache/canvas/");
  const bgPath = path.join(dir, "hugv3.png");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(bgPath)) {
    const url = "https://i.ibb.co/6RF2LXMW/temp-1767738583265.jpg"; // الخلفية
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(res.data));
  }
};

// جعل الصورة دائرية
async function circle(imagePath) {
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

async function makeImage({ senderID, targetID }) {
  const __root = path.resolve(__dirname, "cache/canvas");
  const baseImg = await jimp.read(path.join(__root, "hugv3.png"));
  const bgWidth = baseImg.bitmap.width;
  const bgHeight = baseImg.bitmap.height;

  const pathImg = path.join(__root, `hug_${senderID}_${targetID}.png`);
  const avatarSenderPath = path.join(__root, `avt_${senderID}.png`);
  const avatarTargetPath = path.join(__root, `avt_${targetID}.png`);

  // تحميل الصور الشخصية
  const avatarSender = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const avatarTarget = (await axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(avatarSenderPath, Buffer.from(avatarSender));
  fs.writeFileSync(avatarTargetPath, Buffer.from(avatarTarget));

  const circleSender = await jimp.read(await circle(avatarSenderPath));
  const circleTarget = await jimp.read(await circle(avatarTargetPath));

  // حجم الصور ديناميكي
  const sizeSender = Math.floor(bgWidth * 0.25);
  const sizeTarget = Math.floor(bgWidth * 0.25);

  // الترتيب الطبيعي: المرسل على اليسار، المستهدف على اليمين
  const posSender = { x: Math.floor(bgWidth * 0.2), y: Math.floor(bgHeight * 0.4) };
  const posTarget = { x: Math.floor(bgWidth * 0.55), y: Math.floor(bgHeight * 0.4) };

  baseImg.composite(circleSender.resize(sizeSender, sizeSender), posSender.x, posSender.y)
         .composite(circleTarget.resize(sizeTarget, sizeTarget), posTarget.x, posTarget.y);

  await baseImg.writeAsync(pathImg);

  fs.unlinkSync(avatarSenderPath);
  fs.unlinkSync(avatarTargetPath);

  return pathImg;
}

module.exports.run = async function({ event, api, Users }) {
  const { threadID, messageID, senderID, mentions } = event;
  if (!Object.keys(mentions).length) 
    return api.sendMessage("😹 منشن شخص عشان تحضنه!", threadID, messageID);

  const targetID = Object.keys(mentions)[0];

  const imagePath = await makeImage({ senderID, targetID });

  return api.sendMessage({
    body: `🥰 حضن دافئ لك ولـ ${await Users.getNameUser(targetID)} 🐱😺`,
    attachment: fs.createReadStream(imagePath)
  }, threadID, () => fs.unlinkSync(imagePath), messageID);
};
