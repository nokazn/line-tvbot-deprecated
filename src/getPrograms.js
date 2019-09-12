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
        let calendarUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${encodeURIComponent(parsedDate.calendarTime)}`;

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
 * @todo YYYY が現在の年になるので年末はバグる
 */
function parseDate (date, times) {
  const moment = require('moment');
  date = date.replace(/（.）/, '');
  times = times.split('～');
  const mdd = Number(moment(date, 'M/D').format('MDD'));
  const start = calendarTime(date, times[0]);
  const end = calendarTime(date, times[1]);
  return {
    mdd: mdd,
    calendarTime: `${start}/${end}`
  };

  /**
   * 24時以降の時間を修正し、YYYYMMDDYHHmm00 形式にする
   * @param {string} date - M/D 形式の日付
   * @param {string} time - H:mm 形式の時間
   */
  function calendarTime (date, time) {
    const moment = require('moment');
    const hour = Number(time.split(':')[0]);
    if (hour >= 24) {
      time = time.replace(/^(2[4-9])|(3[0-9])/, String(hour - 24));
      date = moment(date, 'M/D').add(1, 'days').format('M/D');
    }
    return moment(`${date} ${time}`, 'M/D H:mm').format('YYYYMMDDTHHmm00');
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
