export function percentCompute(planTimeNum, startTimeNum) {
  // 返回时间戳的实际时间，并且返回带小数的400
  const newTime = new Date().getTime()
  const passTime = newTime - startTimeNum
  const allPassTime = planTimeNum - startTimeNum
  const percentPass = passTime / allPassTime
  return (percentPass.toFixed(4)) * 100
}

export function planTimeUse(planMinute) {
  const nowTime = new Date().getTime()
  const planTime = planMinute * 60000 + nowTime
  return planTime
}
