const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../cache/seraActivity.json");
const blacklist = ["كسمك","ابن القحبة","طيزك","كسك"];

function loadDB() { if(!fs.existsSync(dbPath)) fs.writeFileSync(dbPath,"{}"); return JSON.parse(fs.readFileSync(dbPath)); }
function saveDB(data) { fs.writeFileSync(dbPath, JSON.stringify(data,null,2)); }
function countSwears(text){ if(!text) return 0; return blacklist.reduce((acc,w)=>acc+(text.toLowerCase().includes(w)?1:0),0); }

module.exports.config = { eventType: ["message"] }; // أي رسالة
module.exports.run = async ({ event }) => {
  const { senderID, threadID, body, attachments } = event;
  if(!senderID || !threadID) return;

  const db = loadDB();
  if(!db[threadID]) db[threadID] = {};
  if(!db[threadID][senderID]) db[threadID][senderID] = { messages:0, images:0, swears:0, warnings:0, points:0 };

  const user = db[threadID][senderID];
  user.messages++;
  user.points += 1;

  if(attachments && attachments.length>0) { user.images += attachments.length; user.points += 2; }

  const sw = countSwears(body);
  if(sw>0){ user.swears += sw; user.warnings += sw; user.points -= sw*2; }

  saveDB(db);
};
