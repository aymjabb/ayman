const axios = require("axios");

module.exports.config = {
  name: "auto_gpt_sira",
  version: "2.0.0",
  hasPermission: 0,
  credits: "انس",
  description: "سيرا تشان تتحدث عفويًا ومزخرف + GPT-4",
  commandCategory: "ذكاء اصطناعي",
  usages: ".سيرا [سؤال]",
  cooldowns: 1,
};

module.exports.handleEvent = async function ({ api, event, args, Users }) {
  const { threadID, messageID, body, senderID } = event;
  const myID = "61577861540407"; // أيديك الخاصة
  const name = senderID === myID ? "بابا أيمن" : await Users.getNameUser(senderID);

  if (!body || !body.startsWith(".سيرا")) return; // يعمل فقط عند كتابة .سيرا

  // استخراج السؤال بعد الأمر
  let userQuery = body.replace(".سيرا", "").trim();
  if (!userQuery) return api.sendMessage(`💫 مرحبًا ${name}~ قل لي شيء لأرد عليك! 😸✨`, threadID, messageID);

  // زخرفة الرسالة قبل الإرسال
  const decorate = (text) => {
    return text
      .split("")
      .map((c) => (c === " " ? " " : c + ["✨","💖","🌸","🌟","💫","😻"][Math.floor(Math.random()*6)]))
      .join("");
  };

  // إرسال السؤال لـ GPT-4 عبر واجهة OpenAI API (مثال)
  try {
    const OPENAI_API_KEY = "ضع_مفتاحك_هنا"; // ضع مفتاح GPT-4 هنا
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "أنت سيرا تشان، شخصية مرحة، عفوية، مزخرفة وتتكلم مع المستخدم بإيموجيات كثيرة."
          },
          {
            role: "user",
            content: userQuery
          }
        ],
        max_tokens: 300,
        temperature: 1.0
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let gptReply = response.data.choices[0].message.content;

    // زخرفة الرد من GPT قليلاً
    gptReply = decorate(gptReply);

    return api.sendMessage(`🌸😻 سيرا تشان تقول:\n\n${gptReply}\n\n💖🌟💫`, threadID, messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ خطأ! سيرا تشان لا تستطيع الرد الآن… جربي لاحقًا 😿", threadID, messageID);
  }
};

module.exports.run = function () {
  return;
};
