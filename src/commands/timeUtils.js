/*
  Note: the 'sprints' generated by these methods are not necessarily
  the final sprint object - they generate only sprint start and end times,
  and as such it may not be appropriate to call the result a 'sprint' yet.
*/

export const generateSprintInDeltaWithEndTime = (timestamp, delta, endMin) => {
  // TODO write some dang tests for this!
  // timestamp, a number representing a time
  // delta, a number between 1 and 60
  // endMin, a number between 0 and 59
  const start = new Date(timestamp)
  start.setMinutes(start.getMinutes() + delta)
  start.setSeconds(0)
  start.setMilliseconds(0)
  const end = new Date(start) // TODO refactor out the common subcomponents for making times
  end.setMinutes(endMin)
  if (end <= start) {
    end.setHours(end.getHours() + 1)
  }
  return {
    start: start,
    end: end,
  }
}

export const generateSprintInDeltaWithDuration = (
  timestamp,
  delta,
  duration
) => {
  // TODO write some dang tests for this!
  // timestamp, a number representing a time
  // delta, a number between 1 and 60
  // duration, a number between 1 and 60
  const start = new Date(timestamp)
  start.setMinutes(start.getMinutes() + delta)
  start.setSeconds(0)
  start.setMilliseconds(0)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + duration)
  return {
    start: start,
    end: end,
  }
}

export const generateSprintWithEndTime = (timestamp, startMin, endMin) => {
  // timestamp, a number representing a time
  // startMin, a number between 0 and 59
  // endMin, a number between 0 and 59
  const start = new Date(timestamp)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - timestamp
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - timestamp
  }
  const end = new Date(start)
  end.setMinutes(endMin)
  if (end <= start) {
    end.setHours(end.getHours() + 1)
  }
  return {
    start: start,
    end: end,
  }
}

export const generateSprintWithDuration = (timestamp, startMin, duration) => {
  // timestamp, a number representing a time
  // start, a number between 0 and 59
  // duration, a number between 1 and 60
  const start = new Date(timestamp)
  start.setMinutes(startMin)
  start.setSeconds(0)
  start.setMilliseconds(0)
  let timeout = start.getTime() - timestamp
  if (timeout < 0) {
    start.setHours(start.getHours() + 1)
    timeout = start.getTime() - timestamp
  }
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + duration)
  return {
    start: start,
    end: end,
  }
}
