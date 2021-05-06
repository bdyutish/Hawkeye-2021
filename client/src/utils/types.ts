import { ReactElement } from "react";

export type Nullable<T> = T | null;

export type Children = {
  children: ReactElement | ReactElement[];
};

export type User = {
  _id: string;
  name: string;
  email: string;
};
