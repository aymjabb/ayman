const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "تخيل",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "Ayman & Sera",
  description: "توليد صور احترافية من الخيال بذكاء سيرا",
  commandCategory: "صور",
  usages: ".تخيل [وصفك المبدع]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) return api.sendMessage("✨ هاه! قل لي ماذا يدور في خيالك لأرسمه لك؟\nمثال: .تخيل رائد فضاء يركب قطة في الفضاء", threadID, messageID);

  const cachePath = path.join(__dirname, "cache", `dream_${Date.now()}.png`);

  try {
    // إشعار البدء بأسلوب سيرا
    api.sendMessage("🎨 لحظة.. سيرا تغمض عينيها وتتخيل الآن.. ✨", threadID, messageID);

    // 1. ترجمة النص للإنجليزية لضمان أفضل دقة في الرسم
    const translate = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(prompt)}`);
    const enPrompt = translate.data[0][0][0];

    // 2. جلب الصورة من محرك التوليد المتطور (Flux/SDXL)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enPrompt)}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.outputFileSync(cachePath, Buffer.from(response.data));

    // 3. إرسال النتيجة الفخمة
    const msg = {
      body: `✨ هـذا مـا تـخـيـلـتـه لـك:\n──────────────────\n📝 الوصف: ${prompt}\n──────────────────\n🐾 بـقـوة ذكـاء أيـمـن الـبـكـري`,
      attachment: fs.createReadStream(cachePath)
    };

    return api.sendMessage(msg, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("💔 عذراً، خيالي واسع جداً لدرجة أن السيرفر لم يتحمل! جرب مرة أخرى.", threadID, messageID);
  }
};
