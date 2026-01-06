module.exports.config = {
  name: "حضن2",
  version: "7.4.0",
  hasPermssion: 0,
  credits: "عمر",
  description: "حضن شخص بمنشن 🥰🐱😺",
  commandCategory: "صور",
  usages: "[@منشن]",
  cooldowns: 5,
  dependencies: {
      "axios": "",
      "fs-extra": "",
      "path": "",
      "jimp": ""
  }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'hugv4.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.ibb.co/wFkRNNYp/temp-1767738730490.jpg", path);
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let base_img = await jimp.read(__root + "/hugv4.png");
  let pathImg = __root + `/hug_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));

  // وضع الصور الدائرية على الخلفية
  base_img.composite(circleOne.resize(220, 220), 200, 50)
          .composite(circleTwo.resize(220, 220), 490, 200);

  let raw = await base_img.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {    
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) 
      return api.sendMessage("😹 يا حلو، منشن شخص عشان تحضنه! 🐱😺", threadID, messageID);

  const one = senderID, two = mention[0];
  return makeImage({ one, two }).then(path => 
      api.sendMessage({ 
          body: `🥰 حضن دافئ لك ولـ ${global.data.userName.get(two) || "الشخص الممنشن"} 🐱😺`, 
          attachment: fs.createReadStream(path) 
      }, threadID, () => fs.unlinkSync(path), messageID)
  );
};
