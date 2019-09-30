import axios from 'axios';
import { JSDOM } from 'jsdom';
import moment from 'moment';
import 'moment-timezone'
import { Program, ParsedDate } from './types'
import { NGWordsList } from './store';

/**
 * searchWords に合致するテレビ番組の情報を取得
 */
export default function (searchWords: string, type = '1+2+3', start = '1'): Promise<Program[]> {
  return new Promise<Program[]>((resolve: (value: Program[]) => void, reject: (reason: []) => void) => {
    moment.tz.setDefault('Asia/Tokyo');
    const url = `https://tv.yahoo.co.jp/search/?q=${searchWords}&t=${type}&s=${start}`;
    const tomorrow = Number(moment().add(1, 'd').format('MDD'));
    const programList: Program[] = [];
    let eleList: Element[];

    axios.get(url).then((res: any) => {
      const document = new JSDOM(res.data).window.document;
      eleList = Array.from(document.querySelectorAll('.programlist li'));
      for (let ele of eleList) {
        let leftarea = ele.getElementsByClassName('leftarea')[0].textContent;
        let rightareas = ele.getElementsByClassName('rightarea')[0].children;
        let obj: Program;
        if (leftarea) {
          let [date, time] = leftarea.trim().split('\n');
          let parsedDate = parseDate(date, time);
          if (parsedDate.mdd > tomorrow) break;

          let name = rightareas[0].textContent;
          if (name === null) continue;
          let calendarUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${encodeURIComponent(parsedDate.calendarTime)}`;

          let a = rightareas[0].querySelector('a');
          if (a === null) continue;
          let href = `https://tv.yahoo.co.jp/${a.href}`;

          let broadcaster = rightareas[1].children[0].textContent;
          if (broadcaster === null) continue;

          let detail = rightareas[2].textContent;
          if (detail === null) continue;

          obj = { date, time, name, calendarUrl, href, broadcaster, detail };
          if (!_isNGPrograms(obj)) programList.push(obj);
        } else {
          console.error('.programlist li .leftarea が見つかりませんでした。', 'at getPrograms');
        }
      }
      resolve(programList);
    }).catch((e: Error) => {
      console.error(e);
      console.error('axios で通信する際にエラーが発生しました。 at src/getPrograms.js')
      console.error(JSON.stringify({ searchWords, type, start, url, tomorrow, eleList }, null, '\t'));
      reject([]);
    });
  });
}

/**
 * @param {string} date - M/D（AAA）形式の日付
 * @param {string} times - H:mm～H:mm 形式の時間
 * @todo YYYY が現在の年になるので年末はバグる
 */
function parseDate (date: string, times: string): ParsedDate {
  date = date.replace(/（.）/, '');
  const mdd = Number(moment(date, 'M/D').format('MDD'));
  const timeList = times.split('～');
  const start = _calendarTime(date, timeList[0]);
  const end = _calendarTime(date, timeList[1]);
  return {
    mdd: mdd,
    calendarTime: `${start}/${end}`
  };

  /**
   * 24時以降の時間を修正し、YYYYMMDDYHHmm00 形式にする
   * @param {string} date - M/D 形式の日付
   * @param {string} time - H:mm 形式の時間
   * @return {string} YYYYMMDD 'T' HHmm '00' 形式
   */
  function _calendarTime (date: string, time: string): string {
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
 */
function _isNGPrograms (obj: Program): boolean {
  for (let NGWords of NGWordsList) {
    let hasNGWords = Object.entries(NGWords).every(([key, wordList]: [string, string[]]) => {
      return wordList.every((word: string) => obj[key].includes(word));
    });
    if (hasNGWords) return true;
  }
  return false;
}
