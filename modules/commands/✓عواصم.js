module.exports.config = {
  name: "عواصم",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "عبدالرحمن • مزخرف بواسطة Sera Chan 🐱",
  description: "لعبة عواصم الدول مع طابع Sera Chan المرح 😸",
  usages: ["لعبة"],
  commandCategory: "العاب",
  cooldowns: 0
};

// زخرفة ASCII لطابع Sera Chan
function decorateSeraChan() {
  const text = "Sera Chan 🐱 Capitals";
  const symbols = ["═","╔","╗","╚","╝","─","•","✨","🐾"];
  return text.split("").map(c => c === " " ? "   " : symbols[Math.floor(Math.random()*symbols.length)] + c).join("");
}

// رسائل عفوية من Sera Chan
function randomSeraMessage(correct=true) {
  const correctMsgs = [
    "😺 واو! أنت عبقري! تابع جمع العواصم 🐱",
    "🐾 ممتاز! لقد حصلت على المكافأة 😸",
    "✨ ممتاز جدًا! استمر بالمرح!"
  ];
  const wrongMsgs = [
    "😿 أوه لا! حاول مرة أخرى 🐾",
    "🙀 خطأ! لا تحزن، المحاولة القادمة أفضل 😸",
    "😹 حاول مرة ثانية، Sera Chan تؤمن بك!"
  ];
  return correct ? correctMsgs[Math.floor(Math.random() * correctMsgs.length)]
                 : wrongMsgs[Math.floor(Math.random() * wrongMsgs.length)];
}

const questions = [
  { "question": "ما هي عاصمة الجزائر؟", "answer": "الجزائر" },
  { "question": "ما هي عاصمة البحرين؟", "answer": "المنامة" },
  { "question": "ما هي عاصمة مصر؟", "answer": "القاهرة" },
  { "question": "ما هي عاصمة العراق؟", "answer": "بغداد" },
  { "question": "ما هي عاصمة الأردن؟", "answer": "عمان" },
  { "question": "ما هي عاصمة الكويت؟", "answer": "الكويت" },
  { "question": "ما هي عاصمة لبنان؟", "answer": "بيروت" },
  { "question": "ما هي عاصمة ليبيا؟", "answer": "طرابلس" },
  { "question": "ما هي عاصمة موريتانيا؟", "answer": "نواكشوط" },
  { "question": "ما هي عاصمة المغرب؟", "answer": "الرباط" },
  { "question": "ما هي عاصمة قطر؟", "answer": "الدوحة" },
  { "question": "ما هي عاصمة السعودية؟", "answer": "الرياض" },
  { "question": "ما هي عاصمة الصومال؟", "answer": "مقديشو" },
  { "question": "ما هي عاصمة سوريا؟", "answer": "دمشق" },
  { "question": "ما هي عاصمة تونس؟", "answer": "تونس" },
  { "question": "ما هي عاصمة الإمارات العربية المتحدة؟", "answer": "ابوظبي" },
  { "question": "ما هي عاصمة اليمن؟", "answer": "صنعاء" }
  // يمكنك إضافة باقي العواصم هنا بنفس الصيغة
];

module.exports.handleReply = async function ({ api, event, handleReply, Currencies }) {
  const userAnswer = event.body.trim().toLowerCase();
  const correctAnswer = handleReply.correctAnswer.toLowerCase();
  const userName = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);

  if (userAnswer === correctAnswer) {
      // مكافأة المال
      Currencies.increaseMoney(event.senderID, 20);
      api.sendMessage(`✅ تهانينا ${userName}! ${randomSeraMessage(true)} 💰 +20$`, event.threadID);
      api.unsendMessage(handleReply.messageID);
  } else {
      api.sendMessage(`❌ ${randomSeraMessage(false)}`, event.threadID);
  }
};

module.exports.run = async function ({ api, event }) {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  const correctAnswer = randomQuestion.answer;
  const question = randomQuestion.question;
  const SeraText = decorateSeraChan();

  const message = `🐾 ${SeraText} 🐾\n\n❓ ${question}\n\n📢 أجب بالسرعة الممكنة!`;

  api.sendMessage({ body: message }, event.threadID, (error, info) => {
      if (!error) {
          global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              correctAnswer: correctAnswer
          });
      }
  });
};
