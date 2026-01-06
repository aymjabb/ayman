module.exports.config = {
  name: "ابتايم",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mustapha • مزخرف من قبل سيرا تشان",
  description: "عرض معلومات السيرفر بأسلوب أسطوري ومزخرف 😻✨",
  commandCategory: "النظام",
  usages: ".ابتايم",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  const os = require("os");
  const moment = require("moment-timezone");

  // مدة التشغيل
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  // الذاكرة
  const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
  const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
  const usedMem = totalMem - freeMem;
  const memUsage = ((usedMem / totalMem) * 100).toFixed(0);

  // المعالج ونظام التشغيل
  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;
  const osType = `${os.type()} ${os.release()}`;
  const currentTime = moment.tz("Africa/Algiers").format("YYYY-MM-DD | HH:mm:ss");

  // زخارف وإيموجيات
  const deco = ["✨","💖","🌸","🌟","💫","😻","🔥","🌀","🎇","🌈"];
  const randomDeco = () => deco[Math.floor(Math.random() * deco.length)];
  const spark = () => Array.from({length:3},()=>randomDeco()).join("");

  // رسائل إضافية حسب حالة الرام
  let ramComment = "";
  if (memUsage > 80) ramComment = `😱 واو! الرام مشغول كثير ${spark()}`;
  else if (memUsage > 50) ramComment = `⚡ السيرفر نشيط ${spark()}`;
  else ramComment = `💖 السيرفر هادي مسترخي ${spark()}`;

  const message = `
🌟✨💖 سيرا تشان تقول: مرحبًا! 💖✨🌟

🌈📊 === بيانات السيرفر الأسطورية === 📊🌈

⏳ مدة تشغيل البوت: ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية ${spark()}

🖥️ نظام التشغيل: ${osType} ${spark()}

🧠 عدد الأنوية: ${cpuCores} ${spark()}

⚙️ نوع المعالج: ${cpuModel} ${spark()}

💾 ذاكرة كلية: ${totalMem} MB ${spark()}

📉 ذاكرة متاحة: ${freeMem} MB ${spark()}

📊 استهلاك الرام: ${memUsage}% ${spark()} ${ramComment}

🕰️ الوقت الحالي: ${currentTime} ⏰ ${spark()}

💫✨🌸 "سيرا تشان ترقب كل شيء!" 🌸✨💫
`;

  api.sendMessage(message, event.threadID, event.messageID);
};
