import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"

const ADMIN_TOKEN_KEY = "admin_token"

interface AdminTokenPayload {
  sub: string
  role: string
  exp: number
  iat: number
}

export function setAdminToken(token: string) {
  Cookies.set(ADMIN_TOKEN_KEY, token, {
    secure: true,
    sameSite: "strict",
    expires: 1, // 1 day
  })
}

export function getAdminToken() {
  return Cookies.get(ADMIN_TOKEN_KEY) || null
}

export function clearAdminToken() {
  Cookies.remove(ADMIN_TOKEN_KEY)
}

export function decodeAdminToken(): AdminTokenPayload | null {
  const token = getAdminToken()
  if (!token) return null

  try {
    const decoded = jwtDecode<AdminTokenPayload>(token)

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      clearAdminToken()
      return null
    }

    return decoded
  } catch {
    clearAdminToken()
    return null
  }
}
