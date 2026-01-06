module.exports.config = {
  name: "تفكيك",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "عبدالرحمن",
  description: "لعبة تفكيك الكلمات بطابع سيرا 🐱💥 مع مؤقت وزخارف",
  usages: ["لعبة"],
  commandCategory: "العاب",
  cooldowns: 0
};

// قائمة كلمات أوسع وزخارف إيموجية
const questions = [
  { question: "بيت", answer: "ب ي ت" },
  { question: "رجل", answer: "ر ج ل" },
  { question: "امرأة", answer: "ا م ر أ ة" },
  { question: "ولد", answer: "و ل د" },
  { question: "فتاة", answer: "ف ت ا ة" },
  { question: "ماء", answer: "م ا ء" },
  { question: "نار", answer: "ن ا ر" },
  { question: "شمس", answer: "ش م س" },
  { question: "قمر", answer: "ق م ر" },
  { question: "ليل", answer: "ل ي ل" },
  { question: "نهار", answer: "ن ه ا ر" },
  { question: "جبل", answer: "ج ب ل" },
  { question: "سهل", answer: "س ه ل" },
  { question: "شجرة", answer: "ش ج ر ة" },
  { question: "زهرة", answer: "ز ه ر ة" },
  { question: "طير", answer: "ط ي ر" },
  { question: "أسد", answer: "أ س د" },
  { question: "ذئب", answer: "ذ ئ ب" },
  { question: "جمل", answer: "ج م ل" },
  { question: "بقر", answer: "ب ق ر" },
  { question: "غنم", answer: "غ ن م" },
  { question: "كتاب", answer: "ك ت ا ب" },
  { question: "قلم", answer: "ق ل م" },
  { question: "ورقة", answer: "و ر ق ة" },
  { question: "منزل", answer: "م ن ز ل" },
  { question: "مدرسة", answer: "م د ر س ة" },
  { question: "مستشفى", answer: "م س ت ش ف ى" },
  { question: "متجر", answer: "م ت ج ر" },
  { question: "مطعم", answer: "م ط ع م" },
  { question: "سيارة", answer: "س ي أ ر ة" },
  { question: "دراجة", answer: "د ر ا ج ة" },
  { question: "طائرة", answer: "ط ا ئ ر ة" },
  { question: "قطار", answer: "ق ط ا ر" },
  { question: "سفينة", answer: "س ف ي ن ة" },
  { question: "كمبيوتر", answer: "ك م ب ي و ت ر" },
  { question: "هاتف", answer: "ه ا ت ف" },
  { question: "موسيقى", answer: "م و س ي ق ى" },
  { question: "فيلم", answer: "ف ي ل م" },
  { question: "مسرح", answer: "م س ر ح" },
  { question: "كرة", answer: "ك ر ة" },
  { question: "مطبخ", answer: "م ط ب خ" },
  { question: "حديقة", answer: "ح د ي ق ة" },
  { question: "نافذة", answer: "ن ا ف ذ ة" },
  { question: "باب", answer: "ب ا ب" },
];

module.exports.handleReply = async function ({ api, event, handleReply, Currencies, Users }) {
  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const userName = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);

  // تحقق من الوقت
  const now = Date.now();
  if (now > handleReply.endTime) {
    api.sendMessage(`⏰ الوقت انتهى يا ${userName}! حاول المرة القادمة أسرع 😹`, event.threadID);
    return api.unsendMessage(handleReply.messageID);
  }

  if (userAnswer === correctAnswer) {
      Currencies.increaseMoney(event.senderID, 50);
      api.sendMessage(`🎉✨ واااو! ${userName} انت الأسرع 😻💥\n💰 حصلت على 50 دولار 🤑\n🥳 سيرا تقول: "يا سلام! هكذا يُفكك بمهارة!"`, event.threadID);
      api.unsendMessage(handleReply.messageID); 
  } else {
      api.sendMessage(`😹 خطأ يا ${userName}! حاول مرة أخرى بسرعة قبل أن يسبقك أحد! ⏳`, event.threadID);
  }
};

module.exports.run = async function ({ api, event }) {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const correctAnswer = randomQuestion.answer;
  const question = randomQuestion.question;

  const endTime = Date.now() + 15000; // 15 ثانية لكل لاعب

  const message = `🔥🎯 سيرا تقول: "من الأسرع في تفكيك الكلمة؟ 😸"\n💡 الكلمة: ${question}\n⏱️ لديك 15 ثانية فقط!\n💰 أسرع شخص يفوز 50 دولار\n✨🎉🕹️😻`;

  api.sendMessage({ body: message }, event.threadID, (error, info) => {
      if (!error) {
          global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              correctAnswer: correctAnswer,
              endTime: endTime
          });
      }
  });
};
