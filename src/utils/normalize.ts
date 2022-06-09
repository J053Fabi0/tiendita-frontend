export default function normalize(string: string) {
  return string.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}
