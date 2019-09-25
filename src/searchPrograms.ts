import getPrograms from './getPrograms';
import sleep from './sleep';
import { max } from './store';
import { Program } from 'types';

/**
 * searchWords に合致するテレビ番組の情報を複数ページから取得
 */
export default async function (searchWords: string, typeNum: number): Promise<Program[]> {
  searchWords = searchWords.split(/\s/g).map(word => encodeURIComponent(word)).join('+');
  const type = String(typeNum).split('').join('+');
  const allProgramList: Program[] = [];
  while (allProgramList.length < max) {
    let start = String(allProgramList.length + 1);
    // let programs = await getPrograms(searchWords, type, start);
    getPrograms(searchWords, type, start).then(programs => {
      allProgramList.push(...programs);
      if (programs.length < 10) break;
    });
    await sleep(1500);
  }
  return allProgramList;
}
