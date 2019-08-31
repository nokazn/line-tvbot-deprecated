'use strict'

const { getPrograms } = require('./getPrograms.js');

async function searchPrograms (searchWords, type, callback) {
  let programList = [];
  while (programList.length < 50) {
    let programs = await getPrograms(searchWords, type, programList.length + 1);
    programList = [...programList, ...programs];
    if (programs.length < 10) break;
    await sleep(2000);
  }
  if (typeof callback === 'function') {
    programList = callback(programList);
  }
  return programList;
}

function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

module.export = searchPrograms;
