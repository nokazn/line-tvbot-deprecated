import line from '@line/bot-sdk';
import dotenv from 'dotenv';
import { Program, MyResponse } from 'types.d';

/**
 * @param {Program[]}
 * @return {Promise<Response>}
 */
export default async function ({ searchWords, allProgramList }: { searchWords: string, allProgramList: Program[]}): Promise<MyResponse> {
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

    const msgs = _makeMsgs(searchWords, allProgramList);

    client.pushMessage(process.env.USER_ID, msgs).then((res: ResponseType) => {
      resolve({
        statusCode: 200,
        response: res
      });
    }).catch((e: Error) => {
      console.error(e);
      console.error(JSON.stringify({searchWords ,allProgramList ,msgs }, null, '\t'));
      reject({
        statusCode: 400,
        response: e
      });
    });
  });
};

function _makeMsgs (searchWords: string, allProgramList: Program[]) {
  const counts = `「${searchWords}」を含む番組が${allProgramList.length}件見つかりました。`;
  const countMsg = {
    type: 'text',
    text: counts
  };

  const allProgramLists: Program[][] = [];
  while (allProgramList.length) {
    allProgramLists.push(allProgramList.splice(0, 10));
  }

  const carouselsList = [];
  for (let [i, programList] of Array.from(allProgramLists.entries())) {
    carouselsList.push({
      type: 'template',
      altText: counts,
      template: {
        type: 'carousel',
        columns: [],
        imageAspectRatio: 'rectangle',
        imageSize: 'cover'
      }
    });
    carouselsList[i].template.columns = programList.map(program => {
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
  }
  return [countMsg, ...carouselsList];
}

/**
 * text の長さが length 以上のときは省略する
 */
function abbrText(text: string, length: number): string {
  return text.length >= length ? `${text.substring(0, length - 1)}…` : text;
}
