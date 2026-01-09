module.exports.config = {
  name: "كشف",
  version: "1.0.0",
  hasPermssion: 1, // للأدمن والمطور
  credits: "Ayman & Sera",
  description: "كشف الملوك (الأكثر تفاعلاً) والأصنام (الخاملين)",
  commandCategory: "إدارة",
  cooldowns: 10
};

module.exports.run = async ({ api, event, Users, Threads }) => {
  const { threadID, messageID } = event;

  try {
    api.sendMessage("📊 جاري فحص سجلات المجموعة وتحليل البيانات.. ثواني يا زعيم ✨", threadID, messageID);

    const threadInfo = await api.getThreadInfo(threadID);
    const threadData = await Threads.getData(threadID);
    const members = threadInfo.participantIDs;
    
    // الحصول على إحصائيات الرسائل من قاعدة بيانات البوت
    const storage = threadData.threadInfo.totalMsgDict || {};
    
    let stats = [];
    for (const id of members) {
      const name = await Users.getNameUser(id);
      const count = storage[id] || 0;
      stats.push({ id, name, count });
    }

    // ترتيب الأعضاء حسب عدد الرسائل
    stats.sort((a, b) => b.count - a.count);

    // 1. استخراج الملوك (أول 5)
    let topActive = "🏆 مـلـوك الـتـفـاعـل (Top 5):\n──────────────────\n";
    for (let i = 0; i < Math.min(5, stats.length); i++) {
      topActive += `${i + 1}. ${stats[i].name} -> [ ${stats[i].count} رسالة ]\n`;
    }

    // 2. استخراج الأصنام (الذين لديهم 0 رسائل في السجل)
    let ghosts = stats.filter(user => user.count === 0);
    let ghostList = "👻 قـائـمـة الأصـنـام (الخاملين):\n──────────────────\n";
    
    if (ghosts.length === 0) {
      ghostList += "لا يوجد أصنام، الكل يتفاعل! ✅";
    } else {
      // عرض أول 10 أصنام فقط لكي لا تطول الرسالة
      for (let i = 0; i < Math.min(10, ghosts.length); i++) {
        ghostList += `• ${ghosts[i].name}\n`;
      }
      if (ghosts.length > 10) ghostList += `... و ${ghosts.length - 10} آخرين.`;
    }

    const report = `
📊 تـقـريـر الـحـالـة لـلـمـجـمـوعة
──────────────────
👥 عدد الأعضاء: ${members.length}
${topActive}
──────────────────
${ghostList}
──────────────────
💡 نـصـيـحـة أيـمـن: "الـتـفـاعـل أسـاس الـبـقـاء" 🐾
    `;

    return api.sendMessage(report, threadID, messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ فشلت سيرا في جلب التقرير، تأكد من وجود بيانات تفاعل مسجلة.", threadID, messageID);
  }
};
