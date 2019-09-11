'use strict'

const { getPrograms } = require('./getPrograms.js');

/**
 * searchWords に合致するテレビ番組の情報を複数ページから取得
 * @param {string} searchWords
 * @param {number} type
 */
async function searchPrograms (searchWords, type) {
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

/**
 * time ms だけ待機
 * @param {number} time
 * @return {Promise}
 */
function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

module.exports = { searchPrograms, sleep };
