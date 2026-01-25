import type { User } from "./login";

class LocalSpace {
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getExpiresAt(): number | null {
    const expiresAt = localStorage.getItem("expiresAt");
    const expiresAtNumber = Number(expiresAt);
    return isNaN(expiresAtNumber) || expiresAtNumber === 0
      ? null
      : expiresAtNumber;
  }

  getUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  setAccessToken(token: string): void {
    localStorage.setItem("accessToken", token);
    window.dispatchEvent(new Event("auth-change"));
  }

  setExpiresAt(expiresIn: string): void {
    const expiresAt = Date.now() + Number(expiresIn) * 1000;
    localStorage.setItem("expiresAt", String(expiresAt));
    window.dispatchEvent(new Event("auth-change"));
  }

  setUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  }

  removeAccessToken(): void {
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("auth-change"));
  }

  removeExpiresAt(): void {
    localStorage.removeItem("expiresAt");
    window.dispatchEvent(new Event("auth-change"));
  }

  removeUser(): void {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
  }
}

export default new LocalSpace();
