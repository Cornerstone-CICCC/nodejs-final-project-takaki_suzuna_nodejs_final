import type { AuthResponse, Room, User } from "../types/game";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/$/,
  "",
);

type RequestOptions = { body?: unknown; method?: string };

async function request<T>(
  path: string,
  { body, method = "GET" }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;

  if (!response.ok) {
    const message =
      (typeof data === "string" ? data : data?.message) ?? "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  signup(username: string, email: string, password: string) {
    return request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: { username, email, password },
    });
  },
  me() {
    return request<{ success: boolean; user: User }>("/auth/me");
  },
  logout() {
    return request<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
    });
  },
};

export const roomApi = {
  create() {
    return request<Room>("/room", { method: "POST" });
  },
  join(roomCode: string) {
    return request<Room>("/room/join", { method: "POST", body: { roomCode } });
  },
  get(roomCode: string) {
    return request<Room>(`/room/${encodeURIComponent(roomCode)}`);
  },
};
