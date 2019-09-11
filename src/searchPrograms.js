'use strict'

/**
 * searchWords に合致するテレビ番組の情報を複数ページから取得
 * @param {string} searchWords
 * @param {number} type
 */
module.exports = async (searchWords, type) => {
  const getPrograms = require('./getPrograms.js');
  const sleep = require('./sleep.js');

  let allProgramList = [];
  const max = 20;
  while (allProgramList.length < max) {
    let programs = await getPrograms(searchWords, type, allProgramList.length + 1);
    allProgramList = [...allProgramList, ...programs];
    if (programs.length < 10) break;
    await sleep(2000);
  }
  return allProgramList;
}
