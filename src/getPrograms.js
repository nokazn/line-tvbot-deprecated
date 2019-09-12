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
        let parsedDate = parseDate(date, time);
        if (parsedDate.mdd > tomorrow) break;

        let rightareas = ele.getElementsByClassName('rightarea')[0].children;
        let name = rightareas[0].textContent;
        let href = `https://tv.yahoo.co.jp/${rightareas[0].querySelector('a').href}`;
        let broadcaster = rightareas[1].children[0].textContent;
        let detail = rightareas[2].textContent;
        let calendarUrl = `https://www.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(name)}&details=${encodeURIComponent(detail)}&dates=${parsedDate.calendarTime}`;

        let obj = { date, time, name, href, broadcaster, detail, calendarUrl };
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
        tomorrow,
        eleList
      }, null, '\t'));
      console.error()
      reject(null);
    });
  });
}

/**
 * @param {string} date - M/D（AAA）形式の日付
 * @param {string} times - H:mm～H:mm 形式の時間
 * @return {mdd: number, calendarTime: string}
 */
function parseDate (date, times) {
  const moment = require('moment');
  date = date.replace(/（.）/, '');
  times = times.split('～');
  const mdd = Number(moment(date).format('MDD'));
  const start = moment(`${date} ${times[0]}`, 'M/D H:mm').format('YYYYMMDDTHHmm00');
  const end = moment(`${date} ${times[1]}`, 'M/D H:mm').format('YYYYMMDDTHHmm00');
  return {
    mdd: mdd,
    calendarTime: `${start}/${end}`
  }
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
