import Cookies from "js-cookie"

const TOKEN_KEY = "token"
const ROLE_KEY = "role"

export type UserRole = "partner" | "employee"

export function setToken(token: string, rememberMe = false) {
  const expires = rememberMe ? 30 : 0.5
  Cookies.set(TOKEN_KEY, token, {
    secure: true,
    sameSite: "strict",
    expires,
  })
}

export function getToken() {
  return Cookies.get(TOKEN_KEY) || null
}

export function setRole(role: UserRole, rememberMe = false) {
  const expires = rememberMe ? 30 : 0.5
  Cookies.set(ROLE_KEY, role, {
    secure: true,
    sameSite: "strict",
    expires,
  })
}

export function getRole(): UserRole | null {
  const role = Cookies.get(ROLE_KEY)
  if (role === "partner" || role === "employee") return role
  return null
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(ROLE_KEY)
}
