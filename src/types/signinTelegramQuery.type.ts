export default interface SignInTelegramQuery {
  id: number;
  hash: string;
  auth_date: number;
  username?: string;
  last_name?: string;
  photo_url?: string;
  first_name?: string;
}
