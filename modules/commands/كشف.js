const fs = require("fs-extra");
const path = require("path");

// ملف لحفظ المكتمين ليكون الكتم دائم حتى بعد إعادة تشغيل البوت
const mutedPath = path.join(__dirname, "cache/seraMuted.json");
if (!fs.existsSync(mutedPath)) fs.writeFileSync(mutedPath, JSON.stringify([]));
let globalMuted = JSON.parse(fs.readFileSync(mutedPath, "utf-8"));
if (!global.seraMuted) global.seraMuted = globalMuted;

module.exports.config = {
  name: "كتم",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "Ayman",
  description: "كتم عضو ومنعه من الكلام (حذف رسائله تلقائياً)",
  commandCategory: "إدارة",
  cooldowns: 0
};

// حذف رسائل العضو المكتم فوراً
module.exports.handleEvent = async ({ api, event }) => {
  const { senderID, messageID } = event;
  if (!senderID || !messageID) return;

  if (global.seraMuted.includes(senderID)) {
    try {
      await api.unsendMessage(messageID);
      console.log(`🟢 تم حذف رسالة العضو المكتم: ${senderID}`);
    } catch (err) {
      console.error(`❌ فشل حذف رسالة العضو ${senderID}: ${err.message}`);
    }
  }
};

// أوامر الكتم وفكه
module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageReply, mentions, type } = event;

  // تحديد العضو المستهدف: رد أو تاغ
  let targetID = null;
  if (type === "message_reply" && messageReply) targetID = messageReply.senderID;
  else if (mentions && Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];

  // أمر فك الكتم
  if (args[0] && args[0].toLowerCase() === "فك") {
    if (!targetID) return api.sendMessage("👤 منشن الشخص أو رد على رسالته لفك الكتم.", threadID);
    global.seraMuted = global.seraMuted.filter(id => id !== targetID);
    fs.writeFileSync(mutedPath, JSON.stringify(global.seraMuted, null, 2));
    return api.sendMessage(
      `🔓 تم فك الكتم بنجاح!\n✅ العضو يمكنه الآن إرسال الرسائل.\n──────────────────\n🐾 بواسطة سيرا تشان`,
      threadID
    );
  }

  // إذا لم يُحدد العضو
  if (!targetID) return api.sendMessage("👤 منشن الشخص أو رد على رسالته لكتمه.", threadID);

  // إضافة العضو للكتم إذا لم يكن موجوداً
  if (!global.seraMuted.includes(targetID)) {
    global.seraMuted.push(targetID);
    fs.writeFileSync(mutedPath, JSON.stringify(global.seraMuted, null, 2));
  }

  return api.sendMessage(
    `🤫 تم كتم العضو بنجاح!\n──────────────────\n📛 أي رسالة يرسلها سيتم حذفها تلقائياً بواسطة سيرا تشان.\n🐾 احترس!`,
    threadID
  );
};
