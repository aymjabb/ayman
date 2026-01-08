module.exports.config = {
  name: "سكوت",
  version: "1.3.0",
  hasPermssion: 2,
  credits: "Ayman",
  description: "وضع السكوت الإجباري",
  commandCategory: "حماية",
  cooldowns: 5,
  allowedThreads: [],
  isOn: false
};

module.exports.handleEvent = async ({ api, event }) => {
  if (!this.config.isOn || !this.config.allowedThreads.includes(event.threadID)) return;
  const adminConfig = ["61577861540407"]; // ايديك
  if (adminConfig.includes(event.senderID) || event.senderID == api.getCurrentUserID()) return;

  api.removeUserFromGroup(event.senderID, event.threadID);
  api.sendMessage(`⚠️ هدوء!!\n──────────────────\nالزعيم أيمن أمر بالسكوت.. ممنوع الكلام هنا!`, event.threadID);
};

module.exports.run = async ({ api, event, args }) => {
  if (args[0] === "تشغيل") {
    this.config.isOn = true;
    this.config.allowedThreads.push(event.threadID);
    return api.sendMessage("🔇 تم تفعيل وضع السكوت الملكي. لا صوت يعلو فوق صوت الصمت.", event.threadID);
  }
  this.config.isOn = false;
  return api.sendMessage("🔊 تم إلغاء وضع السكوت.", event.threadID);
};
