export function strCaptalize(str?: string) {
  if (!str) return "";
  return str
    .split(" ")
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
}

export function strArrCaptalize(strArr: string[]) {
  return strArr.map((str) => str.charAt(0).toUpperCase() + str.slice(1));
}

export function seprateBySpaces(str?: string) {
  if (!str) return "";
  const regex = /[\s-]+/g;
  return str.split(regex).join(" ");
}

export const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
