'use strict'

/**
 * searchWords に合致するテレビ番組の情報を取得
 * @param {string} searchWords
 * @param {string} type
 * @param {string} start
 * @return {Primise<?Program[]>}
 */
module.exports = (searchWords, type = '1+2+3', start = '1') => {
  const axios = require('axios');
  const { JSDOM } = require('jsdom');
  const moment = require('moment');

  return new Promise((resolve, reject) => {
    const url = `https://tv.yahoo.co.jp/search/?q=${searchWords}&t=${type}&s=${start}`;
    const tomorrow = Number(moment().add(1, 'd').format('MDD'));
    const programList = [];

    axios.get(url).then(res => {
      const document = new JSDOM(res.data).window.document;
      const eleList = Array.from(document.querySelectorAll('.programlist li'));
      for (let ele of eleList) {
        let [date, time] = ele.getElementsByClassName('leftarea')[0].textContent.trim().split('\n');
        let mdd = Number(moment(date.replace(/（.）/, ''), 'M/D').format('MDD'));
        if (mdd > tomorrow) break;

        let rightareas = ele.getElementsByClassName('rightarea')[0].children;
        let obj = {
          date: date,
          time: time,
          name: rightareas[0].textContent,
          href: `https://tv.yahoo.co.jp/${rightareas[0].querySelector('a').href}`,
          broadcaster: rightareas[1].children[0].textContent,
          detail: rightareas[2].textContent,
        }
        if (!isNGPrograms(obj)) programList.push(obj);
      }
      resolve(programList);
    }).catch(err => {
      console.error('axios で通信する際にエラーが発生しました。 at src/getPrograms.js')
      console.error(err);
      console.error(JSON.stringify({
        searchWords,
        type,
        start,
        url,
        tomorrow
      }, null, '\t'));
      console.error()
      reject(null);
    });
  });
}

/**
 * NG ワードに登録されているか
 * @param {Program} obj
 * @return {boolean}
 */
function isNGPrograms (obj) {
  const { NGWordsList } = require('./store.js');
  for (let NGWords of NGWordsList) {
    let hasNGWords = Object.entries(NGWords).every(([key, words]) => {
      return words.every(word => obj[key].includes(word));
    });
    if (hasNGWords) return true;
  }
  return false;
}
