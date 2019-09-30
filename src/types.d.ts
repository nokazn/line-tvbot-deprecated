import * as line from '@line/bot-sdk';

export interface Program {
  date: string;
  time: string;
  name: string;
  calendarUrl: string;
  href: string;
  broadcaster: string;
  detail: string;
  [index: string]: string;
}

export interface NGWords {
  name?: string[];
  broadcaster?: string[];
  detail?: string[];
}

export type SearchWord = [string, number];

export interface ParsedDate {
  mdd: number;
  calendarTime: string;
}

export interface MyResponse {
  statusCode: number;
  response: line.MessageAPIResponseBase;
}
