import { Theme } from "./theme.model";
import { User } from "./user.model";

export interface Post {
  id? : number;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  theme: Theme;
  user: User;
}
