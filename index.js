const fs = require("fs-extra");
const path = require("path");
const SMART = require("./sera/smartSystem");

const OWNER_ID = "61577861540407";

const categories = {
  "ترفيه": ["تخييلي", "مغادرةالكل", "سلاحي", "اطرديني", "ترامب", "مستوى", "اكشن", "هدية", "شخصية", "كت",
             "كنية", "لوخيروك", "اقتباسات", "اذكار", "باند", "كهف", "احسب", "adc", "سرقة", "موتي",
             "دراما", "فيس", "جزاء", "رفع", "غموض", "هكر", "اوامر", "تيد", "ترحيب", "مقص", "كابوي"],
  "الذكاء والصور": ["اصفعي", "حضن", "معلمي", "المطور", "مزخرف"],
  "الإدارة والأنظمة": ["ايقاف", "تشغيل", "كنية", "تسونامي", "تقرير"],
  "الألعاب": ["تفكيك", "تجميع", "تحدي", "لعبه_سريعة"],
  "المتفرقات": ["اضحك", "مزاح", "نكت", "معلومات", "نقل"]
};

// صندوق مزخرف للنص
function boxTitle(text) {
  const line = "━".repeat(text.length + 4);
  return `┏${line}┓\n┃  ${text}  ┃\n┗${line}┛`;
}

// ==========================================
// main handleEvent
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, body, senderID } = event;
  if (!body) return;

  const msg = body.trim();

  // أوامر المطور
  if (msg === ".اون") {
    if (senderID !== OWNER_ID) return api.sendMessage("⚠️ هذا الأمر خاص بالمطور فقط!", threadID);
    SMART.toggleSystem(true);
    return api.sendMessage("✅ تم تشغيل النظام التكاملي", threadID);
  }

  if (msg === ".اوف") {
    if (senderID !== OWNER_ID) return api.sendMessage("⚠️ هذا الأمر خاص بالمطور فقط!", threadID);
    SMART.toggleSystem(false);
    return api.sendMessage("⛔ تم إيقاف النظام التكاملي", threadID);
  }

  if (!SMART.isEnabled()) return;

  // تفعيل أوامر البادئة -
  if (msg.startsWith("-")) {
    SMART.initUser(senderID, event.senderName || "User");
    SMART.logInteraction(senderID, msg);

    // زيادة العملات والنقاط كمكافأة
    const users = SMART.getUsers();
    users[senderID].money += 50;
    users[senderID].points += 10;
    SMART.saveUsers(users);

    return api.sendMessage(`💰 تم تفعيل الأمر: ${msg}\n🎯 نقاط +10، 💵 عملات +50`, threadID);
  }

  // أوامر قائمة الفئات
  if (msg === ".اوامر") {
    let text = `╭━━━━•╭━━━━•  𝑺𝑬𝑹𝑨 𝑪ℎ𝑨𝑵 •━━━━╮\n`;
    text += `✨ أهلاً بك في قائمة الفئات ✨\n`;
    text += `اختر رقم الفئة أو اكتب اسمها ليتم عرض أوامرها:\n\n`;

    Object.keys(categories).forEach((cat, i) => {
      text += `${i + 1} ⟢ ${boxTitle(cat)}\n`;
    });

    text += `╰━━━━━━━━━━━━━━━━╯\n💻 بواسطة: Sera Chan | 2026`;

    return api.sendMessage(text, threadID);
  }

  // الرد على رقم أو اسم فئة مباشرة
  const keys = Object.keys(categories);
  const choiceNum = parseInt(msg);
  let selectedCategory = null;

  if (!isNaN(choiceNum) && choiceNum >= 1 && choiceNum <= keys.length) {
    selectedCategory = keys[choiceNum - 1];
  } else if (keys.includes(msg)) {
    selectedCategory = msg;
  }

  if (selectedCategory) {
    const list = categories[selectedCategory];
    let text = `✨ فئة ${selectedCategory} ✨ (عدد الأوامر: ${list.length})\n\n`;
    text += list.join(" – ") + "\n\n";
    text += `💡 يمكنك تفعيل أي أمر بالبادئة "-"`;

    return api.sendMessage(text, threadID);
  }
};
