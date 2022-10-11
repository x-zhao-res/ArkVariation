export function setToken(tokenKey, token) {
  return localStorage.setItem(tokenKey, token)
}

export function getToken(tokenKey) {
  if (localStorage.getItem((tokenKey))) {
    return localStorage.getItem(tokenKey)
  } else {
    return null
  }
}

export function removeToken(tokenKey) {
  return localStorage.removeItem(tokenKey)
}
