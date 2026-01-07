// ==================== SERA BOT NODE.JS - نظام فقط + حفظ تلقائي ====================

// مكتبات
const fs = require("fs-extra");
const path = require("path");

// ---------- مسارات الملفات ----------
const USERS_PATH = path.join(__dirname, "sera", "users.json");
const RANK_PATH = path.join(__dirname, "sera", "rankings.json");

// ---------- تحميل البيانات أو تهيئة جديدة ----------
let users = fs.existsSync(USERS_PATH) ? fs.readJsonSync(USERS_PATH) : {};
let rankings = fs.existsSync(RANK_PATH) ? fs.readJsonSync(RANK_PATH) : {};

// ---------- النظام الذكي ----------
let SYSTEM_ENABLED = true;
const OWNER_ID = "61577861540407";

function toggleSystem(state) {
  SYSTEM_ENABLED = state;
  console.log(state ? "✅ النظام الذكي مُفعل" : "⛔ النظام الذكي مُعطل");
}

function isEnabled() {
  return SYSTEM_ENABLED;
}

function saveUsers() {
  fs.writeJsonSync(USERS_PATH, users, { spaces: 2 });
}

function saveRankings() {
  fs.writeJsonSync(RANK_PATH, rankings, { spaces: 2 });
}

// ---------- إدارة المستخدم ----------
function initUser(id, name) {
  if (!users[id]) {
    users[id] = {
      id,
      nameFB: name,
      points: 0,
      money: 0,
      title: "عضو جديد",
      messages: 0,
      commands: {}
    };
    saveUsers();
  }
}

// ---------- التفاعل مع المستخدم ----------
function logInteraction(id, cmd = null) {
  if (!SYSTEM_ENABLED) return;
  const u = users[id];
  if (!u) return;

  u.messages++;
  u.points += 1;
  u.money += 2;

  if (cmd) u.commands[cmd] = (u.commands[cmd] || 0) + 1;

  // تحديث الترتيب
  rankings[id] = { points: u.points, money: u.money, name: u.nameFB };
  saveUsers();
  saveRankings();
}

// ---------- أوامر المطوّر ----------
async function onMessage(event) {
  const { senderID, body } = event;
  if (!body) return;

  initUser(senderID, "User_" + senderID);

  // -------- أوامر المطور --------
  if (senderID === OWNER_ID) {
    if (body === ".اون") return toggleSystem(true);
    if (body === ".اوف") return toggleSystem(false);

    if (body.startsWith("-زيادة ")) {
      const parts = body.split(" ");
      if (parts.length === 3) {
        const userID = parts[1].replace("@","");
        const amount = parseInt(parts[2]);
        if (!users[userID]) return console.log("❌ هذا العضو غير موجود");
        users[userID].money = (users[userID].money || 0) + amount;
        logInteraction(userID);
        console.log(`💰 تم إضافة ${amount} عملات لـ ${userID}`);
      }
    }

    if (body.startsWith("-تصفر ")) {
      const parts = body.split(" ");
      if (parts.length === 2) {
        const userID = parts[1].replace("@","");
        if (!users[userID]) return console.log("❌ هذا العضو غير موجود");
        users[userID].money = 0;
        users[userID].points = 0;
        logInteraction(userID);
        console.log(`♻️ تم تصفير نقاط و عملات ${userID}`);
      }
    }
  }

  // -------- التحقق من تفعيل النظام --------
  if (!isEnabled()) return;

  // -------- تسجيل التفاعل --------
  logInteraction(senderID, body);
}

// ---------- محاكاة استقبال رسائل للتجربة ----------
const simulatedEvents = [
  { senderID: OWNER_ID, body: ".اون" },
  { senderID: "123", body: "رسالة عادية" },
  { senderID: OWNER_ID, body: "-زيادة 123 500" },
  { senderID: OWNER_ID, body: "-تصفر 123" },
  { senderID: OWNER_ID, body: ".اوف" }
];

simulatedEvents.forEach(e => onMessage(e));

// ==================== END BOT ====================
