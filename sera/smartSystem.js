const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = __dirname;
const USERS_PATH = path.join(DATA_DIR, "users.json");
const RANK_PATH = path.join(DATA_DIR, "rankings.json");

if (!fs.existsSync(USERS_PATH)) fs.writeJsonSync(USERS_PATH, {});
if (!fs.existsSync(RANK_PATH)) fs.writeJsonSync(RANK_PATH, {});

let SYSTEM_ENABLED = true;

// ===== نظام الذكاء =====
function toggleSystem(state) { SYSTEM_ENABLED = state; }
function isEnabled() { return SYSTEM_ENABLED; }

function getUsers() { return fs.readJsonSync(USERS_PATH); }
function saveUsers(data) { fs.writeJsonSync(USERS_PATH, data, { spaces: 2 }); }

function initUser(id, name) {
  const users = getUsers();
  if (!users[id]) {
    users[id] = {
      id,
      nameFB: name,
      realName: null,
      country: null,
      interests: [],
      points: 0,
      money: 0,
      title: "عضو جديد",
      messages: 0,
      commands: {},
      lastAsked: 0,
      bank: 0,
      lastReward: 0
    };
    saveUsers(users);
  }
}

function logInteraction(id, msg, cmd = null) {
  if (!SYSTEM_ENABLED) return;
  const users = getUsers();
  const u = users[id]; if (!u) return;

  u.messages++;
  u.points += 1;
  u.money += 2;

  if (cmd) u.commands[cmd] = (u.commands[cmd] || 0) + 1;

  // تتبع الاهتمامات تلقائياً
  if (msg.includes("لعبة")) addInterest(id, "ألعاب");
  if (msg.includes("كرة")) addInterest(id, "رياضة");
  if (msg.includes("برمجة")) addInterest(id, "برمجة");
  if (msg.includes("اغنية")) addInterest(id, "موسيقى");

  // تحديث لقب تلقائي حسب النقاط
  if (u.points > 100) u.title = "عضو نشيط";
  if (u.points > 500) u.title = "عضو متميز";
  if (u.points > 1000) u.title = "نجم الكروب";

  saveUsers(users);
}

function addInterest(id, interest) {
  const users = getUsers();
  if (!users[id].interests.includes(interest)) users[id].interests.push(interest);
}

function getSmartQuestion(user) {
  if (!SYSTEM_ENABLED) return null;
  const now = Date.now();
  if (now - user.lastAsked < 6 * 60 * 60 * 1000) return null;

  if (!user.realName) return "👋 شنو اسمك الحقيقي؟";
  if (!user.country) return "🌍 من وين انت؟";
  if (user.interests.length < 2) return "🎯 شنو أكثر شي تحبه؟";

  return null;
}

function applyAnswer(id, text) {
  const users = getUsers();
  const u = users[id];
  if (!u.realName) u.realName = text;
  else if (!u.country) u.country = text;
  else addInterest(id, text);
  u.lastAsked = Date.now();
  saveUsers(users);
}

// ===== المكافآت اليومية =====
function giveDailyReward() {
  const users = getUsers();
  const now = Date.now();
  Object.values(users).forEach(u => {
    if (now - (u.lastReward || 0) > 24 * 60 * 60 * 1000) {
      const reward = Math.floor(Math.random() * 50 + 10);
      u.money += reward;
      u.bank += reward;
      u.lastReward = now;
    }
  });
  saveUsers(users);
}

// ===== تقرير أعلى الأعضاء =====
function getTopUsers() {
  const users = getUsers();
  const sorted = Object.values(users).sort((a,b)=>b.points - a.points);
  return sorted.slice(0,5); // أعلى 5 أعضاء
}

// ===== ردود ذكية شخصية =====
function getPersonalReply(id, msg) {
  const users = getUsers();
  const u = users[id];
  if (!u) return "مرحباً!";
  const lower = msg.toLowerCase();

  if (lower.includes("هاي") || lower.includes("مرحبا")) return `أهلاً ${u.nameFB} 🌟`;
  if (lower.includes("شلونك")) return `تمام الحمد لله، وانت شلونك يا ${u.nameFB}?`;
  if (lower.includes("راحت") || lower.includes("حزين")) return "لا تحزن 😿 كلشي يصير!";
  if (lower.includes("ضحك") || lower.includes("مضحك")) return "😂 ضحكتك مهمة!";
  return `😎 ${u.nameFB}, ما أفهم قصدك، ممكن توضّح؟`;
}

module.exports = {
  initUser,
  logInteraction,
  getSmartQuestion,
  applyAnswer,
  toggleSystem,
  isEnabled,
  getTopUsers,
  giveDailyReward,
  getPersonalReply
};
