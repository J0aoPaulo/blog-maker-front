import { UserResponse } from "./user-response.model";

export interface AuthResponse {
  token: string;
  user: UserResponse
}