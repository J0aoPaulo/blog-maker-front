export interface CreatePostRequest {
  title: string;
  content: string;
  userId: string;
  themeId?: string;
}
