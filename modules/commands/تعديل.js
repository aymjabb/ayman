‏const axios = require("axios");
‏const fs = require("fs-extra");
‏const path = require("path");
‏const FormData = require("form-data");
‏
‏module.exports.config = {
‏  name: "تعديل",
‏  version: "2.0.0",
‏  hasPermssion: 0,
‏  credits: "SOMI",
‏  description: "تعديل صورة (أنمي / كرتون / تحسين)",
‏  commandCategory: "🖼️ صور",
‏  usages: "تعديل <أنمي | كرتون | تحسين>",
‏  cooldowns: 10
‏};
‏
‏module.exports.run = async function ({ api, event, args }) {
‏  try {
‏    if (!event.messageReply || !event.messageReply.attachments[0]) 
‏      return api.sendMessage(
‏        "❌ رد على صورة واكتب:\nتعديل أنمي\nتعديل كرتون\nتعديل تحسين", 
‏        event.threadID, 
‏        event.messageID
‏      );
‏
‏    const type = args[0];
‏    if (!type) return api.sendMessage("❌ اختر نوع التعديل", event.threadID);
‏
‏    const imgUrl = event.messageReply.attachments[0].url;
‏    const imgPath = path.join(__dirname, `/cache/${Date.now()}.jpg`);
‏    const outPath = path.join(__dirname, `/cache/out_${Date.now()}.jpg`);
‏
‏    const img = await axios.get(imgUrl, { responseType: "arraybuffer" });
‏    fs.writeFileSync(imgPath, Buffer.from(img.data));
‏
‏    let apiUrl = "";
‏    if (type.includes("أنمي")) {
‏      apiUrl = "AIzaSyALQBlieI5xur3yh0tT69MY36e353tBjuA"; // <--- ضع رابط API لتحويل الصور إلى أنمي هنا
‏    } else if (type.includes("كرتون")) {
‏      apiUrl = "https:                                         
‏    } else if (type.includes("//api.zahwazein.xyz/photoeditor/cartoon";
‏    } else if (type.includes("تحسين")) {
‏      apiUrl = "https://api.zahwazein.xyz/photoeditor/enhance";
‏    } else {
‏      fs.unlinkSync(imgPath);
‏      return api.sendMessage("❌ النوع غير مدعوم", event.threadID);
‏    }
‏
‏    const form = new FormData();
‏    form.append("image", fs.createReadStream(imgPath));
‏
‏    const res = await axios.post(apiUrl, form, {
‏      headers: form.getHeaders(),
‏      responseType: "arraybuffer"
‏    });
‏
‏    fs.writeFileSync(outPath, Buffer.from(res.data));
‏
‏    api.sendMessage(
‏      { 
‏        body: "✨ تم تعديل الصورة بنجاح", 
‏        attachment: fs.createReadStream(outPath) 
‏      },
‏      event.threadID,
‏      () => {
‏        fs.unlinkSync(imgPath);
‏        fs.unlinkSync(outPath);
‏      }
‏    );
‏  } catch (err) {
‏    console.error(err);
‏    api.sendMessage(
‏      "⚠️ حصل خطأ أثناء تعديل الصورة\nجرّب صورة أخرى", 
‏      event.threadID
‏    );
‏  }
‏};
