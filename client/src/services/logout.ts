import localSpace from "./local-space";

export default async function logout() {
  localSpace.removeAccessToken();
  localSpace.removeExpiresAt();
  localSpace.removeUser();
}
