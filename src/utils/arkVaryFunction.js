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
