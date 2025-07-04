export interface User {
  google_id:string,
  name:string,
  first_name:string,
  last_name:string,
  email:string,
  email_verified_at:string |null,
  profile_picture:string | null,
  last_login:string | null,
}

export interface UserState {
  user: User | null;
  connected: boolean;
  error: string | null;
}