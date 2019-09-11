'use strict'

/**
 * searchWords に合致するテレビ番組の情報を複数ページから取得
 * @param {string} searchWords
 * @param {number} type
 */
module.exports = async (searchWords, type) => {
  const getPrograms = require('./getPrograms.js');
  const sleep = require('./sleep.js');
  const { max } = require('./store.js');

  searchWords = searchWords.split(/\s/g).map(word => encodeURIComponent(word)).join('+');
  type = String(type).split('').join('+');
  let allProgramList = [];
  while (allProgramList.length < max) {
    let start = String(allProgramList.length + 1);
    let programs = await getPrograms(searchWords, type, start);
    allProgramList = [...allProgramList, ...programs];
    if (programs.length < 10) break;
    await sleep(2000);
  }
  return allProgramList;
}
