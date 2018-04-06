export const generateSprintWithDuration = (now, startMin, duration) => {
  // now, a datetime
  // start, a number between 0 and 59
  // duration, a number between 1 and 60
  const start = new Date(now)
  return {
    start: new Date(Date.parse('April 5, 2018 2:15 pm')),
    end: new Date(Date.parse('April 5, 2018 2:45 pm')),
  }
}
/*
start.setMinutes(Number(args[0]))
start.setSeconds(0)
start.setMilliseconds(0)
timeout = start.getTime() - now.getTime()
if (timeout < 0) {
  start.setHours(start.getHours() + 1)
  timeout = start.getTime() - now.getTime()
}
const defaultMinutes = 2
end.setHours(start.getHours())
end.setMinutes(start.getMinutes() + defaultMinutes)
end.setSeconds(0)
end.setMilliseconds(0)
client.setTimeout(startSprint, timeout, start.getTime())
client.setTimeout(
  endSprint,
  end.getTime() - now.getTime(),
  start.getTime()
)
cache[start.getTime()] = {
  // sprint definition
  start: start,
  end: end,
  channel: message.channel,
}
*/
