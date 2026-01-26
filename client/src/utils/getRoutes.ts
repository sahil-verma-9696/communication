import { friendChilds } from "@/_routes";

export function getFriendChildrenRoutes(): string[] {
  return friendChilds.filter((c) => !!c.path).map((child) => child.path!);
}
