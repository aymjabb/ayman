module.exports.config = {
  name: "ريستارت",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Sera Chan",
  description: "إعادة تشغيل البوت",
  commandCategory: "المطور",
  usages: ".رست",
  cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
  const DEV = [
    "61586019840418", // سيرا تشان
    "61577861540407"  // انت
  ];

  if (!DEV.includes(event.senderID))
    return api.sendMessage("❌ هذا الأمر للمطور فقط.", event.threadID, event.messageID);

  await api.sendMessage(
`╭━━━〔 🔁 SERA RESTART 〕━━━╮
⚙️ جارِ إعادة تشغيل سيرا تشان…
✨ ارجع بعد ثواني
╰━━━━━━━━━━━━━━━━━━━━╯`,
    event.threadID,
    event.messageID
  );

  // ريستارت فعلي
  process.exit(1);
};
