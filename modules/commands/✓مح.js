const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "مح",
  version: "1.2.0",
  hasPermssion: 1,
  credits: "سيرا تشان",
  description: "طرد الأعضاء والأدمنز مع حماية المطور وسخرية عند محاولة الطرد",
  commandCategory: "المطور",
  usages: ".مح @أو رد على رسالة الشخص",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const botID = api.getCurrentUserID();
  const DEV_ID = "61577861540407"; // ايديك كمطور

  // تحديد الهدف
  let targetID;
  if (messageReply) targetID = messageReply.senderID;
  else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
  else return api.sendMessage("😑 لازم تحدد شخص بالمنشن أو ترد على رسالته.", threadID, messageID);

  // تأكد أن البوت أدمن
  const info = await api.getThreadInfo(threadID);
  if (!info.adminIDs.some(a => a.id == botID))
    return api.sendMessage("❌ لازم أكون أدمن عشان أطبق الحكم 😼", threadID, messageID);

  const senderIsAdmin = info.adminIDs.some(a => a.id == senderID);
  if (!senderIsAdmin)
    return api.sendMessage("😂 مو أدمن وجاي تطرد؟ روح العب بعيد.", threadID, messageID);

  // محاولة طرد سيرا تشان أو تنزيله
  if (targetID === DEV_ID) {
    if (senderIsAdmin) {
      await api.changeAdminStatus(threadID, senderID, false); // تنزيل الأدمن الخائن
      const msg = `🚨 خيانة مكتشفة 🚨
      
😂 حاولت تطرد سيرا تشان أو تنزيله من الأدمن؟
انقلب السحر على الساحر!

⬇️ تم تنزيلك من الأدمن
👤 صرت عضو عادي
🐍 الخيانة ما تنفع هنا

✦ سيرا تشان تراقب ✦`;
      
      // إرسال صورة ساخرة من الإنترنت
      const gifUrl = "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"; // GIF سخري
      const path = __dirname + "/cache/sarcasm.gif";
      const response = await axios({ url: gifUrl, responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      
      return api.sendMessage({ body: msg, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path));
    }
    return api.sendMessage("😂 لا يمكن طرد المطور! سيرا تشان فوق كل شيء 🐾", threadID, messageID);
  }

  // طرد الهدف العادي أو الأدمن
  await api.removeUserFromGroup(targetID, threadID);
  return api.sendMessage(
`☠️ تم تنفيذ الحكم ☠️

👢 ${(mentions[targetID] || "العضو")} 
انمسح من الكروب بلا رحمة

⚡ بأمر الأدمن
🐾 وتحت عين سيرا تشان`,
    threadID
  );
};
