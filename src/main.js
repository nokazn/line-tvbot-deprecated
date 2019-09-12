'use strict'

/**
 * @param {?Object} event
 * @param {?Object} context
 * @param {?Function} callback
 * @return {} callback
 */
exports.handler = async (event, context, callback) => {
  const { searchWordsList } = require('./store.js');
  const sleep = require('./sleep.js');

  for (let searchWords of searchWordsList) {
    await notifyPrograms(...searchWords);
    await sleep(1000);
  }
  return programList;
};

/**
 * 検索した番組を通知
 * @param {string} searchWords
 * @param {number} type
 * @return {?Response} response
 */
async function notifyPrograms (searchWords, type) {
  const pushMessage = require('./push.js');
  const searchPrograms  = require('./searchPrograms.js');

  const allProgramList = await searchPrograms(searchWords, type);
  if (!allProgramList.length) return null;
  const response = await pushMessage({ searchWords, allProgramList });
  console.info(response);
  console.table(allProgramList);
  return response;
}
