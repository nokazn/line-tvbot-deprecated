'use strict'

/**
 * msg をプッシュ通知
 * @param {string} msg
 * @return {Promise<{statusCode: number, response: string}>}
 */
module.exports = async msg => {
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

    const message = {
      type: 'text',
      text: msg
    };

    client.pushMessage(process.env.USER_ID, message).then((res) => {
      console.info(res);
      resolve({
        statusCode: 200,
        response: res
      });
    }).catch((err) => {
      console.error(err);
      reject({
        statusCode: 400,
        response: err
      });
    });
  });
};
