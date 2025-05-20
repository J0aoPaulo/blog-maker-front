export interface PostResponse {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  theme?: string;
  themeId?: number;
  name: string;
  userId: string;
  userRole: string;
  userPhoto?: string;
}
