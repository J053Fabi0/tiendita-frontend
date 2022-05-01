import Person from "./Person.type";

export default interface SignInResult {
  message: {
    person: Person;
    authToken: string;
  };
}
