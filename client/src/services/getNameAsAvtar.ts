export default function getNameAsAvtar(name: string) {
  const names = name.split(" ");
  const n = names.length;
  if (n > 3) {
    return `${names[0][0].toUpperCase()}${names[n - 1][0].toUpperCase()}`;
  } else {
    return names.map((name) => name[0].toUpperCase()).join("");
  }
}
