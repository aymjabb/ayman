module.exports.config = {
  name: "سيرا",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "ايمن 🐾 | ID: 61577861540407",
  description: "سيرا تشان يغادر كل الجروبات مع رسالة زخرفية وفخمة ✅",
  commandCategory: "المطور",
  usages: ".سيرا غادري من الكل",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  let text = args.join(" ") || "💌 سيرا تشان تقول: وداعًا يا جماعة 😹💨🌟";

  if (text.toLowerCase() === "غادري من الكل") {
    api.getThreadList(100, null, ["INBOX"], async (err, list) => {
      if (err) throw err;
      let count = 0;
      for (const item of list) {
        if (item.isGroup && item.threadID != event.threadID) {
          try {
            await api.sendMessage(`🌸 ${text}\n\n✨ مغادرة من سيرا تشان 🐾 | ايمن`, item.threadID);
            await api.removeUserFromGroup(api.getCurrentUserID(), item.threadID);
            count++;
          } catch (e) {
            console.error(`خطأ في الجروب ${item.threadName || item.threadID}:`, e.message);
          }
        }
      }
      api.sendMessage(`🎉 سيرا غادرت ${count} جروب بنجاح! ✅\n💫 بواسطة ايمن 🐾`, event.threadID);
    });
  } else {
    return api.sendMessage("❌ لو تبي سيرا تغادر كل الجروبات، اكتب: '.سيرا غادري من الكل'", event.threadID);
  }
};
