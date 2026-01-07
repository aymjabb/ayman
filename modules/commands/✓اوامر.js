module.exports.config = {
  name: "اوامر",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Sera Chan",
  description: "قائمة أوامر البوت بطابع أنمي مع اختيار الفئات بالرد على الرقم",
  commandCategory: "النظام",
  usages: ".اوامر",
  cooldowns: 5
};

// إضافة فئات وأوامر
const categories = {
  "ترفيه": ["تخييلي", "مغادرةالكل", "سلاحي", "اطرديني", "ترامب", "مستوى", "اكشن", "هدية", "شخصية", "كت",
             "كنية", "لوخيروك", "اقتباسات", "اذكار", "باند", "كهف", "احسب", "adc", "سرقة", "موتي",
             "دراما", "فيس", "جزاء", "رفع", "غموض", "هكر", "اوامر", "تيد", "ترحيب", "مقص", "كابوي"],
  "الذكاء والصور": ["اصفعي", "حضن", "معلمي", "المطور", "مزخرف"],
  "الإدارة والأنظمة": ["ايقاف", "تشغيل", "كنية", "تسونامي", "تقرير", ".نظام تكاملي تشغيل", ".نظام تكاملي ايقاف"],
  "الألعاب": ["تفكيك", "تجميع", "تحدي", "لعبه_سريعة"],
  "المتفرقات": ["اضحك", "مزاح", "نكت", "معلومات", "نقل"]
};

// ID المطور
const OWNER_ID = "61577861540407";

// دالة لصنع صندوق مزخرف
function boxTitle(text) {
  const line = "━".repeat(text.length + 4);
  return `┏${line}┓\n┃  ${text}  ┃\n┗${line}┛`;
}

module.exports.run = async function({ api, event }) {
  const { threadID } = event;

  let msg = `╭━━━━•╭━━━━•  𝑺𝑬𝑹𝑨 𝑪ℎ𝑨𝑵 •━━━━╮\n`;
  msg += `✨ أهلاً بك في قائمة الفئات ✨\n`;
  msg += `اختر رقم الفئة ليتم عرض أوامرها:\n\n`;

  const keys = Object.keys(categories);
  keys.forEach((cat, i) => {
    msg += `${i + 1} ⟢ ${boxTitle(cat)}\n`;
  });

  msg += `╰━━━━━━━━━━━━━━━━╯\n`;
  msg += `💻 بواسطة: Sera Chan | 2026`;

  return api.sendMessage(msg, threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, body, messageReply, senderID } = event;
  if (!body || !messageReply) return;

  // تحقق أن الرد على مسج .اوامر
  if (!messageReply.body.includes("أهلاً بك في قائمة الفئات")) return;

  const keys = Object.keys(categories);

  // إذا كان الرد رقم فئة
  const choice = parseInt(body.trim());
  if (!isNaN(choice) && choice >= 1 && choice <= keys.length) {
    const categoryName = keys[choice - 1];
    const commandsList = categories[categoryName];

    let msg = `✨ فئة ${categoryName} ✨ (عدد الأوامر: ${commandsList.length})\n\n`;
    msg += commandsList.join(" – ") + "\n\n";
    msg += `📌 للرجوع للقائمة الرئيسية: أرسل 0 أو .اوامر`;

    return api.sendMessage(msg, threadID);
  }

  // إذا كان الرد باسم أمر
  const allCommands = Object.values(categories).flat();
  const command = body.trim();

  if (allCommands.includes(command)) {
    // تحقق من أوامر المطور
    if ((command === ".نظام تكاملي تشغيل" || command === ".نظام تكاملي ايقاف") && senderID !== OWNER_ID) {
      return api.sendMessage("⚠️ هذا الأمر خاص بالمطور فقط!", threadID);
    }

    // تنفيذ الأوامر التكميلية
    if (command === ".نظام تكاملي تشغيل") {
      const SMART = require("./sera/smartSystem");
      SMART.toggleSystem(true);
      return api.sendMessage("✅ تم تشغيل النظام التكاملي", threadID);
    }

    if (command === ".نظام تكاملي ايقاف") {
      const SMART = require("./sera/smartSystem");
      SMART.toggleSystem(false);
      return api.sendMessage("⛔ تم إيقاف النظام التكاملي", threadID);
    }

    // أي أوامر أخرى يمكنك وضع تنفيذها هنا
    return api.sendMessage(`✅ تم تفعيل الأمر: ${command}`, threadID);
  }
};
