'use strict'

const { pushMessage } = require('./push.js');
const { searchPrograms, sleep } = require('./searchPrograms.js');

const rmReair = programList => programList.filter(program => !program.detail.includes('再放送'));
const rmJSports4 = programList => programList.filter(program => !program.boradcaster.includes('J SPORTS 4'));

exports.handler = async (event, context, callback) => {
  const programList = [];
  programList.push(await notifyPrograms('F1 LEGENDS', 2));
  programList.push(await notifyPrograms('F1 グランプリ フジテレビ', 12, rmReair));
  programList.push(await notifyPrograms('フォーミュラE選手権', 12, rmJSports4));
  programList.push(await notifyPrograms('【生】 インディカー ', 12));
  programList.push(await notifyPrograms('SUPER GT', 123));
  programList.push(await notifyPrograms('スーパーフォーミュラ', 123));
  programList.push(await notifyPrograms('【生】 MotoGP', 12));
  programList.push(await notifyPrograms('WEC', 12));
  programList.push(await notifyPrograms('WEC', 12));
  programList.push(await notifyPrograms('ル・マン', 12));

  programList.push(await notifyPrograms('全豪オープンテニス NHK', 13));
  programList.push(await notifyPrograms('全仏 テニス', 123));
  programList.push(await notifyPrograms('ウィンブルドン NHK', 13));
  programList.push(await notifyPrograms('全米 テニス', 123));

  programList.push(await notifyPrograms('さまぁ～ず', 3));
  programList.push(await notifyPrograms('にちようチャップリン', 3));
  programList.push(await notifyPrograms('家、ついて行ってイイですか', 3));
  programList.push(await notifyPrograms('水曜日のダウンタウン', 3));
  programList.push(await notifyPrograms('探偵!ナイトスクープ', 3));
  programList.push(await notifyPrograms('ドキュメント72時間', 3));
  programList.push(await notifyPrograms('有吉の壁', 3));

  programList.push(await notifyPrograms('金曜ロードSHOW', 3));
  programList.push(await notifyPrograms('プレミアムシネマ', 3));

  programList.push(await notifyPrograms('エヴァンゲリオン', 123));
  return programList;
};

async function notifyPrograms (searchWords, type) {
  const programList = await searchPrograms(searchWords, type);
  if (!programList.length) return false;
  pushMessage(`「${searchWords}」を含む番組が${programList.length}件見つかりました。`);
  await sleep(1000);
  for (let program of programList) {
    let msg = `【日時】${program.date}${program.time}\n【番組名】${program.name}\n【放送局】${program.broadcaster}\n【詳細】${program.detail}`;
    pushMessage(msg);
    await sleep(1000);
  }
  console.table(programList);
  return programList;
}
