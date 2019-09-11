'use strict'

/**
 * searchWords に合致するテレビ番組の情報を取得
 * @param {string} searchWords
 * @param {number} type
 * @param {number} start
 * @return {Primise<?object[]>}
 */
module.exports = (searchWords, type = 123, start = 0) => {
  const axios = require('axios');
  const { JSDOM } = require('jsdom');
  const moment = require('moment');

  return new Promise((resolve, reject) => {
    const baseUrl = 'https://tv.yahoo.co.jp/';
    searchWords = searchWords.split(/\s/g).map(word => encodeURIComponent(word)).join('+');
    type = type.toString().split('').join('+');
    start = start.toString();
    const url = `${baseUrl}search/?q=${searchWords}&t=${type}&s=${start}`;
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
          broadcaster: rightareas[1].children[0].textContent,
          detail: rightareas[2].textContent,
        }
        if (!isNGPrograms(obj)) programList.push(obj);
      }
      resolve(programList);
    }).catch(err => {
      console.error(err);
      reject(null);
    });
  });
}

/**
 * @typedef {Object} Program
 * @property {string} date
 * @property {string} time
 * @property {string} name
 * @property {string} broadcaster
 * @property {string} detail
 */

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
