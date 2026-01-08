const axios = require('axios');

module.exports.config = {
  name: "رابط",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "عمر & سيرا تشان",
  description: "تحويل صورك لروابط دائمة بأعلى جودة ✨",
  usePrefix: true,
  commandCategory: "خدمات سيرا",
  usages: "[رد على صورة]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply, type, attachments } = event;
  let links = [];

  // جلب الروابط من الرد أو المرفقات المباشرة
  if (type === "message_reply" && messageReply.attachments.length > 0) {
    for (let item of messageReply.attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  } else if (attachments.length > 0) {
    for (let item of attachments) {
      if (item.type === "photo") links.push(item.url);
    }
  }

  if (links.length === 0) {
    return api.sendMessage('╭──── • ◈ • ────╮\n  يوه! وين الصورة؟ ✨\n╰──── • ◈ • ────╯\n\nرد على صورة أو أرسلها مع الأمر عشان سيرا تعطيك الرابط! 🐾', threadID, messageID);
  }

  api.sendMessage(`✨ سيرا جالسة ترفع ${links.length} صورة.. ثواني يا عسل! 🐾`, threadID, messageID);

  let result = [];
  try {
    for (let url of links) {
      // الرفع عبر API بديل ومستقر (Catbox أو Imgur عبر بروكسي)
      const res = await axios.get(`https://api.vhtear.com/image_uploader?img=${encodeURIComponent(url)}&apikey=SeraChan_Free`);
      
      // إذا فشل الـ API الأول، نستخدم المحرك الثاني (Imgur المباشر)
      if (res.data && res.data.result) {
        result.push(res.data.result);
      } else {
        // محرك احتياطي سريع
        const backup = await axios.get(`https://api.sandipbaruwal.com/imgur?url=${encodeURIComponent(url)}`);
        if (backup.data && backup.data.url) {
            result.push(backup.data.url);
        }
      }
    }

    if (result.length === 0) throw new Error("فشل الرفع من جميع المصادر");

    let replyMsg = `╭──── • ◈ • ────╮\n  تـم تـجـهـيـز الـروابـط ✨\n╰──── • ◈ • ────╯\n\n`;
    result.forEach((link, i) => {
      replyMsg += `🖼️ الـرابط ${i + 1}:\n🔗 ${link}\n\n`;
    });
    replyMsg += `🐾 سيرا تتمنى لك يوماً سعيداً! ✨`;

    return api.sendMessage(replyMsg, threadID, messageID);

  } catch (err) {
    console.error(err);
    // محاولة أخيرة بسيطة جداً في حال تعطلت كل الـ APIs
    return api.sendMessage('🥺 سيرا اعتذرت! الرفع حالياً فيه مشكلة بالسيرفر، جرب بعد شوي يا بطل.', threadID, messageID);
  }
};
