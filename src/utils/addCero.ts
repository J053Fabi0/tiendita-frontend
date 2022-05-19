export default function addCero(number: number) {
  return number <= 9 ? "0" + number : number;
}
