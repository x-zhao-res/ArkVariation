export function ProgressUse(data) {
  const Interval = data.fuckInterval * 60000 // 转换成毫秒时间戳
  const lastFucktime = parseInt(data.lastFuckTime) // 上次交配时间戳
  const readyFuckDone = Interval + lastFucktime // 理论完成最大值
  const nowData = new Date().getTime() // 当前时间
  if (nowData > readyFuckDone) {
    return 100
  } else {
    const percent = (nowData - lastFucktime) / Interval
    return Math.floor((percent * 10000)) / 100
  }
}
export function timestampToTime(timestamp) {
  var date = new Date(timestamp)// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear()
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
  return Y + '/' + M + '/' + D
}
export function fotUpTime(timeStart, upTime, babyTime) {
  const now = new Date().getTime()
  if (now < (timeStart + babyTime * 60000)) {
    return 0
  }
  if ((timeStart + babyTime * 60000 + upTime * 60000) < now) {
    return 100
  } else {
    return Math.floor(((now - (timeStart + babyTime * 60000)) / (upTime * 60000) * 10000)) / 100
  }
}
export function fotBabyTime(timeStart, upTime, babyTime) {
  const now = new Date().getTime()
  if (timeStart + babyTime * 60000 < now) {
    return 100
  } else {
    return Math.floor(((now - timeStart) / (babyTime * 60000) * 10000)) / 100
  }
}
