import requestUse from '@/utils/requestUse'
export function createOrianism(data) {
  return requestUse({
    url: '/createOri',
    method: 'post',
    data
  })
}

export function getOrianism(params) {
  return requestUse({
    url: '/getOri',
    method: 'get',
    params
  })
}
export function getOrianismName(params) {
  return requestUse({
    url: '/getOrianismName',
    method: 'get',
    params
  })
}
export function createGroup(data) {
  return requestUse({
    url: '/creatGroup',
    method: 'post',
    data
  })
}
export function getGroup(params) {
  return requestUse({
    url: '/getGroup',
    method: 'get',
    params
  })
}
