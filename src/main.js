'use strict'

exports.handler = async (event, context, callback) => {
  const { searchWordsList } = require('./store.js');
  const programList = [];
  for (let searchWords of searchWordsList) {
    programList.push(await notifyPrograms(...searchWords));
  }
  return programList;
};

/**
 * 検索した番組を通知
 * @param {string} searchWords
 * @param {number} type
 */
async function notifyPrograms (searchWords, type) {
  const pushMessage = require('./push.js');
  const searchPrograms  = require('./searchPrograms.js');
  const sleep = require('./sleep.js');

  const allProgramList = await searchPrograms(searchWords, type);
  if (!allProgramList.length) return null;
  pushMessage(`「${searchWords}」を含む番組が${allProgramList.length}件見つかりました。`);
  await sleep(1000);
  for (let program of allProgramList) {
    let msg = `【日時】${program.date}${program.time}\n【番組名】${program.name}\n【放送局】${program.broadcaster}\n【詳細】${program.detail}`;
    pushMessage(msg);
    await sleep(1000);
  }
  console.table(allProgramList);
  return allProgramList;
}
