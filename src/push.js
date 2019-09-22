'use strict'

/**
 * @typedef Response
 * @property {number} statusCode
 * @property {Object} response
 */

/**
 * @param {Program[]}
 * @return {Promise<Response>}
 */
module.exports = async ({ searchWords, allProgramList }) => {
  const line = require('@line/bot-sdk');
  const dotenvConfig = require('dotenv').config();

  return new Promise((resolve, reject) => {
    if (typeof process.env.CHANNEL_ACCESS_TOKEN === 'undefined') {
      console.error(dotenvConfig);
      console.error({ CHANNEL_ACCESS_TOKEN: process.env.CHANNEL_ACCESS_TOKEN });
      throw new Error('process.env.CHANNEL_ACCESS_TOKEN が設定されていません。');
    }
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    });

    const msgs = makeMsgs(searchWords, allProgramList);

    client.pushMessage(process.env.USER_ID, msgs).then((res) => {
      resolve({
        statusCode: 200,
        response: res
      });
    }).catch((err) => {
      console.error(err);
      console.error(JSON.stringify({
        searchWords,
        allProgramList,
        msgs
      }, null, '\t'));
      reject({
        statusCode: 400,
        response: err
      });
    });
  });
};

function makeMsgs (searchWords, allProgramList) {
  const carouselTemplate = require('./template.js');

  const counts = `「${searchWords}」を含む番組が${allProgramList.length}件見つかりました。`;
  const countMsg = {
    type: 'text',
    text: counts
  };

  const allProgramLists = [];
  while (allProgramList.length) {
    allProgramLists.push(allProgramList.splice(0, 10));
  }

  const carouselsList = [];
  for (let programList of allProgramLists) {
    /**
     * @todo carousel が最後のに上書きされる
     */
    let carousel = Object.assign({}, carouselTemplate);
    carousel.altText = counts;
    carousel.template.columns = programList.map(program => {
      return {
        title: abbrText(program.name, 40),
        text: abbrText(`${program.date}${program.time}\n${program.broadcaster}\n${program.detail}`, 60),
        actions: [
          {
            type: 'uri',
            label: 'Googleカレンダーに追加',
            uri: program.calendarUrl
          },
          {
            type: 'uri',
            label: '詳細',
            uri: program.href
          }
        ]
      };
    });
    // return carousel;
    carouselsList.push(carousel);
  }
  return [countMsg, ...carouselsList];
}

/**
 * text の長さが length 以上のときは省略する
 * @param {string} text
 * @param {number} length
 * @return {string}
 */
function abbrText(text, length) {
  return text.length >= length ? `${text.substring(0, length - 1)}…` : text;
}
