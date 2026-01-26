export function splitDate(date: Date) {
  const [hour, minutes] = date.toLocaleTimeString().split(":")
  return { day: date, hour: `${hour}:${minutes}` }
}

export function addMinutes(horaStr: string, minutesToAdd: number): Date {
  const [hora, minuto] = horaStr.split(":").map(Number)
  const data = new Date()
  data.setHours(hora)
  data.setMinutes(minuto)
  data.setSeconds(0)
  data.setMilliseconds(0)
  data.setMinutes(data.getMinutes() + minutesToAdd)

  return data
}

export class DateUtils {
  private constructor() {}

  static now(): Date {
    return new Date()
  }

  static nowInSeconds(): number {
    return Math.floor(Date.now() / 1000)
  }

  static currentTimestamp(): number {
    return Math.floor(Date.now() / 1000)
  }

  static parse(date: Date | string): Date {
    if (typeof date === "string") {
      if (date.match("^([0-9]{4})-([0-9]{2})-([0-9]{2})$")) {
        return DateUtils.parseDateFromString(date)
      }
      return DateUtils.parseFromString(date)
    }
    return date
  }

  static parseFromString(dateString: string) {
    return new Date(dateString)
  }

  private static toDate(date: Date): Date {
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
  }

  static parseDateFromString(date: string) {
    return DateUtils.toDate(new Date(date))
  }

  static parseToStringFromDate(date: Date) {
    return DateUtils.toDate(new Date(date)).toISOString()
  }

  static combineDateAndTimeUTC(date: Date, time: string): Date {
    const [hour, minute = 0] = time.split(":").map(Number)
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        hour,
        minute,
        0,
        0
      )
    )
  }
}
