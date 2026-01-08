const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// مصفوفة القصائد
const poems = [
  { poet: "المتنبي", lines: ["إِذَا غـــامَرْتَ فِي شَـرَفٍ مَــرُومِ", "فَــلا تَـقْـنَــعْ بِـمَا دُونَ النُّجُــومِ"] },
  { poet: "أحمد شوقي", lines: ["قِـمْ لِلْمُعَلِّمِ وَفِّهِ التَّبْجِيـلَا", "كَـادَ الْـمُعَلِّمُ أَنْ يَـكُونَ رَسُـولَا"] },
  { poet: "نزار قباني", lines: ["هـو الحُـبُ أَنْ تـعـيـشَ مَعَ مَن تُـحِبُّ", "هـو أَنْ تَمُـوتَ عَلَى فِكْـرَةِ الحُـبِّ"] }
];

module.exports.config = {
  name: "المطور",
  version: "11.0.0",
  hasPermssion: 0,
  credits: "Sera Chan & Ayman",
  description: "عرض معلومات المطور مع ميزات الهيبة والتعريف الشخصي ✨",
  commandCategory: "المطور",
  usages: ".المطور",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;
  const ayID = "61577861540407"; // الآيدي الخاص بك

  // --- قائمة صورك الشخصية (تتغير كل مرة) ---
  const aymanImages = [
    "https://i.ibb.co/Mx3x6c4y/temp-1767664619825.jpg",
    "https://i.imgur.com/k6O6P6X.jpg",
    "https://i.imgur.com/mXWf9Z0.jpg"
  ];

  // --- قائمة GIFs أنمي أسطورية (تتغير كل مرة) ---
  const animeGifs = [
    "https://i.pinimg.com/originals/f3/78/33/f37833054366657c919793f773347b74.gif",
    "https://i.pinimg.com/originals/11/49/71/114971c22c073f3241b7f03577317737.gif",
    "https://i.pinimg.com/originals/81/29/49/8129497e70390467558f3348123c52e1.gif"
  ];

  try {
    const randomImg = aymanImages[Math.floor(Math.random() * aymanImages.length)];
    const randomGif = animeGifs[Math.floor(Math.random() * animeGifs.length)];
    const randomPoem = poems[Math.floor(Math.random() * poems.length)];

    const imgPath = path.join(__dirname, "cache", `ayman_${Date.now()}.jpg`);
    const gifPath = path.join(__dirname, "cache", `anime_${Date.now()}.gif`);

    const imgRes = await axios.get(randomImg, { responseType: "arraybuffer" });
    const gifRes = await axios.get(randomGif, { responseType: "arraybuffer" });

    fs.outputFileSync(imgPath, Buffer.from(imgRes.data));
    fs.outputFileSync(gifPath, Buffer.from(gifRes.data));

    let poemText = `╭─────── ✦🌌✦ ───────╮\n👑 شاعر: ${randomPoem.poet}\n`;
    randomPoem.lines.forEach(line => { poemText += `☁️ ${line}\n`; });
    poemText += `╰─────── ✦🌌✦ ───────╯`;

    const infoMsg = `
╔════════════════════════════════════╗
        👑🔥 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥 🔥👑
╚════════════════════════════════════╝

🧑‍💻┃ 𝗡𝗔𝗠𝗘 :
「 ᎯᎽᎷᎯᏁ ᎯᏝᏰᎯᏦᏒᎨ 」

🌍┃ 𝗖𝗢𝗨𝗡𝗧𝗥𝗬 : 「 العراق 🇮🇶 」
🎂┃ 𝗔𝗚𝗘 : 「 18 سنة 」

📸┃ 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 :
「 https://www.instagram.com/x_v_k1?igsh=MWtzdzBpOXp3YWU0 」

📘┃ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 :
「 https://www.facebook.com/xvk1c 」

${poemText}

🤖┃ 𝗦𝗘𝗥𝗔 𝗖𝗛𝗔𝗡 𝗕𝗢𝗧
⚡┃ 𝗗𝗲𝘃 • 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 • 𝗚𝗮𝗺𝗲𝘀
🔥┃ 𝗔𝗻𝗶𝗺𝗲 • 𝗛𝗮𝗰𝗸𝗲𝗿 • 𝗩𝗜𝗣

✨ 「 الهيبة لا تُشترى، بل تُصنع بيد أيمن البكري 」 ✨
`;

    return api.sendMessage({
      body: infoMsg,
      attachment: [fs.createReadStream(imgPath), fs.createReadStream(gifPath)]
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      if (fs.existsSync(gifPath)) fs.unlinkSync(gifPath);
    }, messageID);

  } catch (e) {
    return api.sendMessage("🥺 سيرا فشلت في جلب صور الهيبة.. جرب مرة ثانية!", threadID, messageID);
  }
};
