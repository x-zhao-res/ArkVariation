import requestUse from '@/utils/requestUse'

export function createEventUse(data) {
  return requestUse({
    url: '/eventCreate',
    method: 'post',
    data
  })
}
export function getEvent(params) {
  return requestUse({
    url: '/getEvent',
    method: 'get',
    params
  })
}
