import requestUse from '@/utils/requestUse'

export function testUse() {
  return requestUse({
    url: '/testusepage',
    method: 'post'
  })
}

export function login(data) {
  return requestUse({
    url: '/login',
    method: 'post',
    data
  })
}

export function refresh_token(data) {
  return requestUse({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}
