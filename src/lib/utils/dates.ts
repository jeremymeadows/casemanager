export function dtfmt(pattern: string, datetime: Date = new Date()): string {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const WEEKDAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return pattern
    .replaceAll('yyyy', datetime.getFullYear().toString().padStart(4, '0'))
    .replaceAll('yy', (datetime.getFullYear() % 100).toString().padStart(2, '0'))
    .replaceAll('mmmm', MONTHS[datetime.getMonth()])
    .replaceAll('mmm', MONTHS[datetime.getMonth()].substring(0, 3))
    .replaceAll('mm', (datetime.getMonth() + 1).toString().padStart(2, '0'))
    .replaceAll('dddd', WEEKDAYS[datetime.getDay()])
    .replaceAll('ddd', WEEKDAYS[datetime.getDay()].substring(0, 3))
    .replaceAll('dd', datetime.getDate().toString().padStart(2, '0'))
    .replaceAll('HH', datetime.getHours().toString().padStart(2, '0'))
    .replaceAll('MM', datetime.getMinutes().toString().padStart(2, '0'))
    .replaceAll('SS', datetime.getSeconds().toString().padStart(2, '0'))
    .replaceAll('ss', datetime.getMilliseconds().toString().padStart(2, '0'))
    .replaceAll('zz', datetime.getTimezoneOffset().toString());
}
