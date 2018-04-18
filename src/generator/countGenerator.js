// export class SetCount {
//   constructor(value, type) {
//     this.type = type
//     this.set = value
//   }
// }
//
// export class AddCount {
//   constructor(count, previousCount, type) {
//     this.type = type
//     this.add = value
//   }
// }
class Count {
  constructor(previousCount, count, type) {
    this.type = type
    this.count = count
    if (previousCount >= 0) {
      this.delta = count - previousCount
    }
  }
}

export const setCount = (count, type) => {
  return new Count(undefined, count, type)
}

export const addCount = (count, previousCount, type) => {
  if (previousCount && previousCount > 0) {
    return new Count(previousCount, previousCount + count, type)
  }
  return new Count(0, count, type)
}
