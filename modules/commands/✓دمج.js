const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "دمج",
  version: "1.3",
  hasPermssion: 0,
  credits: "أيمن 🌟💖",
  description: "دمج الإيموجي بطريقة ممتعة وعفوية 💫",
  commandCategory: "العاب",
  usages: "دمج [إيموجي1] [إيموجي2]",
  cooldowns: 5,
  dependencies: {
    "axios": " ",
    "fs-extra": " "
  },
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;
  const readStream = [];
  const emoji1 = args[0];
  const emoji2 = args[1];

  if (!emoji1 || !emoji2)
    return api.sendMessage(
      "❌ خطأ! هيك دمج 🙂😉\n⚡ لاتنسى فراغ بين الإيموجيات!",
      threadID
    );

  const generate1 = await generateEmojimix(emoji1, emoji2);
  const generate2 = await generateEmojimix(emoji2, emoji1);

  if (generate1) readStream.push(generate1);
  if (generate2) readStream.push(generate2);

  if (readStream.length == 0)
    return api.sendMessage(
      `😿 اوووف! مش ممكن دمج ذا ${emoji1} مع ذا ${emoji2} 💫`,
      threadID
    );

  const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🎇","🌈","🌀"];
  const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];

  api.sendMessage(
    {
      body: `💖🌟 تم دمج الإيموجيات! 🌟💖\n${randomDeco()} ${emoji1} + ${emoji2} = 😻💫\nSera Chan تقول: واو! مذهل 😹✨`,
      attachment: readStream
    },
    threadID
  );
};

async function generateEmojimix(emoji1, emoji2) {
  try {
    const { data: response } = await axios.get(
      "https://goatbotserver.onrender.com/taoanhdep/emojimix",
      {
        params: { emoji1, emoji2 },
        responseType: "stream"
      }
    );
    response.path = `emojimix_${Date.now()}.png`;
    return response;
  } catch (e) {
    return null;
  }
}
