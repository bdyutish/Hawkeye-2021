import { ReactElement } from 'react';

export type Nullable<T> = T | null;

export type Children = {
  children: ReactElement | ReactElement[];
};

export type User = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: number;
  regNo: string;
  isBanned: boolean;
  isVerified: boolean;
  score: number;
  lastUnlockedIndex: number;
  regions: Array<RegionType>;
  hawksNest: boolean;
  powerupsHistory: any[];
  inventory: any[];
  strikes: number;
};

//for a particular User
export type RegionType = {
  regionid: string;
  level: Number;
  multiplier: Number;
  isCompleted: boolean;
};

export type QuestionType = {
  hints: Array<string>;
  keywords: Array<string>;
  _id: string;
  text: string;
  level: number;
  region: string;
  __v: number;
};

export type StatsType = {
  atPar: number;
  leading: number;
};
