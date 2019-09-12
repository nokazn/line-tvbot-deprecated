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
    }
    const client = new line.Client({
      channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    });

    const counts = `「${searchWords}」を含む番組が${allProgramList.length}件見つかりました。`;
    const countMessage = {
      type: 'text',
      text: counts
    };

    const carousel = require('./template.js');
    carousel.altText = counts;
    carousel.template.columns = allProgramList.map(program => {
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

    client.pushMessage(process.env.USER_ID, [countMessage, carousel]).then((res) => {
      resolve({
        statusCode: 200,
        response: res
      });
    }).catch((err) => {
      console.error(err);
      console.error(JSON.stringify({
        searchWords,
        allProgramList,
        carousel
      }, null, '\t'));
      reject({
        statusCode: 400,
        response: err
      });
    });
  });
};

/**
 * text の長さが length 以上のときは省略する
 * @param {string} text
 * @param {number} length
 * @return {string}
 */
function abbrText(text, length) {
  return text.length >= length ? `${text.substring(0, length - 1)}…` : text;
}
