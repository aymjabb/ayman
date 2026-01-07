const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "cache", "seraActivity.json");

// إنشاء الملف لو غير موجود
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(path.join(__dirname, "cache"), { recursive: true });
  fs.writeFileSync(dbPath, "{}");
}

module.exports.config = {
  name: "ادارة",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "SERA SYSTEM",
  description: "عرض ترتيب النشاط داخل الكروب مع تفاصيل كاملة",
  commandCategory: "الادارة",
  usages: ".ادارة",
  cooldowns: 5
};

// زخرفة صندوق
function decorateBox(text) {
  const top = "╭" + "━".repeat(40) + "╮\n";
  const bottom = "╰" + "━".repeat(40) + "╯\n";
  const middle = text.split("\n").map(line => "┃ " + line.padEnd(38) + " ┃").join("\n");
  return top + middle + "\n" + bottom;
}

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;

  if (!fs.existsSync(dbPath)) return api.sendMessage("❌ لا يوجد بيانات بعد.", threadID);
  const db = JSON.parse(fs.readFileSync(dbPath));
  if (!db[threadID]) return api.sendMessage("❌ لا يوجد نشاط مسجل لهذا الكروب.", threadID);

  const users = Object.entries(db[threadID])
    .map(([id, data]) => ({
      id,
      messages: data.messages || 0,
      images: data.images || 0,
      swears: data.swears || 0,
      warnings: data.warnings || 0,
      points: data.points || 0
    }))
    .sort((a, b) => b.points - a.points);

  let text = users.map((u, i) => {
    return `${i + 1}. ID: ${u.id}\n💬 رسائل: ${u.messages} | 🖼️ صور: ${u.images}\n🚫 مسبات: ${u.swears} | ⚠️ تحذيرات: ${u.warnings} | ⭐ نقاط: ${u.points}`;
  }).join("\n\n");

  if (!text) text = "لا يوجد نشاط مسجل بعد.";

  const msg = decorateBox(text);

  return api.sendMessage(msg, threadID);
};
