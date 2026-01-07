const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "cache", "seraBlacklistUsers.json");

// كلمات 18+ فقط
const BLACK = [
  "كسم","قحب","شرمو","عهر","زنا","نيك","زب","طيز","مص","لحس",
  "ksm","ks","qhb","shrm","lbw","z b","t y z",
  "k1sm","k$sm","k*s*m","6yz","9hb"
];

// إنشاء الملف لو غير موجود
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");

// تحميل البيانات
function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

// حفظ البيانات
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// دالة للتحقق من المسبات في النص
function countSwears(text) {
  if (!text) return 0;
  const clean = text.toLowerCase();
  return BLACK.reduce((acc, w) => acc + (clean.includes(w) ? 1 : 0), 0);
}

module.exports.handleEvent = async ({ api, event }) => {
  const { senderID, threadID, body } = event;
  if (!senderID || !threadID) return;

  const db = loadDB();
  if (!db[threadID]) db[threadID] = {};
  if (!db[threadID][senderID]) db[threadID][senderID] = { warnings: 0, banned: false };

  const user = db[threadID][senderID];

  const sw = countSwears(body);
  if (sw > 0) {
    user.warnings += sw;

    let message = "";

    if (user.warnings < 3) {
      message = `⚠️ تحذير #${user.warnings}: الرجاء عدم استخدام كلمات بذيئة!`;
    } else if (user.warnings === 3) {
      message = `⛔ تم حظرك مؤقتًا بسبب الاستخدام المتكرر للكلمات البذيئة!`;
      user.banned = true;
      // يمكن إضافة كود الحظر المؤقت هنا إذا أردت
    } else if (user.warnings >= 5) {
      message = `🚫 تم طردك من المجموعة بعد 5 إنذارات! نحن ما مجبورين نربيك بمكان أهلك!`;
      try {
        await api.removeUserFromGroup(senderID, threadID);
      } catch (e) {}
    }

    saveDB(db);

    if (message) api.sendMessage(message, threadID);
  }
};
