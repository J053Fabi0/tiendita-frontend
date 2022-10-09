export default interface Person {
  id: number;
  name: string;
  username: string;
  telegramID?: number;
  role: "admin" | "employee";
}
