import Cookies from "js-cookie"

const TOKEN_KEY = "token"

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

export function clearToken() {
  Cookies.remove(TOKEN_KEY)
}
