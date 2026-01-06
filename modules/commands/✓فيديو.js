module.exports.config = {
  name: "فيديو",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "ياسين • مزخرف بواسطة Sera Chan 🐱",
  description: "ابحث عن فيديوهات يوتيوب بطريقة مرحة مع طابع Sera Chan 😸",
  commandCategory: "خدمات",
  usages: "[اسم الفيديو أو رابط الفيديو]",
  cooldowns: 10,
  dependencies: { "ytdl-core": "", "simple-youtube-api": "", "axios": "", "fs-extra": "" }
};

// زخرفة ASCII لطابع Sera Chan
function decorateSeraChan() {
  const text = "Sera Chan 🐱 Video Fun";
  const symbols = ["═","╔","╗","╚","╝","─","•","✨","🐾"];
  return text.split("").map(c => c === " " ? "   " : symbols[Math.floor(Math.random()*symbols.length)] + c).join("");
}

// رسائل ودية من Sera Chan
function randomSeraMessage() {
  const messages = [
    "😺 هيا اختر الفيديو المفضل لديك!",
    "🐾 Sera Chan تقول: استمتع باليوتيوب مع قطط 😸",
    "✨ لا تنسى مشاهدة الفيديوهات بعناية ومرح!",
    "😻 اختيارات رائعة، أختار بعناية!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  try {
    const axios = global.nodemodule.axios;
    const fs = global.nodemodule["fs-extra"];
    const choice = parseInt(event.body.trim());
    const videos = handleReply.videos;
    const SeraText = decorateSeraChan();

    if (isNaN(choice) || choice < 1 || choice > videos.length) 
      return api.sendMessage(`⚠️ اختر رقمًا بين 1 و ${videos.length} فقط 😺`, event.threadID, event.messageID);

    const videoId = videos[choice - 1];
    const response = await axios.get(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl`, {
      params: { id: videoId },
      headers: {
        "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com",
        "x-rapidapi-key": handleReply.apiKey
      },
      responseType: "arraybuffer"
    });

    const videoPath = __dirname + "/cache/video.mp4";
    fs.writeFileSync(videoPath, Buffer.from(response.data));

    api.unsendMessage(handleReply.messageID);
    api.sendMessage({
      body: `🎬 فيديوك جاهز! ${SeraText}\n${randomSeraMessage()}`,
      attachment: fs.createReadStream(videoPath)
    }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ حدث خطأ أثناء تحميل الفيديو: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.run = async function({ api, event, args }) {
  try {
    const axios = global.nodemodule.axios;
    const fs = global.nodemodule["fs-extra"];
    const YouTube = global.nodemodule["simple-youtube-api"];
    const apiKey = "AIzaSyBRycaxsBIsmtjAtFJJYujIteWFmpiAtOg"; // يمكن إضافة أكثر من API Key
    const youtube = new YouTube(apiKey);
    const SeraText = decorateSeraChan();

    if (!args[0]) return api.sendMessage("⚠️ يرجى كتابة اسم الفيديو أو الرابط! 😺", event.threadID, event.messageID);

    const query = args.join(" ");
    let videos;

    if (query.includes("https://") || query.includes("youtu.be")) {
      // إذا كان رابط مباشر
      videos = [query.split(/v=|youtu.be\//)[1]];
    } else {
      // البحث في يوتيوب
      const searchResults = await youtube.searchVideos(query, 6);
      videos = searchResults.map(v => v.id);
      let msg = `🔎 وجدت ${videos.length} فيديوهات تطابق بحثك 🐱:\n\n`;
      let numSymbols = ["⓵","⓶","⓷","⓸","⓹","⓺"];
      searchResults.forEach((v, i) => {
        msg += `${numSymbols[i]} 《${v.durationFormatted}》 ${v.title}\n`;
      });
      msg += `\n✨ ${SeraText}\n${randomSeraMessage()}`;

      return api.sendMessage({ body: msg }, event.threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          videos: videos,
          apiKey: apiKey
        });
      }, event.messageID);
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage(`❌ حدث خطأ أثناء البحث: ${err.message}`, event.threadID, event.messageID);
  }
};
