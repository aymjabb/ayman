if (event.body === `${PREFIX}إنهاء`) {
    if (event.senderID !== DEV_ID) return;
    return api.sendMessage("الجلسة انتهت، سأذهب للراحة حتى تناديني مجدداً.. سيدـي. 👋", event.threadID);
}
