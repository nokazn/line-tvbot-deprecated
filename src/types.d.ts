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

/**
 * @todo null check
 */
export type Actions = [
  {
    type: 'uri';
    label: 'Googleカレンダーに追加';
    uri: string | null;
  },
  {
    type: 'uri';
    label: '詳細';
    uri: string | null;
  }
];

/**
 * @todo null check
 */
export interface Columns {
  title: string | null;
  text: string | null;
  actions: Actions;
}

export interface Carousel {
  type: 'template';
  altText: string;
  template: {
    type: 'carousel';
    columns: Columns[];
    imageAspectRatio: 'rectangle';
    imageSize: 'cover';
  }
}
