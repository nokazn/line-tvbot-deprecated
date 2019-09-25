export interface Program {
  date: string | null;
  time: string | null;
  name: string | null;
  calendarUrl: string | null;
  href: string | null;
  broadcaster: string | null;
  detail: string | null;
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
  response: {};
}
