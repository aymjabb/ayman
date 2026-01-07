module.exports.config = {
  name: "تنظيف",
  version: "1.1.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "تنظيف الشات برسائل طويلة طريفة",
  commandCategory: "الادارة",
  usages: ".تنظيف عدد",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, permssion }) {

  const DEVELOPERS = ["61577861540407"];

  if (permssion < 1 && !DEVELOPERS.includes(event.senderID)) {
    return api.sendMessage(
      "╭━━━〔 🚫 رفض 〕━━━╮\nالأمر للمشرفين والمطور فقط\n╰━━━━━━━━━━━━━━╯",
      event.threadID,
      event.messageID
    );
  }

  const count = parseInt(args[0]);
  if (isNaN(count) || count < 1 || count > 20) {
    return api.sendMessage(
      "⚠️ الاستخدام:\n.تنظيف 5\n(الحد الأقصى 20)",
      event.threadID,
      event.messageID
    );
  }

  // عبارة طريفة من سيرا تشان
  const header =
`سيرا تشان دخلت 🧹✨
تنظيف بصري قيد التنفيذ 😌
غمّض عيونك لو تحب 🌸
`;

  // يولد فراغات كثيرة جدًا (أطول من 100 مرة)
  const longSpace = "\n".repeat(300);

  const footer = "— سيرا تشان هنا ✨";

  const cleanMsg = header + longSpace + footer;

  for (let i = 0; i < count; i++) {
    await api.sendMessage(cleanMsg, event.threadID);
  }
};
