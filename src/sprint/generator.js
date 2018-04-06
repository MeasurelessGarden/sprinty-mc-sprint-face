export const generateSprintWithDuration = (now, startMin, duration) => {
  // now, a datetime TODO test inputs are valid
  // start, a number between 0 and 59
  // duration, a number between 1 and 60
  const start = new Date(now)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - now.getTime()
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - now.getTime()
  }
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + duration)
  return {
    start: start,
    end: end,
  }
}

export const generateSprintWithEndTime = (now, startMin, endMin) => {
  // now, a datetime
  // startMin, a number between 0 and 59
  // endMin, a number between 0 and 59
  const start = new Date(now)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - now.getTime()
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - now.getTime()
  }
  const end = new Date(start)
  end.setMinutes(endMin)
  if (end < start) {
    end.setHours(end.getHours() + 1)
  }
  return {
    start: start,
    end: end,
  }
}
