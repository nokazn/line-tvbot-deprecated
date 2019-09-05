'use strict'

const axios = require('axios');
const { JSDOM } = require('jsdom');
const moment = require('moment');

function getPrograms (searchWords, type = 123, start = 0) {
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
        const leftarea = ele.getElementsByClassName('leftarea')[0];
        const rightarea = ele.getElementsByClassName('rightarea')[0];

        const [date, time] = Array.from(leftarea.children).map(child => child.textContent);
        const mdd = Number(moment(date.replace(/（.）/, ''), 'M/D').format('MDD'));
        if (mdd > tomorrow) break;
        const name = rightarea.children[0].textContent;
        const broadcaster = rightarea.children[1].children[0].textContent;
        const detail = rightarea.children[2].textContent;
        programList.push({ date, time, name, broadcaster, detail });
      }
      resolve(programList);
    }).catch(err => {
      console.error(err);
      reject();
    })
  })
}

module.exports.getPrograms = getPrograms;
