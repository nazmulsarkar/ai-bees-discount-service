import * as dayjs from 'dayjs';

export const chunk = (arr: any[], size: number): any[] =>
  arr.reduce(
    (acc, e, i) => (
      i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc
    ),
    [],
  );

export function formatDate(
  date: string | Date,
  format = 'DD MMMM, YYYY',
): string {
  return dayjs(date).isValid() && dayjs(date).format(format);
}

export function validateDate(date: string | Date) {
  return dayjs(date).isValid();
}
