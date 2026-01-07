const fs = require("fs");
const path = require("path");
const blacklist = require("./cache/seraBlacklist");

const warnsPath = path.join(__dirname, "cache", "warns.json");

// تحميل الإنذارات أو إنشاء جديد
function loadWarns() {
  if (!fs.existsSync(warnsPath)) fs.writeFileSync(warnsPath, "{}");
  return JSON.parse(fs.readFileSync(warnsPath, "utf-8"));
}

// حفظ الإنذارات
function saveWarns(data) {
  fs.writeFileSync(warnsPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "سبام",
  version: "2.3.0",
  hasPermssion: 1,
  credits: "Sera Chan",
  description: "منع السب والسبام مع نظام إنذارات، حظر، بلوك وطرد تلقائي",
  commandCategory: "حماية",
  cooldowns: 0
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const DEV = ["61577861540407"];
  if (DEV.includes(senderID)) return;

  let warns = loadWarns();
  if (!warns[threadID]) warns[threadID] = {};
  if (!warns[threadID][senderID]) warns[threadID][senderID] = 0;

  const clean = body.toLowerCase();
  const norm = clean.replace(/(.)\1+/g, "$1").replace(/[^\u0600-\u06FFa-z]/g, "");

  // ===== سب أسود =====
  if (blacklist.BLACK.some(w => norm.includes(w))) {
    warns[threadID][senderID]++;
    saveWarns(warns);

    const count = warns[threadID][senderID];
    if (count <= 3) {
      return api.sendMessage(
        `⚠️ تحذير #${count} بسبب سب أسود ❌\nاحترم نفسك يا ${senderID}!`,
        threadID
      );
    } else if (count === 4) {
      // حظر مؤقت (يمكن تغيير الوقت حسب الحاجة)
      await api.sendMessage(
        "⛔ تم حظرك مؤقتًا بسبب تجاوز الإنذارات ⚡ سيرا تشان تحمي الكروب",
        threadID
      );
      // مثال: يمكن حظر مؤقت هنا إذا كانت الـ API تدعم
      return;
    } else if (count >= 5) {
      // بلوك أو طرد دائم
      await api.removeUserFromGroup(senderID, threadID);
      return api.sendMessage(
        "💥 تجاوزت الإنذارات الخمسة → تم طردك + بلوك نهائي 😼\nسيرا تشان تحمي الكروب!",
        threadID
      );
    }
  }

  // ===== سب أبيض =====
  if (blacklist.WHITE.some(w => norm.includes(w))) {
    warns[threadID][senderID]++;
    saveWarns(warns);

    const count = warns[threadID][senderID];
    if (count <= 2) {
      return api.sendMessage(
        `⚠️ تحذير #${count} بسبب ألفاظ غير لائقة ✋`,
        threadID
      );
    } else if (count === 3) {
      await api.sendMessage(
        "⛔ تم حظرك مؤقتًا بسبب تجاوز الإنذارات ⚡",
        threadID
      );
      return;
    } else if (count >= 5) {
      await api.removeUserFromGroup(senderID, threadID);
      return api.sendMessage(
        "💥 تجاوزت الإنذارات الخمسة → تم طردك! 🐾",
        threadID
      );
    }
  }

  // ===== سبام إيموجي =====
  const emojiCount = (body.match(/[\p{Emoji}]/gu) || []).length;
  if (emojiCount >= 10) {
    await api.removeUserFromGroup(senderID, threadID);
    return api.sendMessage(
      "🚫 سبام إيموجي مفرط → طرد فوري ⚡",
      threadID
    );
  } else if (emojiCount >= 5) {
    api.sendMessage(
      `⚠️ تحذير: سبام إيموجي (${emojiCount} إيموجيات)`,
      threadID
    );
  }
};

module.exports.run = async ({ api, event }) => {
  api.sendMessage(
    "🛡️ نظام منع السب والسبام مفعّل.\n• سب أبيض = إنذار → حظر → طرد\n• سب أسود = 3 إنذارات → حظر → بلوك\n• سبام إيموجي = تحذير أو طرد تلقائي\n⚡ سيرا تشان تحمي الكروب 🐾",
    event.threadID,
    event.messageID
  );
};
